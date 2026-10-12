import json
from decimal import Decimal
from pathlib import Path

from django.core.management.base import BaseCommand, CommandError
from django.db import connection

from apps.catalog.models import (
    Product,
    ProductAttributeValue,
    ProductHighlightImage,
    ProductImage,
    ProductResource,
    ProductVariant,
)

FORMAT_VERSION = 1


def decimal_to_str(value: Decimal | None) -> str | None:
    if value is None:
        return None
    return str(value)


def file_name_or_none(file_field) -> str | None:
    return file_field.name if file_field else None


class Command(BaseCommand):
    help = (
        "Tek bir urunu ve tum iliskili alt kayitlarini (variant, gorsel, "
        "one cikan ozellik gorseli, kaynak dosyasi, etiket, ozellik "
        "degeri) natural key'lere (slug) dayanan bir JSON paketine "
        "disa aktarir. Sadece OKUR, hicbir yazma islemi yapmaz."
    )

    def add_arguments(self, parser):
        parser.add_argument(
            "slug",
            type=str,
            help="Disa aktarilacak urunun slug'i.",
        )
        parser.add_argument(
            "--output",
            required=False,
            help="Cikti JSON dosya yolu (verilmezse <slug>.json kullanilir).",
        )

    def handle(self, *args, **options):
        slug = options["slug"]
        output_path = options.get("output") or f"{slug}.json"

        self.stdout.write(
            "Okunan veritabani: "
            f"host={connection.settings_dict.get('HOST')} "
            f"db={connection.settings_dict.get('NAME')}"
        )

        try:
            product = Product.objects.select_related(
                "brand",
                "category",
                "vehicle_model",
                "vehicle_model__brand",
            ).get(slug=slug)
        except Product.DoesNotExist as error:
            raise CommandError(f"Urun bulunamadi: {slug}") from error

        vehicle_model_data = None
        if product.vehicle_model_id:
            vehicle_model_data = {
                "brand_slug": product.vehicle_model.brand.slug,
                "slug": product.vehicle_model.slug,
            }

        product_data = {
            "slug": product.slug,
            "name": product.name,
            "product_code": product.product_code,
            "brand_slug": product.brand.slug,
            "category_slug": product.category.slug,
            "vehicle_model": vehicle_model_data,
            "price": decimal_to_str(product.price),
            "discount_price": decimal_to_str(product.discount_price),
            "currency": product.currency,
            "stock_status": product.stock_status,
            "short_description": product.short_description,
            "description": product.description,
            "instagram_url": product.instagram_url,
            "whatsapp_number": product.whatsapp_number,
            "cover_image": file_name_or_none(product.cover_image),
            "is_featured": product.is_featured,
            "is_active": product.is_active,
        }

        tags = sorted(
            product.tags.values_list("slug", flat=True)
        )

        # Bos ("") value satirlari import_products.py'nin kategori
        # formu icin urettigi "shell" placeholder'lardir -- tasinacak
        # gercek veri degil, export'a dahil edilmiyor.
        attribute_values = [
            {
                "attribute_slug": av.attribute.slug,
                "value": av.value,
            }
            for av in (
                ProductAttributeValue.objects
                .filter(product=product)
                .exclude(value="")
                .select_related("attribute")
                .order_by("attribute__slug", "value")
            )
        ]

        variants = [
            {
                "sku": variant.sku,
                "color": variant.color,
                "size": variant.size,
                "trim": variant.trim,
                "capacity": variant.capacity,
                "wheel_size": variant.wheel_size,
                "material": variant.material,
                "bundle": variant.bundle,
                "price": decimal_to_str(variant.price),
                "stock_quantity": variant.stock_quantity,
                "barcode": variant.barcode,
                "is_default": variant.is_default,
                "is_active": variant.is_active,
            }
            for variant in (
                ProductVariant.objects
                .filter(product=product)
                .order_by("sku")
            )
        ]

        images = [
            {
                "image": file_name_or_none(image.image),
                "alt_text": image.alt_text,
                "is_primary": image.is_primary,
                "display_order": image.display_order,
            }
            for image in (
                ProductImage.objects
                .filter(product=product)
                .order_by("display_order", "id")
            )
        ]

        highlight_images = [
            {
                "attribute_slug": highlight.attribute.slug,
                "image": file_name_or_none(highlight.image),
                "title": highlight.title,
                "description": highlight.description,
            }
            for highlight in (
                ProductHighlightImage.objects
                .filter(product=product)
                .select_related("attribute")
                .order_by("attribute__slug")
            )
        ]

        resources = [
            {
                "title": resource.title,
                "file": file_name_or_none(resource.file),
                "display_order": resource.display_order,
            }
            for resource in (
                ProductResource.objects
                .filter(product=product)
                .order_by("display_order", "title")
            )
        ]

        bundle = {
            "format_version": FORMAT_VERSION,
            "product": product_data,
            "tags": tags,
            "attribute_values": attribute_values,
            "variants": variants,
            "images": images,
            "highlight_images": highlight_images,
            "resources": resources,
        }

        output_file = Path(output_path)
        output_file.write_text(
            json.dumps(bundle, ensure_ascii=False, indent=2),
            encoding="utf-8",
        )

        self.stdout.write(
            self.style.SUCCESS(
                f"Yazildi: {output_file.resolve()}\n"
                f"  attribute_values: {len(attribute_values)}\n"
                f"  variants: {len(variants)}\n"
                f"  images: {len(images)}\n"
                f"  highlight_images: {len(highlight_images)}\n"
                f"  resources: {len(resources)}\n"
                f"  tags: {len(tags)}"
            )
        )
