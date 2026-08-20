from __future__ import annotations

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
    Brand,
    Category,
    CategoryAttribute,
)

XLSX_TEMPLATE_PATH = (
    ROOT_DIR / "import_templates" / "MOTO_PORTAL_MASTER_1.xlsx"
)

BASE_PRODUCT_HEADERS = [
    "name",
    "slug",
    "brand_slug",
    "category_slug",
    "product_code",
    "price",
    "discount_price",
    "currency",
    "stock_status",
    "short_description",
    "description",
    "is_featured",
    "is_active",
]

# Etap 1: üretici sayfalarında en yaygın ve acil doldurulacak teknik alanlar.
MASTER_1_ATTRIBUTE_HEADERS = [
    "model-yili",
    "renk",
    "motor-hacmi",
    "motor-tipi",
    "silindir-sayisi",
    "sogutma-sistemi",
    "maksimum-guc",
    "maksimum-tork",
    "yakit-sistemi",
    "yakit-deposu",
    "sanziman-tipi",
    "vites-sayisi",
    "on-fren",
    "arka-fren",
    "on-suspansiyon",
    "arka-suspansiyon",
    "on-lastik",
    "arka-lastik",
    "uzunluk",
    "genislik",
    "yukseklik",
    "dingil-mesafesi",
    "sele-yuksekligi",
    "bos-agirlik",
]

COLOR_ATTRIBUTE_SLUG = "renk"
COLOR_ENTRY_HEADERS = ["renk-1", "renk-2", "renk-3", "renk-4"]

MASTER_SHEET_NAME = "MASTER_1"
IMPORT_SHEET_NAME = "IMPORT"
OPTIONS_SHEET_NAME = "OPTIONS"
USAGE_SHEET_NAME = "KULLANIM"

TARGET_CATEGORY_SLUG = "motosiklet"
VALIDATION_LAST_ROW = 5000
IMPORT_FORMULA_LAST_ROW = 2000

CATALOG_SOURCE_ENV = "PRODUCTS_TEMPLATE_CATALOG_SOURCE"
CATEGORY_SLUG_ENV = "PRODUCTS_TEMPLATE_CATEGORY_SLUG"
PROD_DATABASE_URL_ENV = "PRODUCTS_TEMPLATE_PROD_DATABASE_URL"
LEGACY_PROD_CATEGORY_SLUG_ENV = "PRODUCTS_TEMPLATE_PROD_CATEGORY_SLUG"
PROD_STATEMENT_TIMEOUT_ENV = "PRODUCTS_TEMPLATE_PROD_STATEMENT_TIMEOUT_MS"


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------


def main() -> None:
    target_category_slug = get_target_category_slug()

    attribute_headers, attribute_option_map, brand_slugs = load_template_definition(
        target_category_slug
    )

    import_headers = [
        *BASE_PRODUCT_HEADERS,
        *attribute_headers,
    ]
    master_headers = build_master_headers(import_headers)

    option_map: dict[str, list[str]] = {
        "brand_slug": brand_slugs,
        "category_slug": [target_category_slug],
        "currency": ["TRY"],
        "stock_status": ["in_stock", "out_of_stock"],
        "is_featured": ["true", "false"],
        "is_active": ["true", "false"],
        **attribute_option_map,
    }

    # Boş option listeleri dropdown üretmesin.
    option_map = {
        slug: values
        for slug, values in option_map.items()
        if values
    }

    workbook_parts = build_workbook_parts(
        master_headers=master_headers,
        import_headers=import_headers,
        option_map=option_map,
    )

    XLSX_TEMPLATE_PATH.parent.mkdir(parents=True, exist_ok=True)
    with ZipFile(
        XLSX_TEMPLATE_PATH,
        "w",
        compression=ZIP_DEFLATED,
    ) as archive:
        for archive_path, content in workbook_parts.items():
            archive.writestr(archive_path, content)

    print(f"Created: {XLSX_TEMPLATE_PATH}")
    print(f"Catalog source: {get_catalog_source_mode()}")
    print(f"Category slug: {target_category_slug}")
    print(f"Master columns: {', '.join(master_headers)}")
    print(f"Import columns: {', '.join(import_headers)}")
    print(f"Dropdown columns: {', '.join(option_map) or 'none'}")
    print(
        "Color entry: renk-1 / renk-2 / renk-3 / renk-4 -> "
        "IMPORT.renk = renk1 | renk2 | renk3 | renk4"
    )


# ---------------------------------------------------------------------------
# Definition loading
# ---------------------------------------------------------------------------


def build_master_headers(import_headers: list[str]) -> list[str]:
    master_headers: list[str] = []
    for header in import_headers:
        if header == COLOR_ATTRIBUTE_SLUG:
            master_headers.extend(COLOR_ENTRY_HEADERS)
        else:
            master_headers.append(header)
    return master_headers


def load_template_definition(
    target_category_slug: str,
) -> tuple[list[str], dict[str, list[str]], list[str]]:
    source_mode = get_catalog_source_mode()

    if source_mode == "local":
        return load_template_definition_from_local(target_category_slug)

    if source_mode == "production":
        return load_template_definition_from_production(target_category_slug)

    raise ValueError(f"Unsupported catalog source: {source_mode}")


def load_template_definition_from_local(
    target_category_slug: str,
) -> tuple[list[str], dict[str, list[str]], list[str]]:
    if not Category.objects.filter(slug=target_category_slug).exists():
        raise ValueError(f"Category not found: {target_category_slug}")

    category_attributes = (
        CategoryAttribute.objects
        .filter(
            category__slug=target_category_slug,
            attribute__slug__in=MASTER_1_ATTRIBUTE_HEADERS,
            attribute__is_active=True,
        )
        .select_related("attribute")
        .order_by(
            "display_order",
            "attribute__display_order",
            "attribute__slug",
        )
    )

    linked_by_slug = {
        item.attribute.slug: item.attribute
        for item in category_attributes
    }

    # Master 1 sırasını koru; category display_order template sırasını bozmasın.
    attribute_headers = [
        slug
        for slug in MASTER_1_ATTRIBUTE_HEADERS
        if slug in linked_by_slug
    ]

    attribute_ids = [linked_by_slug[slug].id for slug in attribute_headers]
    option_values_by_attribute_id: dict[int, list[str]] = {}

    option_rows = (
        AttributeOption.objects
        .filter(
            attribute_id__in=attribute_ids,
            is_active=True,
        )
        .order_by(
            "attribute_id",
            "display_order",
            "value",
        )
        .values_list("attribute_id", "value")
    )

    for attribute_id, option_value in option_rows:
        values = option_values_by_attribute_id.setdefault(attribute_id, [])
        if option_value not in values:
            values.append(option_value)

    option_map: dict[str, list[str]] = {}
    for slug in attribute_headers:
        attribute = linked_by_slug[slug]
        values = option_values_by_attribute_id.get(attribute.id, [])
        if values:
            option_map[slug] = list(dict.fromkeys(values))

    brand_slugs = list(
        Brand.objects
        .filter(is_active=True)
        .order_by("name")
        .values_list("slug", flat=True)
    )

    warn_missing_master_attributes(attribute_headers)
    return attribute_headers, option_map, brand_slugs


def load_template_definition_from_production(
    target_category_slug: str,
) -> tuple[list[str], dict[str, list[str]], list[str]]:
    database_url = os.environ.get(PROD_DATABASE_URL_ENV, "").strip()

    if not database_url:
        raise ValueError(
            f"{PROD_DATABASE_URL_ENV} is required when "
            f"{CATALOG_SOURCE_ENV}=production."
        )

    statement_timeout_ms = int(
        os.environ.get(PROD_STATEMENT_TIMEOUT_ENV, "15000")
    )

    category_exists_query = f"""
        SELECT 1
        FROM {Category._meta.db_table}
        WHERE slug = %s
        LIMIT 1
    """

    # Production AttributeOption bu template'in tek teknik option kaynağıdır.
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
          AND attribute.is_active = TRUE
          AND attribute.slug = ANY(%s)
        ORDER BY
            attribute.display_order,
            attribute.slug,
            option.display_order NULLS LAST,
            option.value NULLS LAST
    """

    brand_query = f"""
        SELECT slug
        FROM {Brand._meta.db_table}
        WHERE is_active = TRUE
        ORDER BY name, slug
    """

    rows: list[tuple[int, str, str | None]] = []
    brand_slugs: list[str] = []

    with get_production_cursor(
        database_url=database_url,
        statement_timeout_ms=statement_timeout_ms,
    ) as cursor:
        cursor.execute(category_exists_query, [target_category_slug])
        if cursor.fetchone() is None:
            raise ValueError(f"Category not found: {target_category_slug}")

        cursor.execute(query, [target_category_slug, MASTER_1_ATTRIBUTE_HEADERS])
        rows = cursor.fetchall()

        cursor.execute(brand_query)
        brand_slugs = [row[0] for row in cursor.fetchall()]

    seen_attribute_slugs: set[str] = set()
    option_map: dict[str, list[str]] = {}

    for _attribute_id, attribute_slug, option_value in rows:
        seen_attribute_slugs.add(attribute_slug)
        if option_value is None:
            continue

        values = option_map.setdefault(attribute_slug, [])
        if option_value not in values:
            values.append(option_value)

    # Master sırası DB sırasından bağımsız, sabit ve okunabilir kalır.
    attribute_headers = [
        slug
        for slug in MASTER_1_ATTRIBUTE_HEADERS
        if slug in seen_attribute_slugs
    ]

    warn_missing_master_attributes(attribute_headers)
    return attribute_headers, option_map, brand_slugs


def warn_missing_master_attributes(attribute_headers: list[str]) -> None:
    missing = [
        slug
        for slug in MASTER_1_ATTRIBUTE_HEADERS
        if slug not in attribute_headers
    ]
    if missing:
        print(
            "WARNING: Master 1 attribute(s) not linked/active for category and "
            f"therefore omitted: {', '.join(missing)}"
        )


def get_catalog_source_mode() -> str:
    return os.environ.get(CATALOG_SOURCE_ENV, "local").strip().lower()


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
    with psycopg.connect(database_url, autocommit=True) as connection:
        with connection.cursor() as cursor:
            cursor.execute("SET default_transaction_read_only = on")
            cursor.execute(f"SET statement_timeout = {statement_timeout_ms}")
            cursor.execute("BEGIN READ ONLY")
            try:
                yield cursor
            finally:
                cursor.execute("ROLLBACK")


# ---------------------------------------------------------------------------
# XLSX package
# ---------------------------------------------------------------------------


def build_workbook_parts(
    *,
    master_headers: list[str],
    import_headers: list[str],
    option_map: dict[str, list[str]],
) -> dict[str, str]:
    option_columns = list(option_map.items())
    defined_name_map = {
        slug: f"options_{sanitize_name(slug)}"
        for slug in option_map
    }

    timestamp = datetime.now(timezone.utc).replace(
        microsecond=0
    ).isoformat().replace("+00:00", "Z")

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
        "xl/worksheets/sheet1.xml": build_master_sheet_xml(
            headers=master_headers,
            option_map=option_map,
            defined_name_map=defined_name_map,
        ),
        "xl/worksheets/sheet2.xml": build_import_sheet_xml(
            master_headers=master_headers,
            import_headers=import_headers,
        ),
        "xl/worksheets/sheet3.xml": build_options_sheet_xml(
            option_columns=option_columns,
        ),
        "xl/worksheets/sheet4.xml": build_usage_sheet_xml(),
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
  <Override PartName="/xl/worksheets/sheet3.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
  <Override PartName="/xl/worksheets/sheet4.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
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
  <Application>MotoPortal</Application>
</Properties>
"""


def build_core_properties_xml(timestamp: str) -> str:
    return f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <dc:creator>MotoPortal</dc:creator>
  <cp:lastModifiedBy>MotoPortal</cp:lastModifiedBy>
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
        nodes: list[str] = []
        for column_index, (slug, options) in enumerate(option_columns, start=1):
            last_option_row = len(options) + 1
            column_letter = to_column_letter(column_index)
            nodes.append(
                "<definedName "
                f"name=\"{defined_name_map[slug]}\">"
                f"'{OPTIONS_SHEET_NAME}'!${column_letter}$2:${column_letter}${last_option_row}"
                "</definedName>"
            )
        defined_names_xml = f"<definedNames>{''.join(nodes)}</definedNames>"

    return f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <fileVersion appName="xl"/>
  <workbookPr/>
  <bookViews>
    <workbookView xWindow="240" yWindow="15" windowWidth="16095" windowHeight="9660"/>
  </bookViews>
  <sheets>
    <sheet name="{MASTER_SHEET_NAME}" sheetId="1" r:id="rId1"/>
    <sheet name="{IMPORT_SHEET_NAME}" sheetId="2" r:id="rId2"/>
    <sheet name="{OPTIONS_SHEET_NAME}" sheetId="3" r:id="rId3"/>
    <sheet name="{USAGE_SHEET_NAME}" sheetId="4" r:id="rId4"/>
  </sheets>
  {defined_names_xml}
  <calcPr calcId="191029" fullCalcOnLoad="1" forceFullCalc="1"/>
</workbook>
"""


def build_workbook_relationships_xml() -> str:
    return """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet2.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet3.xml"/>
  <Relationship Id="rId4" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet4.xml"/>
  <Relationship Id="rId5" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>
"""


def build_styles_xml() -> str:
    return """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <fonts count="2">
    <font><sz val="11"/><color theme="1"/><name val="Calibri"/><family val="2"/><scheme val="minor"/></font>
    <font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Calibri"/><family val="2"/></font>
  </fonts>
  <fills count="4">
    <fill><patternFill patternType="none"/></fill>
    <fill><patternFill patternType="gray125"/></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FF1F4E78"/><bgColor indexed="64"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FFD9EAF7"/><bgColor indexed="64"/></patternFill></fill>
  </fills>
  <borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>
  <cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
  <cellXfs count="3">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>
    <xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1"/>
    <xf numFmtId="0" fontId="0" fillId="3" borderId="0" xfId="0" applyFill="1"/>
  </cellXfs>
  <cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>
</styleSheet>
"""


# ---------------------------------------------------------------------------
# MASTER_1 sheet
# ---------------------------------------------------------------------------


def build_master_sheet_xml(
    *,
    headers: list[str],
    option_map: dict[str, list[str]],
    defined_name_map: dict[str, str],
) -> str:
    last_column_letter = to_column_letter(len(headers))

    header_cells = "".join(
        build_inline_string_cell(
            f"{to_column_letter(index)}1",
            header,
            style_id=1,
        )
        for index, header in enumerate(headers, start=1)
    )

    header_index_map = {
        header: index
        for index, header in enumerate(headers, start=1)
    }

    validation_nodes: list[str] = []

    # Normal dropdowns (base fields + single-select/multi-select attributes).
    for slug in option_map:
        targets: list[str] = []

        if slug == COLOR_ATTRIBUTE_SLUG:
            targets = [h for h in COLOR_ENTRY_HEADERS if h in header_index_map]
        elif slug in header_index_map:
            targets = [slug]

        for target_header in targets:
            column_letter = to_column_letter(header_index_map[target_header])
            validation_nodes.append(
                "<dataValidation "
                "type=\"list\" "
                "allowBlank=\"1\" "
                "showInputMessage=\"1\" "
                "showErrorMessage=\"1\" "
                f"sqref=\"{column_letter}2:{column_letter}{VALIDATION_LAST_ROW}\">"
                f"<formula1>={defined_name_map[slug]}</formula1>"
                "</dataValidation>"
            )

    validations_xml = ""
    if validation_nodes:
        validations_xml = (
            f"<dataValidations count=\"{len(validation_nodes)}\">"
            f"{''.join(validation_nodes)}"
            "</dataValidations>"
        )

    return f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <dimension ref="A1:{last_column_letter}{VALIDATION_LAST_ROW}"/>
  <sheetViews>
    <sheetView workbookViewId="0">
      <pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/>
      <selection pane="bottomLeft" activeCell="A2" sqref="A2"/>
    </sheetView>
  </sheetViews>
  <sheetFormatPr defaultRowHeight="18"/>
  <sheetData>
    <row r="1" ht="30" customHeight="1">{header_cells}</row>
  </sheetData>
  <autoFilter ref="A1:{last_column_letter}1"/>
  {validations_xml}
</worksheet>
"""


# ---------------------------------------------------------------------------
# IMPORT sheet
# ---------------------------------------------------------------------------


def build_import_sheet_xml(
    *,
    master_headers: list[str],
    import_headers: list[str],
) -> str:
    last_column_letter = to_column_letter(len(import_headers))

    master_index_map = {
        header: index
        for index, header in enumerate(master_headers, start=1)
    }

    header_cells = "".join(
        build_inline_string_cell(
            f"{to_column_letter(index)}1",
            header,
            style_id=1,
        )
        for index, header in enumerate(import_headers, start=1)
    )

    row_nodes = [f"<row r=\"1\" ht=\"30\" customHeight=\"1\">{header_cells}</row>"]

    color_letters = [
        to_column_letter(master_index_map[header])
        for header in COLOR_ENTRY_HEADERS
        if header in master_index_map
    ]

    for row_index in range(2, IMPORT_FORMULA_LAST_ROW + 1):
        cells: list[str] = []
        for import_column_index, header in enumerate(import_headers, start=1):
            cell_reference = f"{to_column_letter(import_column_index)}{row_index}"

            if header == COLOR_ATTRIBUTE_SLUG:
                refs = ":".join(
                    [
                        f"'{MASTER_SHEET_NAME}'!{color_letters[0]}{row_index}",
                        f"{color_letters[-1]}{row_index}",
                    ]
                )
                formula = f'TEXTJOIN(" | ",TRUE,{refs})'
            else:
                master_column = master_index_map[header]
                master_letter = to_column_letter(master_column)
                formula = f"'{MASTER_SHEET_NAME}'!{master_letter}{row_index}"

            cells.append(build_formula_cell(cell_reference, formula))

        row_nodes.append(f"<row r=\"{row_index}\">{''.join(cells)}</row>")

    return f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <dimension ref="A1:{last_column_letter}{IMPORT_FORMULA_LAST_ROW}"/>
  <sheetViews>
    <sheetView workbookViewId="0">
      <pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/>
      <selection pane="bottomLeft" activeCell="A2" sqref="A2"/>
    </sheetView>
  </sheetViews>
  <sheetFormatPr defaultRowHeight="18"/>
  <sheetData>
    {''.join(row_nodes)}
  </sheetData>
  <autoFilter ref="A1:{last_column_letter}1"/>
</worksheet>
"""


# ---------------------------------------------------------------------------
# OPTIONS + usage
# ---------------------------------------------------------------------------


def build_options_sheet_xml(
    *,
    option_columns: list[tuple[str, list[str]]],
) -> str:
    if not option_columns:
        return """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <dimension ref="A1:A1"/>
  <sheetViews><sheetView workbookViewId="0"/></sheetViews>
  <sheetData><row r="1"><c r="A1" t="inlineStr" s="1"><is><t>No options</t></is></c></row></sheetData>
</worksheet>
"""

    max_rows = max(len(values) for _, values in option_columns) + 1
    row_nodes: list[str] = []

    for row_index in range(1, max_rows + 1):
        cells: list[str] = []
        for column_index, (slug, values) in enumerate(option_columns, start=1):
            if row_index == 1:
                value = slug
                style_id = 1
            else:
                value_index = row_index - 2
                value = values[value_index] if value_index < len(values) else ""
                style_id = 0

            if not value:
                continue

            cells.append(
                build_inline_string_cell(
                    f"{to_column_letter(column_index)}{row_index}",
                    value,
                    style_id=style_id,
                )
            )

        row_nodes.append(f"<row r=\"{row_index}\">{''.join(cells)}</row>")

    last_column_letter = to_column_letter(len(option_columns))
    return f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <dimension ref="A1:{last_column_letter}{max_rows}"/>
  <sheetViews><sheetView workbookViewId="0"/></sheetViews>
  <sheetFormatPr defaultRowHeight="18"/>
  <sheetData>{''.join(row_nodes)}</sheetData>
</worksheet>
"""


def build_usage_sheet_xml() -> str:
    rows = [
        ("MOTO PORTAL MASTER 1", "Ürün girişini MASTER_1 sayfasında yap."),
        ("1", "MASTER_1: ürün bilgilerini doldur ve dropdownlardan seçim yap."),
        ("2", "Renk: renk-1 / renk-2 / renk-3 / renk-4 alanlarından ayrı ayrı seç."),
        ("3", "IMPORT sayfasındaki renk kolonu otomatik olarak 'kırmızı | mavi | ...' biçiminde birleşir."),
        ("4", "CSV kaydederken IMPORT sayfasını CSV olarak kaydet."),
        ("5", "Production import: .\\scripts\\import-production.ps1 import_templates\\DOSYA.csv"),
        ("6", "OPTIONS sayfası production AttributeOption kayıtlarından otomatik üretilir."),
        ("7", "Yeni/eksik option gerekiyorsa önce Django Admin AttributeOption'a ekle, sonra masterı yeniden üret."),
        ("8", "Üretici vermiyorsa teknik alanı boş bırak; tahmin yazma."),
    ]

    row_nodes: list[str] = []
    for row_index, (title, text) in enumerate(rows, start=1):
        style_id = 1 if row_index == 1 else (2 if row_index > 1 else 0)
        cells = [
            build_inline_string_cell(f"A{row_index}", title, style_id=style_id),
            build_inline_string_cell(f"B{row_index}", text, style_id=0),
        ]
        row_nodes.append(f"<row r=\"{row_index}\">{''.join(cells)}</row>")

    return f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <dimension ref="A1:B{len(rows)}"/>
  <sheetViews><sheetView workbookViewId="0"/></sheetViews>
  <sheetFormatPr defaultRowHeight="22"/>
  <cols><col min="1" max="1" width="24" customWidth="1"/><col min="2" max="2" width="100" customWidth="1"/></cols>
  <sheetData>{''.join(row_nodes)}</sheetData>
</worksheet>
"""


# ---------------------------------------------------------------------------
# Cell helpers
# ---------------------------------------------------------------------------


def build_inline_string_cell(
    cell_reference: str,
    value: object,
    *,
    style_id: int,
) -> str:
    escaped_value = escape("" if value is None else str(value))
    return (
        f"<c r=\"{cell_reference}\" t=\"inlineStr\" s=\"{style_id}\">"
        f"<is><t xml:space=\"preserve\">{escaped_value}</t></is>"
        "</c>"
    )


def build_formula_cell(cell_reference: str, formula: str) -> str:
    return (
        f"<c r=\"{cell_reference}\">"
        f"<f>{escape(formula)}</f>"
        "</c>"
    )


def to_column_letter(column_number: int) -> str:
    result = ""
    while column_number:
        column_number, remainder = divmod(column_number - 1, 26)
        result = chr(65 + remainder) + result
    return result


def sanitize_name(value: str) -> str:
    sanitized = re.sub(r"[^A-Za-z0-9_]", "_", value)
    if not sanitized:
        return "field"
    if sanitized[0].isdigit():
        return f"field_{sanitized}"
    return sanitized


if __name__ == "__main__":
    main()