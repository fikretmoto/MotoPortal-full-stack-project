from __future__ import annotations

import csv
import re
import unicodedata
from collections import defaultdict
from dataclasses import dataclass, field
from decimal import Decimal, InvalidOperation
from pathlib import Path
from typing import Any

from django.core.exceptions import ValidationError
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from django.db.models import Prefetch

from apps.catalog.models import (
    Attribute,
    AttributeOption,
    Brand,
    Category,
    CategoryAttribute,
    Product,
    ProductAttributeValue,
    ProductCurrency,
    ProductStockStatus,
)

BASE_PRODUCT_COLUMNS = {
    "name",
    "slug",
    "product_code",
    "brand_slug",
    "category_slug",
    "price",
    "discount_price",
    "currency",
    "stock_status",
    "short_description",
    "description",
    "is_featured",
    "is_active",
}

REQUIRED_PRODUCT_COLUMNS = {
    "name",
    "slug",
    "brand_slug",
    "category_slug",
}

UNSUPPORTED_COLUMNS = {
    "cover_image",
    "cover_image_url",
    "image",
    "image_url",
}

TRUE_VALUES = {
     "1",
    "true",
    "yes",
    "y",
    "evet",
    "var",
    "mevcut",
    "aktif",
    "dogru",
    "doğru",
}

FALSE_VALUES = {
   "0",
    "false",
    "no",
    "n",
    "hayir",
    "hayır",
    "yok",
    "mevcut degil",
    "mevcut değil",
    "pasif",
    "yanlis",
    "yanlış",
}

OPTION_SEPARATORS = (
    "|",
    ";",
    ",",
)


# Kullanıcı dostu Türkçe girişleri teknik değerlere yaklaştıran ortak alias'lar.
# Anahtarlar normalize_lookup_value() sonrasında karşılaştırılır.
COMMON_VALUE_ALIASES = {
    "dortzamanli": "4zamanli",
    "ikizamanli": "2zamanli",
    "stoktavar": "instock",
    "stoktayok": "outofstock",
    "stokdisi": "outofstock",
    "stokdisinda": "outofstock",
}

# Belirli attribute'larda güvenli, bilinen eş anlamlılar.
ATTRIBUTE_VALUE_ALIASES = {
    "motor-tipi": {
        "dortzamanli": "4zamanli",
        "ikizamanli": "2zamanli",
    },
    "sogutma-sistemi": {
        "havasogutmali": "havasogutmali",
        "sivisogutmali": "sivisogutmali",
        "yagsogutmali": "yagsogutmali",
    },
    "son-aktarma-tipi": {
        "zincir": "zincir",
        "kayis": "kayis",
        "kardan": "kardan",
    },
}


@dataclass
class ParsedRow:
    row_number: int
    action: str
    product: Product
    attribute_updates: dict[int, list[str]]


@dataclass
class ImportReport:
    total_rows: int = 0
    success_count: int = 0
    create_count: int = 0
    update_count: int = 0
    errors: list[str] = field(default_factory=list)
    warnings: list[str] = field(default_factory=list)

    @property
    def error_count(self) -> int:
        return len(self.errors)

    @property
    def warning_count(self) -> int:
        return len(self.warnings)

    def add_error(self, message: str) -> None:
        self.errors.append(message)

    def add_warning(self, message: str) -> None:
        self.warnings.append(message)


class ProductCSVImporter:
    def __init__(self) -> None:
        product_queryset = Product.objects.select_related(
            "brand",
            "category",
        )
        attribute_queryset = Attribute.objects.select_related(
            "group",
        ).prefetch_related(
            Prefetch(
                "options",
                queryset=AttributeOption.objects.filter(
                    is_active=True,
                ).order_by(
                    "display_order",
                    "value",
                ),
            )
        )

        self.products_by_slug = {
            product.slug: product
            for product in product_queryset
        }
        self.brands_by_slug = {
            brand.slug: brand
            for brand in Brand.objects.all()
        }
        self.categories_by_slug = {
            category.slug: category
            for category in Category.objects.all()
        }
        self.attributes_by_slug = {
            attribute.slug: attribute
            for attribute in attribute_queryset
        }

        self.attributes_by_id = {
            attribute.id: attribute
            for attribute in self.attributes_by_slug.values()
        }

        self.category_attributes_by_category_id: dict[
            int,
            dict[str, CategoryAttribute],
        ] = defaultdict(dict)
        self.category_attribute_ids_by_category_id: dict[
            int,
            list[int],
        ] = defaultdict(list)

        category_attribute_queryset = (
            CategoryAttribute.objects
            .select_related("attribute")
            .order_by(
                "display_order",
                "attribute__display_order",
                "attribute__slug",
            )
        )

        for category_attribute in category_attribute_queryset:
            category_id = category_attribute.category_id
            attribute_slug = category_attribute.attribute.slug

            self.category_attributes_by_category_id[
                category_id
            ][attribute_slug] = category_attribute
            self.category_attribute_ids_by_category_id[
                category_id
            ].append(category_attribute.attribute_id)

        self.option_value_lookup_by_attribute_id: dict[
            int,
            dict[str, str],
        ] = {}

        for attribute in self.attributes_by_slug.values():
            options: dict[str, str] = {}
            for option in attribute.options.all():
                canonical_value = option.value
                options[self.normalize_lookup_value(canonical_value)] = canonical_value

                # "hava-sogutmali" ile "Hava Soğutmalı" gibi yazımları
                # aynı anahtara yaklaştır.
                options[self.normalize_match_value(canonical_value)] = canonical_value

            self.option_value_lookup_by_attribute_id[
                attribute.id
            ] = options

        self.stock_status_lookup: dict[str, str] = {}
        for value, label in ProductStockStatus.choices:
            self.stock_status_lookup[self.normalize_lookup_value(value)] = value
            self.stock_status_lookup[self.normalize_match_value(value)] = value
            self.stock_status_lookup[self.normalize_lookup_value(label)] = value
            self.stock_status_lookup[self.normalize_match_value(label)] = value

        # Kullanıcı doğal Türkçe yazabilsin.
        self.stock_status_lookup.update({
            "stoktavar": ProductStockStatus.IN_STOCK,
            "stokvar": ProductStockStatus.IN_STOCK,
            "var": ProductStockStatus.IN_STOCK,
        })

    def run(
        self,
        csv_path: Path,
        *,
        dry_run: bool,
    ) -> ImportReport:
        headers, rows = self.read_csv(csv_path)
        report = ImportReport()

        header_errors = self.validate_headers(headers)
        if header_errors:
            report.errors.extend(header_errors)
            return report

        parsed_rows = self.validate_rows(
            headers=headers,
            rows=rows,
            report=report,
        )

        if dry_run:
            return report

        # Satır bazlı hatalar diğer geçerli satırların importunu durdurmaz.
        if parsed_rows:
            self.apply_rows(parsed_rows)
        return report

    def read_csv(
        self,
        csv_path: Path,
    ) -> tuple[list[str], list[dict[str | None, str | list[str]]]]:
        with csv_path.open(
            "r",
            encoding="utf-8-sig",
            newline="",
        ) as csv_file:
            sample = csv_file.read(4096)
            csv_file.seek(0)

            try:
                dialect = csv.Sniffer().sniff(
                    sample,
                    delimiters=",;",
                )
            except csv.Error:
                dialect = csv.excel

            reader = csv.DictReader(csv_file, dialect=dialect)

            if not reader.fieldnames:
                raise CommandError(
                    "CSV header row is missing."
                )

            normalized_headers = [
                self.normalize_header(header)
                for header in reader.fieldnames
            ]
            reader.fieldnames = normalized_headers

            rows = list(reader)

        return normalized_headers, rows

    def validate_headers(
        self,
        headers: list[str],
    ) -> list[str]:
        errors: list[str] = []
        seen_headers: set[str] = set()
        duplicate_headers: set[str] = set()

        for header in headers:
            if not header:
                errors.append(
                    "Header: empty column names are not allowed."
                )
                continue

            if header in seen_headers:
                duplicate_headers.add(header)
                continue

            seen_headers.add(header)

        for header in sorted(duplicate_headers):
            errors.append(
                f"Header: duplicate column name: {header}"
            )

        missing_required_columns = sorted(
            REQUIRED_PRODUCT_COLUMNS - set(headers)
        )
        for column_name in missing_required_columns:
            errors.append(
                f"Header: missing required column: {column_name}"
            )

        for header in headers:
            if header in BASE_PRODUCT_COLUMNS:
                continue

            if header in UNSUPPORTED_COLUMNS:
                errors.append(
                    f"Header: unsupported column for v1 import: {header}"
                )
                continue

            if header not in self.attributes_by_slug:
                errors.append(
                    f"Header: unknown column: {header}"
                )

        return errors

    def validate_rows(
        self,
        *,
        headers: list[str],
        rows: list[dict[str | None, str | list[str]]],
        report: ImportReport,
    ) -> list[ParsedRow]:
        parsed_rows: list[ParsedRow] = []
        attribute_headers = [
            header
            for header in headers
            if header not in BASE_PRODUCT_COLUMNS
        ]
        seen_product_slugs: set[str] = set()

        for index, raw_row in enumerate(rows, start=2):
            row_number = index
            row = {
                key: self.normalize_cell(value)
                for key, value in raw_row.items()
                if isinstance(key, str)
            }

            if all(not value for value in row.values()):
                report.add_warning(
                    f"Row {row_number}: blank row skipped."
                )
                continue

            report.total_rows += 1

            extra_values = raw_row.get(None, [])
            if isinstance(extra_values, list):
                extra_values = [
                    self.normalize_cell(value)
                    for value in extra_values
                    if self.normalize_cell(value)
                ]
            else:
                extra_values = []

            row_errors: list[str] = []
            row_warnings: list[str] = []

            if extra_values:
                row_errors.append(
                    "Row "
                    f"{row_number}: extra CSV values found: "
                    f"{', '.join(extra_values)}"
                )

            slug = row.get("slug", "")
            if slug:
                if slug in seen_product_slugs:
                    row_errors.append(
                        "Row "
                        f"{row_number}: duplicate product slug in CSV: {slug}"
                    )
                else:
                    seen_product_slugs.add(slug)

            product = self.build_product_instance(
                row_number=row_number,
                row=row,
                row_errors=row_errors,
            )

            if product is None:
                report.errors.extend(row_errors)
                continue

            category_attributes = (
                self.category_attributes_by_category_id.get(
                    product.category_id,
                    {},
                )
            )

            attribute_updates = self.build_attribute_updates(
                row_number=row_number,
                row=row,
                attribute_headers=attribute_headers,
                category_slug=product.category.slug,
                category_attributes=category_attributes,
                row_errors=row_errors,
                row_warnings=row_warnings,
            )

            self.validate_required_attributes(
                row_number=row_number,
                row=row,
                category_attributes=category_attributes,
                row_errors=row_errors,
                row_warnings=row_warnings,
            )

            report.warnings.extend(row_warnings)

            if row_errors:
                report.errors.extend(row_errors)
                continue

            action = (
                "update"
                if product.pk is not None
                else "create"
            )

            parsed_rows.append(
                ParsedRow(
                    row_number=row_number,
                    action=action,
                    product=product,
                    attribute_updates=attribute_updates,
                )
            )

            report.success_count += 1
            if action == "create":
                report.create_count += 1
            else:
                report.update_count += 1

        return parsed_rows

    def build_product_instance(
        self,
        *,
        row_number: int,
        row: dict[str, str],
        row_errors: list[str],
    ) -> Product | None:
        name = row.get("name", "")
        slug = row.get("slug", "")
        brand_slug = row.get("brand_slug", "").lower()
        category_slug = row.get("category_slug", "").lower()

        if not name:
            row_errors.append(
                f"Row {row_number}: missing required field: name"
            )

        if not slug:
            row_errors.append(
                f"Row {row_number}: missing required field: slug"
            )

        if not brand_slug:
            row_errors.append(
                "Row "
                f"{row_number}: missing required field: brand_slug"
            )

        if not category_slug:
            row_errors.append(
                "Row "
                f"{row_number}: missing required field: category_slug"
            )

        if row_errors:
            return None

        brand = self.brands_by_slug.get(brand_slug)
        if brand is None:
            row_errors.append(
                f"Row {row_number}: Unknown brand slug: {brand_slug}"
            )

        category = self.categories_by_slug.get(category_slug)
        if category is None:
            row_errors.append(
                "Row "
                f"{row_number}: Unknown category slug: {category_slug}"
            )

        if row_errors or brand is None or category is None:
            return None

        existing_product = self.products_by_slug.get(slug)
        product = self.clone_product(existing_product)

        product.name = name
        product.slug = slug
        product.brand = brand
        product.category = category

        optional_field_errors = self.apply_optional_product_fields(
            row_number=row_number,
            row=row,
            product=product,
        )
        row_errors.extend(optional_field_errors)

        if row_errors:
            return None

        try:
            product.full_clean()
        except ValidationError as error:
            for field_name, field_errors in error.message_dict.items():
                for field_error in field_errors:
                    row_errors.append(
                        "Row "
                        f"{row_number}: Invalid {field_name}: "
                        f"{field_error}"
                    )
            return None

        return product

    def clone_product(
        self,
        product: Product | None,
    ) -> Product:
        if product is None:
            return Product(
                short_description="",
                description="",
                currency=ProductCurrency.TRY,
                stock_status=ProductStockStatus.IN_STOCK,
                is_featured=False,
                is_active=True,
            )

        cloned_product = Product(
            pk=product.pk,
            name=product.name,
            slug=product.slug,
            product_code=product.product_code,
            brand=product.brand,
            category=product.category,
            price=product.price,
            discount_price=product.discount_price,
            currency=product.currency,
            stock_status=product.stock_status,
            short_description=product.short_description,
            description=product.description,
            cover_image=product.cover_image,
            is_featured=product.is_featured,
            is_active=product.is_active,
            created_at=product.created_at,
            updated_at=product.updated_at,
        )
        cloned_product._state.adding = False
        cloned_product._state.db = product._state.db
        return cloned_product

    def apply_optional_product_fields(
        self,
        *,
        row_number: int,
        row: dict[str, str],
        product: Product,
    ) -> list[str]:
        row_errors: list[str] = []

        product_code = row.get("product_code", "")
        if product_code:
            product.product_code = product_code

        price = row.get("price", "")
        if price:
            try:
                product.price = self.parse_decimal(price)
            except ValueError:
                row_errors.append(
                    f"Row {row_number}: Invalid price: {price}"
                )

        discount_price = row.get("discount_price", "")
        if discount_price:
            try:
                product.discount_price = self.parse_decimal(discount_price)
            except ValueError:
                row_errors.append(
                    f"Row {row_number}: Invalid discount_price: {discount_price}"
        )
        else:
            product.discount_price = None

        currency = row.get("currency", "")
        if currency:
            normalized_currency = currency.upper()
            allowed_currencies = {
                value
                for value, _ in ProductCurrency.choices
            }

            if normalized_currency not in allowed_currencies:
                row_errors.append(
                    "Row "
                    f"{row_number}: Invalid currency: {currency}"
                )
            else:
                product.currency = normalized_currency

        stock_status = row.get("stock_status", "")
        if stock_status:
            normalized_stock_status = self.resolve_stock_status(stock_status)

            if normalized_stock_status is None:
                row_errors.append(
                    "Row "
                    f"{row_number}: Invalid stock_status: {stock_status}"
                )
            else:
                product.stock_status = normalized_stock_status

        short_description = row.get("short_description", "")
        if short_description:
            product.short_description = short_description

        description = row.get("description", "")
        if description:
            product.description = description

        is_featured = row.get("is_featured", "")
        if is_featured:
            try:
                product.is_featured = self.parse_boolean(
                    is_featured
                )
            except ValueError:
                row_errors.append(
                    "Row "
                    f"{row_number}: Invalid boolean for is_featured: "
                    f"{is_featured}"
                )

        is_active = row.get("is_active", "")
        if is_active:
            try:
                product.is_active = self.parse_boolean(
                    is_active
                )
            except ValueError:
                row_errors.append(
                    "Row "
                    f"{row_number}: Invalid boolean for is_active: "
                    f"{is_active}"
                )

        return row_errors

    def build_attribute_updates(
        self,
        *,
        row_number: int,
        row: dict[str, str],
        attribute_headers: list[str],
        category_slug: str,
        category_attributes: dict[str, CategoryAttribute],
        row_errors: list[str],
        row_warnings: list[str],
    ) -> dict[int, list[str]]:
        attribute_updates: dict[int, list[str]] = {}

        for header in attribute_headers:
            raw_value = row.get(header, "")
            if not raw_value:
                continue

            category_attribute = category_attributes.get(header)
            if category_attribute is None:
                row_warnings.append(
                    "Row "
                    f"{row_number}: Attribute {header} is not assigned "
                    f"to category {category_slug}; value skipped."
                )
                continue

            attribute = self.attributes_by_slug[header]
            normalized_values = self.normalize_attribute_value(
                row_number=row_number,
                attribute=attribute,
                raw_value=raw_value,
                row_errors=row_errors,
                row_warnings=row_warnings,
            )

            if not normalized_values:
                continue

            attribute_updates[attribute.id] = normalized_values

        return attribute_updates

    def validate_required_attributes(
        self,
        *,
        row_number: int,
        row: dict[str, str],
        category_attributes: dict[str, CategoryAttribute],
        row_errors: list[str],
        row_warnings: list[str],
    ) -> None:
        for attribute_slug, category_attribute in (
            category_attributes.items()
        ):
            if not category_attribute.is_required:
                continue

            if row.get(attribute_slug, ""):
                continue

            row_warnings.append(
                "Row "
                f"{row_number}: Required attribute missing: "
                f"{attribute_slug}; product will still be imported."
            )

    def normalize_attribute_value(
        self,
        *,
        row_number: int,
        attribute: Attribute,
        raw_value: str,
        row_errors: list[str],
        row_warnings: list[str],
    ) -> list[str] | None:
        option_lookup = self.option_value_lookup_by_attribute_id.get(
            attribute.id,
            {},
        )

        if option_lookup or attribute.data_type in {
            Attribute.DataType.SINGLE_SELECT,
            Attribute.DataType.MULTI_SELECT,
        }:
            if not option_lookup:
                row_warnings.append(
                    "Row "
                    f"{row_number}: Attribute {attribute.slug} expects "
                    "configured options but none are active; value skipped."
                )
                return None

            if attribute.data_type == Attribute.DataType.MULTI_SELECT:
                option_values = self.split_option_values(raw_value)
                resolved_values: list[str] = []
                seen_values: set[str] = set()

                for option_value in option_values:
                    resolved_option = self.resolve_attribute_option(
                        attribute=attribute,
                        raw_value=option_value,
                        option_lookup=option_lookup,
                    )

                    if resolved_option is None:
                        row_warnings.append(
                            "Row "
                            f"{row_number}: Invalid option for "
                            f"{attribute.slug}: {option_value}; value skipped."
                        )
                        return None

                    if resolved_option in seen_values:
                        row_warnings.append(
                            "Row "
                            f"{row_number}: Duplicate option for "
                            f"{attribute.slug}: {resolved_option}; "
                            "duplicate skipped."
                        )
                        continue

                    seen_values.add(resolved_option)
                    resolved_values.append(resolved_option)

                if not resolved_values:
                    return None

                return resolved_values

            resolved_option = self.resolve_attribute_option(
                attribute=attribute,
                raw_value=raw_value,
                option_lookup=option_lookup,
            )

            if resolved_option is None:
                row_warnings.append(
                    "Row "
                    f"{row_number}: Invalid option for "
                    f"{attribute.slug}: {raw_value}; value skipped."
                )
                return None

            return [resolved_option]

        if attribute.data_type == Attribute.DataType.BOOLEAN:
            try:
                return ["true" if self.parse_boolean(raw_value) else "false"]
            except ValueError:
                row_warnings.append(
                    "Row "
                    f"{row_number}: Invalid boolean for "
                    f"{attribute.slug}: {raw_value}; value skipped."
                )
                return None

        if attribute.data_type == Attribute.DataType.INTEGER:
            try:
                return [str(self.parse_integer(raw_value))]
            except ValueError:
                row_warnings.append(
                    "Row "
                    f"{row_number}: Invalid integer for "
                    f"{attribute.slug}: {raw_value}; value skipped."
                )
                return None

        if attribute.data_type == Attribute.DataType.DECIMAL:
            try:
                decimal_value = self.parse_decimal(raw_value)
            except ValueError:
                row_warnings.append(
                    "Row "
                    f"{row_number}: Invalid decimal for "
                    f"{attribute.slug}: {raw_value}; value skipped."
                )
                return None

            return [self.format_decimal(decimal_value)]

        return [raw_value]

    def apply_rows(
        self,
        parsed_rows: list[ParsedRow],
    ) -> None:
        with transaction.atomic():
            for parsed_row in parsed_rows:
                parsed_row.product.save()
                self.ensure_category_attribute_shells(
                    parsed_row.product
                )

                for attribute_id, values in (
                    parsed_row.attribute_updates.items()
                ):
                    attribute = self.attributes_by_id[attribute_id]

                    if attribute.data_type == Attribute.DataType.MULTI_SELECT:
                        self.apply_multi_select_values(
                            product=parsed_row.product,
                            attribute_id=attribute_id,
                            values=values,
                        )
                    else:
                        self.apply_single_value(
                            product=parsed_row.product,
                            attribute_id=attribute_id,
                            value=values[0],
                        )

    def apply_single_value(
        self,
        *,
        product: Product,
        attribute_id: int,
        value: str,
    ) -> None:
        existing_ids = list(
            ProductAttributeValue.objects
            .filter(
                product=product,
                attribute_id=attribute_id,
            )
            .order_by("id")
            .values_list("id", flat=True)
        )

        if not existing_ids:
            ProductAttributeValue.objects.create(
                product=product,
                attribute_id=attribute_id,
                value=value,
            )
            return

        keep_id = existing_ids[0]
        ProductAttributeValue.objects.filter(
            id=keep_id,
        ).update(value=value)

        extra_ids = existing_ids[1:]
        if extra_ids:
            ProductAttributeValue.objects.filter(
                id__in=extra_ids,
            ).delete()

    def apply_multi_select_values(
        self,
        *,
        product: Product,
        attribute_id: int,
        values: list[str],
    ) -> None:
        ProductAttributeValue.objects.filter(
            product=product,
            attribute_id=attribute_id,
        ).delete()

        ProductAttributeValue.objects.bulk_create(
            [
                ProductAttributeValue(
                    product=product,
                    attribute_id=attribute_id,
                    value=value,
                )
                for value in values
            ]
        )

    def ensure_category_attribute_shells(
        self,
        product: Product,
    ) -> None:
        attribute_ids = self.category_attribute_ids_by_category_id.get(
            product.category_id,
            [],
        )

        if not attribute_ids:
            return

        shell_attribute_ids = [
            attribute_id
            for attribute_id in attribute_ids
            if self.attributes_by_id[attribute_id].data_type
            != Attribute.DataType.MULTI_SELECT
        ]

        if not shell_attribute_ids:
            return

        existing_attribute_ids = set(
            ProductAttributeValue.objects
            .filter(
                product=product,
                attribute_id__in=shell_attribute_ids,
            )
            .values_list(
                "attribute_id",
                flat=True,
            )
        )

        missing_values = [
            ProductAttributeValue(
                product=product,
                attribute_id=attribute_id,
                value="",
            )
            for attribute_id in shell_attribute_ids
            if attribute_id not in existing_attribute_ids
        ]

        if not missing_values:
            return

        ProductAttributeValue.objects.bulk_create(
            missing_values,
            ignore_conflicts=True,
        )

    def normalize_header(
        self,
        value: str | None,
    ) -> str:
        return (value or "").strip().lower()

    def normalize_cell(
        self,
        value: Any,
    ) -> str:
        if value is None:
            return ""

        return str(value).strip()

    def normalize_lookup_value(
        self,
        value: str,
    ) -> str:
        return value.strip().casefold()

    def normalize_match_value(
        self,
        value: str,
    ) -> str:
        normalized = unicodedata.normalize("NFKD", value.strip().casefold())
        ascii_text = "".join(
            character
            for character in normalized
            if not unicodedata.combining(character)
        )
        ascii_text = (
            ascii_text
            .replace("ı", "i")
            .replace("ş", "s")
            .replace("ğ", "g")
            .replace("ü", "u")
            .replace("ö", "o")
            .replace("ç", "c")
        )
        return re.sub(r"[^a-z0-9]+", "", ascii_text)

    def resolve_stock_status(
        self,
        value: str,
    ) -> str | None:
        direct_key = self.normalize_lookup_value(value)
        if direct_key in self.stock_status_lookup:
            return self.stock_status_lookup[direct_key]

        match_key = self.normalize_match_value(value)
        return self.stock_status_lookup.get(match_key)

    def resolve_attribute_option(
        self,
        *,
        attribute: Attribute,
        raw_value: str,
        option_lookup: dict[str, str],
    ) -> str | None:
        direct_key = self.normalize_lookup_value(raw_value)
        if direct_key in option_lookup:
            return option_lookup[direct_key]

        match_key = self.normalize_match_value(raw_value)
        if match_key in option_lookup:
            return option_lookup[match_key]

        attribute_aliases = ATTRIBUTE_VALUE_ALIASES.get(attribute.slug, {})
        alias_target = attribute_aliases.get(match_key)
        if alias_target and alias_target in option_lookup:
            return option_lookup[alias_target]

        common_alias_target = COMMON_VALUE_ALIASES.get(match_key)
        if common_alias_target and common_alias_target in option_lookup:
            return option_lookup[common_alias_target]

        return None

    def parse_boolean(
        self,
        value: str,
    ) -> bool:
        normalized = value.strip().casefold()

        if normalized in TRUE_VALUES:
            return True

        if normalized in FALSE_VALUES:
            return False

        raise ValueError(value)

    def parse_integer(
        self,
        value: str,
    ) -> int:
        normalized = value.strip()
        return int(normalized)

    def parse_decimal(
        self,
        value: str,
) ->    Decimal:
        normalized = value.strip().replace(" ", "")

        if "," in normalized and "." in normalized:
        # Türkçe sayı biçimi: 177.750,00
            normalized = normalized.replace(".", "").replace(",", ".")
        elif "," in normalized:
        # 175000,50
            normalized = normalized.replace(",", ".")

        try:
          return Decimal(normalized)
        except InvalidOperation as error:
          raise ValueError(value) from error

    def format_decimal(
        self,
        value: Decimal,
    ) -> str:
        formatted = format(value, "f")
        if "." not in formatted:
            return formatted

        formatted = formatted.rstrip("0").rstrip(".")
        return formatted or "0"

    def split_option_values(
        self,
        value: str,
    ) -> list[str]:
        for separator in OPTION_SEPARATORS:
            if separator in value:
                return [
                    part.strip()
                    for part in value.split(separator)
                    if part.strip()
                ]

        stripped_value = value.strip()
        return [stripped_value] if stripped_value else []


class Command(BaseCommand):
    help = (
        "Import products and category-aware attribute values from a CSV file."
    )

    def add_arguments(self, parser) -> None:
        parser.add_argument(
            "csv_path",
            type=str,
            help="Path to the CSV file to import.",
        )
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Validate the CSV without writing to the database.",
        )

    def handle(self, *args, **options) -> None:
        csv_path = Path(options["csv_path"]).expanduser()
        dry_run = options["dry_run"]

        if not csv_path.exists():
            raise CommandError(
                f"CSV file not found: {csv_path}"
            )

        if not csv_path.is_file():
            raise CommandError(
                f"CSV path is not a file: {csv_path}"
            )

        importer = ProductCSVImporter()
        report = importer.run(
            csv_path,
            dry_run=dry_run,
        )

        for warning in report.warnings:
            self.stdout.write(f"WARNING: {warning}")

        for error in report.errors:
            self.stderr.write(error)

        action_label = "Will create" if dry_run else "Created"
        update_label = "Will update" if dry_run else "Updated"

        self.stdout.write(
            f"Total rows: {report.total_rows}"
        )
        self.stdout.write(
            f"Successful rows: {report.success_count}"
        )
        self.stdout.write(
            f"{action_label}: {report.create_count}"
        )
        self.stdout.write(
            f"{update_label}: {report.update_count}"
        )
        self.stdout.write(
            f"Errors: {report.error_count}"
        )
        self.stdout.write(
            f"Warnings: {report.warning_count}"
        )

        if report.errors and report.success_count == 0:
            raise CommandError(
                "Import aborted because no valid rows were available."
            )

        if report.errors:
            self.stdout.write(
                self.style.WARNING(
                    "Import completed with row-level errors. "
                    "Valid rows were imported; invalid rows were skipped."
                )
            )

        if dry_run:
            self.stdout.write(
                "Dry run complete. No database changes were made."
            )
            return

        self.stdout.write(
            "Import completed successfully."
        )