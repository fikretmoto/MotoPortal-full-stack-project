from __future__ import annotations

import csv
import os
import re
import sys
from contextlib import contextmanager
from datetime import datetime, timezone
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile
from xml.sax.saxutils import escape

ROOT_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT_DIR))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

import django
import psycopg

django.setup()

from apps.catalog.models import (
    Attribute,
    AttributeOption,
    Category,
    CategoryAttribute,
)

CSV_TEMPLATE_PATH = (
    ROOT_DIR / "import_templates" / "products_template.csv"
)
XLSX_TEMPLATE_PATH = (
    ROOT_DIR / "import_templates" / "products_template.xlsx"
)
BASE_PRODUCT_HEADERS = [
    "name",
    "slug",
    "brand_slug",
    "category_slug",
    "product_code",
    "price",
    "currency",
    "stock_status",
    "short_description",
    "description",
    "is_featured",
    "is_active",
]
PRODUCTS_SHEET_NAME = "Products"
OPTIONS_SHEET_NAME = "Options"
TARGET_CATEGORY_SLUG = "motosiklet"
VALIDATION_LAST_ROW = 5000
CATALOG_SOURCE_ENV = "PRODUCTS_TEMPLATE_CATALOG_SOURCE"
CATEGORY_SLUG_ENV = "PRODUCTS_TEMPLATE_CATEGORY_SLUG"
PROD_DATABASE_URL_ENV = "PRODUCTS_TEMPLATE_PROD_DATABASE_URL"
LEGACY_PROD_CATEGORY_SLUG_ENV = (
    "PRODUCTS_TEMPLATE_PROD_CATEGORY_SLUG"
)
PROD_STATEMENT_TIMEOUT_ENV = (
    "PRODUCTS_TEMPLATE_PROD_STATEMENT_TIMEOUT_MS"
)


def main() -> None:
    target_category_slug = get_target_category_slug()
    headers, option_map = load_template_definition(
        target_category_slug
    )
    sample_rows = load_sample_rows(
        headers=headers,
        target_category_slug=target_category_slug,
        path=CSV_TEMPLATE_PATH,
    )
    workbook_parts = build_workbook_parts(
        headers=headers,
        sample_rows=sample_rows,
        option_map=option_map,
    )

    with ZipFile(
        XLSX_TEMPLATE_PATH,
        "w",
        compression=ZIP_DEFLATED,
    ) as archive:
        for archive_path, content in workbook_parts.items():
            archive.writestr(archive_path, content)

    dropdown_columns = ", ".join(option_map) or "none"
    print(f"Created: {XLSX_TEMPLATE_PATH}")
    print(f"Catalog source: {get_catalog_source_mode()}")
    print(f"Category slug: {target_category_slug}")
    print(
        "Attribute columns: "
        f"{', '.join(headers[len(BASE_PRODUCT_HEADERS):]) or 'none'}"
    )
    print(f"Dropdown columns: {dropdown_columns}")


def read_csv_template(
    path: Path,
) -> tuple[list[str], list[list[str]]]:
    with path.open(
        "r",
        encoding="utf-8-sig",
        newline="",
    ) as handle:
        reader = csv.reader(handle)
        rows = list(reader)

    if not rows:
        raise ValueError("CSV template is empty.")

    return rows[0], rows[1:]


def load_template_definition(
    target_category_slug: str,
) -> tuple[list[str], dict[str, list[str]]]:
    source_mode = get_catalog_source_mode()

    if source_mode == "local":
        return load_template_definition_from_local(
            target_category_slug
        )

    if source_mode == "production":
        return load_template_definition_from_production(
            target_category_slug
        )

    raise ValueError(
        f"Unsupported catalog source: {source_mode}"
    )


def load_template_definition_from_local(
    target_category_slug: str,
) -> tuple[list[str], dict[str, list[str]]]:
    if not Category.objects.filter(
        slug=target_category_slug
    ).exists():
        raise ValueError(
            f"Category not found: {target_category_slug}"
        )

    option_map: dict[str, list[str]] = {}
    category_attributes = (
        CategoryAttribute.objects
        .filter(
            category__slug=target_category_slug,
        )
        .select_related("attribute")
        .order_by(
            "display_order",
            "attribute__display_order",
            "attribute__slug",
        )
    )
    attribute_headers = [
        category_attribute.attribute.slug
        for category_attribute in category_attributes
    ]

    if not attribute_headers:
        return list(BASE_PRODUCT_HEADERS), option_map

    attribute_ids_by_slug = {
        category_attribute.attribute.slug:
        category_attribute.attribute_id
        for category_attribute in category_attributes
    }
    option_values_by_attribute_id: dict[int, list[str]] = {}

    option_rows = (
        AttributeOption.objects
        .filter(
            attribute_id__in=attribute_ids_by_slug.values(),
            is_active=True,
        )
        .order_by(
            "attribute_id",
            "display_order",
            "value",
        )
        .values_list(
            "attribute_id",
            "value",
        )
    )

    for attribute_id, option_value in option_rows:
        option_values = option_values_by_attribute_id.setdefault(
            attribute_id,
            [],
        )
        if option_value not in option_values:
            option_values.append(option_value)

    for category_attribute in category_attributes:
        attribute = category_attribute.attribute
        option_values = option_values_by_attribute_id.get(
            attribute.id,
            [],
        )

        if not option_values:
            continue

        option_map[attribute.slug] = list(
            dict.fromkeys(option_values)
        )

    return [
        *BASE_PRODUCT_HEADERS,
        *attribute_headers,
    ], option_map


def load_template_definition_from_production(
    target_category_slug: str,
) -> tuple[list[str], dict[str, list[str]]]:
    database_url = os.environ.get(
        PROD_DATABASE_URL_ENV,
        "",
    ).strip()

    if not database_url:
        raise ValueError(
            f"{PROD_DATABASE_URL_ENV} is required when "
            f"{CATALOG_SOURCE_ENV}=production."
        )

    statement_timeout_ms = int(
        os.environ.get(
            PROD_STATEMENT_TIMEOUT_ENV,
            "15000",
        )
    )
    category_exists_query = f"""
        SELECT 1
        FROM {Category._meta.db_table}
        WHERE slug = %s
        LIMIT 1
    """
    query = f"""
        SELECT
            attribute.id AS attribute_id,
            attribute.slug AS attribute_slug,
            option.value AS option_value
        FROM {CategoryAttribute._meta.db_table} category_attribute
        INNER JOIN {Category._meta.db_table} category
            ON category.id = category_attribute.category_id
        INNER JOIN {Attribute._meta.db_table} attribute
            ON attribute.id = category_attribute.attribute_id
        LEFT JOIN {AttributeOption._meta.db_table} option
            ON option.attribute_id = attribute.id
           AND option.is_active = TRUE
        WHERE category.slug = %s
        ORDER BY
            category_attribute.display_order,
            attribute.display_order,
            attribute.slug,
            option.display_order NULLS LAST,
            option.value NULLS LAST
    """

    attribute_headers: list[str] = []
    option_map: dict[str, list[str]] = {}
    seen_headers: set[str] = set()

    with get_production_cursor(
        database_url=database_url,
        statement_timeout_ms=statement_timeout_ms,
    ) as cursor:
        cursor.execute(
            category_exists_query,
            [target_category_slug],
        )
        if cursor.fetchone() is None:
            raise ValueError(
                f"Category not found: {target_category_slug}"
            )

        cursor.execute(
            query,
            [target_category_slug],
        )
        rows = cursor.fetchall()

    for attribute_id, attribute_slug, option_value in rows:
        if attribute_slug not in seen_headers:
            attribute_headers.append(attribute_slug)
            seen_headers.add(attribute_slug)

        if option_value is None:
            continue

        option_values = option_map.setdefault(
            attribute_slug,
            [],
        )
        if option_value not in option_values:
            option_values.append(option_value)

    return [
        *BASE_PRODUCT_HEADERS,
        *attribute_headers,
    ], option_map


def get_catalog_source_mode() -> str:
    return os.environ.get(
        CATALOG_SOURCE_ENV,
        "local",
    ).strip().lower()


def get_target_category_slug() -> str:
    return (
        os.environ.get(CATEGORY_SLUG_ENV)
        or os.environ.get(LEGACY_PROD_CATEGORY_SLUG_ENV)
        or TARGET_CATEGORY_SLUG
    ).strip()


@contextmanager
def get_production_cursor(
    *,
    database_url: str,
    statement_timeout_ms: int,
):
    with psycopg.connect(
        database_url,
        autocommit=True,
    ) as connection:
        with connection.cursor() as cursor:
            cursor.execute(
                "SET default_transaction_read_only = on"
            )
            cursor.execute(
                f"SET statement_timeout = {statement_timeout_ms}"
            )
            cursor.execute("BEGIN READ ONLY")

            try:
                yield cursor
            finally:
                cursor.execute("ROLLBACK")


def load_sample_rows(
    *,
    headers: list[str],
    target_category_slug: str,
    path: Path,
) -> list[list[str]]:
    if not path.exists():
        return []

    csv_headers, csv_rows = read_csv_template(path)
    header_index_map = {
        header: index
        for index, header in enumerate(csv_headers)
    }
    category_slug_index = header_index_map.get("category_slug")
    if category_slug_index is None:
        return []

    sample_rows: list[list[str]] = []

    for row in csv_rows:
        category_value = (
            row[category_slug_index]
            if category_slug_index < len(row)
            else ""
        )
        if category_value != target_category_slug:
            continue

        projected_row = []
        for header in headers:
            column_index = header_index_map.get(header)
            projected_row.append(
                row[column_index]
                if column_index is not None
                and column_index < len(row)
                else ""
            )
        sample_rows.append(projected_row)

    return sample_rows


def build_workbook_parts(
    *,
    headers: list[str],
    sample_rows: list[list[str]],
    option_map: dict[str, list[str]],
) -> dict[str, str]:
    option_columns = list(option_map.items())
    defined_name_map = {
        slug: f"options_{sanitize_name(slug)}"
        for slug in option_map
    }

    timestamp = datetime.now(
        timezone.utc
    ).replace(microsecond=0).isoformat().replace(
        "+00:00",
        "Z",
    )

    return {
        "[Content_Types].xml": build_content_types_xml(),
        "_rels/.rels": build_root_relationships_xml(),
        "docProps/app.xml": build_app_properties_xml(),
        "docProps/core.xml": build_core_properties_xml(timestamp),
        "xl/workbook.xml": build_workbook_xml(
            option_columns=option_columns,
            defined_name_map=defined_name_map,
        ),
        "xl/_rels/workbook.xml.rels": build_workbook_relationships_xml(),
        "xl/styles.xml": build_styles_xml(),
        "xl/worksheets/sheet1.xml": build_products_sheet_xml(
            headers=headers,
            sample_rows=sample_rows,
            dropdown_slugs=list(option_map.keys()),
            defined_name_map=defined_name_map,
        ),
        "xl/worksheets/sheet2.xml": build_options_sheet_xml(
            option_columns=option_columns,
        ),
    }


def build_content_types_xml() -> str:
    return """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
  <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
  <Override PartName="/xl/worksheets/sheet2.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
</Types>
"""


def build_root_relationships_xml() -> str:
    return """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
</Relationships>
"""


def build_app_properties_xml() -> str:
    return """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">
  <Application>Codex</Application>
</Properties>
"""


def build_core_properties_xml(
    timestamp: str,
) -> str:
    return f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <dc:creator>Codex</dc:creator>
  <cp:lastModifiedBy>Codex</cp:lastModifiedBy>
  <dcterms:created xsi:type="dcterms:W3CDTF">{timestamp}</dcterms:created>
  <dcterms:modified xsi:type="dcterms:W3CDTF">{timestamp}</dcterms:modified>
</cp:coreProperties>
"""


def build_workbook_xml(
    *,
    option_columns: list[tuple[str, list[str]]],
    defined_name_map: dict[str, str],
) -> str:
    defined_names_xml = ""

    if option_columns:
        defined_name_nodes = []
        for column_index, (slug, options) in enumerate(
            option_columns,
            start=1,
        ):
            last_option_row = len(options) + 1
            column_letter = to_column_letter(column_index)
            defined_name_nodes.append(
                "<definedName "
                f"name=\"{defined_name_map[slug]}\">"
                f"'{OPTIONS_SHEET_NAME}'!${column_letter}$2:${column_letter}${last_option_row}"
                "</definedName>"
            )

        defined_names_xml = (
            "<definedNames>"
            f"{''.join(defined_name_nodes)}"
            "</definedNames>"
        )

    return f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <fileVersion appName="xl"/>
  <workbookPr/>
  <bookViews>
    <workbookView xWindow="240" yWindow="15" windowWidth="16095" windowHeight="9660"/>
  </bookViews>
  <sheets>
    <sheet name="{PRODUCTS_SHEET_NAME}" sheetId="1" r:id="rId1"/>
    <sheet name="{OPTIONS_SHEET_NAME}" sheetId="2" state="hidden" r:id="rId2"/>
  </sheets>
  {defined_names_xml}
  <calcPr calcId="191029"/>
</workbook>
"""


def build_workbook_relationships_xml() -> str:
    return """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet2.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>
"""


def build_styles_xml() -> str:
    return """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <fonts count="2">
    <font>
      <sz val="11"/>
      <color theme="1"/>
      <name val="Calibri"/>
      <family val="2"/>
      <scheme val="minor"/>
    </font>
    <font>
      <b/>
      <sz val="11"/>
      <color theme="1"/>
      <name val="Calibri"/>
      <family val="2"/>
      <scheme val="minor"/>
    </font>
  </fonts>
  <fills count="2">
    <fill><patternFill patternType="none"/></fill>
    <fill><patternFill patternType="gray125"/></fill>
  </fills>
  <borders count="1">
    <border><left/><right/><top/><bottom/><diagonal/></border>
  </borders>
  <cellStyleXfs count="1">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0"/>
  </cellStyleXfs>
  <cellXfs count="2">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>
    <xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/>
  </cellXfs>
  <cellStyles count="1">
    <cellStyle name="Normal" xfId="0" builtinId="0"/>
  </cellStyles>
</styleSheet>
"""


def build_products_sheet_xml(
    *,
    headers: list[str],
    sample_rows: list[list[str]],
    dropdown_slugs: list[str],
    defined_name_map: dict[str, str],
) -> str:
    all_rows = [headers, *sample_rows]
    last_column_letter = to_column_letter(len(headers))
    row_nodes = []

    for row_index, row_values in enumerate(all_rows, start=1):
        cell_nodes = []
        for column_index, value in enumerate(row_values, start=1):
            cell_reference = f"{to_column_letter(column_index)}{row_index}"
            style_id = 1 if row_index == 1 else 0
            cell_nodes.append(
                build_inline_string_cell(
                    cell_reference,
                    value,
                    style_id=style_id,
                )
            )

        row_nodes.append(
            f"<row r=\"{row_index}\">{''.join(cell_nodes)}</row>"
        )

    data_validations_xml = ""
    if dropdown_slugs:
        header_index_map = {
            header: index
            for index, header in enumerate(headers, start=1)
        }
        data_validation_nodes = []
        for slug in dropdown_slugs:
            column_letter = to_column_letter(
                header_index_map[slug]
            )
            defined_name = defined_name_map[slug]
            data_validation_nodes.append(
                "<dataValidation "
                "type=\"list\" "
                "allowBlank=\"1\" "
                "showInputMessage=\"1\" "
                "showErrorMessage=\"1\" "
                f"sqref=\"{column_letter}2:{column_letter}{VALIDATION_LAST_ROW}\">"
                f"<formula1>={defined_name}</formula1>"
                "</dataValidation>"
            )

        data_validations_xml = (
            f"<dataValidations count=\"{len(data_validation_nodes)}\">"
            f"{''.join(data_validation_nodes)}"
            "</dataValidations>"
        )

    last_row_number = len(all_rows)
    return f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <dimension ref="A1:{last_column_letter}{last_row_number}"/>
  <sheetViews>
    <sheetView workbookViewId="0">
      <pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/>
      <selection pane="bottomLeft" activeCell="A2" sqref="A2"/>
    </sheetView>
  </sheetViews>
  <sheetFormatPr defaultRowHeight="15"/>
  <sheetData>
    {''.join(row_nodes)}
  </sheetData>
  <autoFilter ref="A1:{last_column_letter}{last_row_number}"/>
  {data_validations_xml}
</worksheet>
"""


def build_options_sheet_xml(
    *,
    option_columns: list[tuple[str, list[str]]],
) -> str:
    if not option_columns:
        return """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <dimension ref="A1:A1"/>
  <sheetViews><sheetView workbookViewId="0"/></sheetViews>
  <sheetFormatPr defaultRowHeight="15"/>
  <sheetData>
    <row r="1"><c r="A1" t="inlineStr" s="1"><is><t xml:space="preserve">No options</t></is></c></row>
  </sheetData>
</worksheet>
"""

    max_rows = max(len(values) for _, values in option_columns) + 1
    row_nodes = []

    for row_index in range(1, max_rows + 1):
        cell_nodes = []
        for column_index, (slug, values) in enumerate(
            option_columns,
            start=1,
        ):
            if row_index == 1:
                value = slug
                style_id = 1
            else:
                value_index = row_index - 2
                value = (
                    values[value_index]
                    if value_index < len(values)
                    else ""
                )
                style_id = 0

            if not value:
                continue

            cell_nodes.append(
                build_inline_string_cell(
                    f"{to_column_letter(column_index)}{row_index}",
                    value,
                    style_id=style_id,
                )
            )

        row_nodes.append(
            f"<row r=\"{row_index}\">{''.join(cell_nodes)}</row>"
        )

    last_column_letter = to_column_letter(len(option_columns))
    return f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <dimension ref="A1:{last_column_letter}{max_rows}"/>
  <sheetViews><sheetView workbookViewId="0"/></sheetViews>
  <sheetFormatPr defaultRowHeight="15"/>
  <sheetData>
    {''.join(row_nodes)}
  </sheetData>
</worksheet>
"""


def build_inline_string_cell(
    cell_reference: str,
    value: str,
    *,
    style_id: int,
) -> str:
    escaped_value = escape(value)
    return (
        f"<c r=\"{cell_reference}\" t=\"inlineStr\" s=\"{style_id}\">"
        f"<is><t xml:space=\"preserve\">{escaped_value}</t></is>"
        "</c>"
    )


def to_column_letter(
    column_number: int,
) -> str:
    result = ""

    while column_number:
        column_number, remainder = divmod(
            column_number - 1,
            26,
        )
        result = chr(65 + remainder) + result

    return result


def sanitize_name(
    value: str,
) -> str:
    sanitized = re.sub(
        r"[^A-Za-z0-9_]",
        "_",
        value,
    )

    if not sanitized:
        return "field"

    if sanitized[0].isdigit():
        return f"field_{sanitized}"

    return sanitized


if __name__ == "__main__":
    main()
