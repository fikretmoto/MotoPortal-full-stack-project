import csv
from decimal import Decimal
from pathlib import Path

from django.core.management.base import BaseCommand, CommandError

from apps.catalog.models import (
    CategoryAttribute,
    Product,
    ProductAttributeValue,
)

# import_products.py'nin BASE_PRODUCT_COLUMNS'uyla aynı alanlar, aynı
# sırada — bu CSV, o komuta girdi olarak doğrudan verilmek üzere
# üretiliyor.
BASE_PRODUCT_COLUMNS = [
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
]

# import_products.py'nin OPTION_SEPARATORS'ında ilk sırada olan ayraç
# — çoklu seçim (multi_select) değerlerini birleştirirken kullanılır.
OPTION_JOIN_SEPARATOR = "|"


def format_decimal(value: Decimal | None) -> str:
    if value is None:
        return ""

    formatted = format(value, "f")
    if "." not in formatted:
        return formatted

    formatted = formatted.rstrip("0").rstrip(".")
    return formatted or "0"


class Command(BaseCommand):
    help = (
        "Tek bir ürünü, import_products komutunun kabul ettiği CSV "
        "formatıyla (aynı base kolonlar, aynı encoding/dialect) dışa "
        "aktarır. Sadece local veritabanından OKUR — hiçbir yazma "
        "işlemi ya da production bağlantısı içermez."
    )

    def add_arguments(self, parser):
        parser.add_argument(
            "--slug",
            required=True,
            help="Dışa aktarılacak ürünün slug'ı.",
        )
        parser.add_argument(
            "--output",
            required=False,
            help="Çıktı CSV dosya yolu (verilmezse <slug>.csv kullanılır).",
        )

    def handle(self, *args, **options):
        slug = options["slug"]
        output_path = options.get("output") or f"{slug}.csv"

        try:
            product = Product.objects.select_related(
                "brand",
                "category",
            ).get(slug=slug)
        except Product.DoesNotExist as error:
            raise CommandError(f"Ürün bulunamadı: {slug}") from error

        category_attributes = list(
            CategoryAttribute.objects
            .filter(category=product.category)
            .select_related("attribute")
            .order_by(
                "display_order",
                "attribute__display_order",
                "attribute__slug",
            )
        )

        attribute_columns = [
            ca.attribute.slug for ca in category_attributes
        ]
        fieldnames = BASE_PRODUCT_COLUMNS + attribute_columns

        row: dict[str, str] = {
            "name": product.name,
            "slug": product.slug,
            "product_code": product.product_code or "",
            "brand_slug": product.brand.slug,
            "category_slug": product.category.slug,
            "price": format_decimal(product.price),
            "discount_price": format_decimal(product.discount_price),
            "currency": product.currency,
            "stock_status": product.stock_status,
            "short_description": product.short_description,
            "description": product.description,
            "is_featured": "TRUE" if product.is_featured else "FALSE",
            "is_active": "TRUE" if product.is_active else "FALSE",
        }

        attribute_values = (
            ProductAttributeValue.objects
            .filter(
                product=product,
                attribute__in=[ca.attribute for ca in category_attributes],
            )
            .select_related("attribute")
        )

        values_by_attribute_slug: dict[str, list[str]] = {}
        for attribute_value in attribute_values:
            values_by_attribute_slug.setdefault(
                attribute_value.attribute.slug, []
            ).append(attribute_value.value)

        for attribute_slug in attribute_columns:
            values = values_by_attribute_slug.get(attribute_slug, [])
            row[attribute_slug] = OPTION_JOIN_SEPARATOR.join(values)

        output_file = Path(output_path)
        with output_file.open(
            "w",
            newline="",
            encoding="utf-8-sig",
        ) as csv_file:
            writer = csv.DictWriter(csv_file, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerow(row)

        self.stdout.write(
            self.style.SUCCESS(
                f"Yazıldı: {output_file.resolve()} "
                f"({len(fieldnames)} kolon)"
            )
        )
