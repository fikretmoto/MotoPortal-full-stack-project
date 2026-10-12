from __future__ import annotations

import json
from dataclasses import dataclass, field
from decimal import Decimal, InvalidOperation
from pathlib import Path
from typing import Any

from django.core.management.base import BaseCommand, CommandError
from django.db import connection, transaction

from apps.catalog.models import (
    Attribute,
    AttributeOption,
    Brand,
    Category,
    CategoryAttribute,
    Product,
    ProductAttributeValue,
    ProductHighlightImage,
    ProductImage,
    ProductResource,
    ProductVariant,
    Tag,
    VehicleModel,
)


def parse_decimal(value: str | None) -> Decimal | None:
    if value is None:
        return None
    try:
        return Decimal(value)
    except InvalidOperation as error:
        raise CommandError(f"Gecersiz decimal deger: {value!r}") from error


@dataclass
class ImportContext:
    brand: Brand | None = None
    category: Category | None = None
    vehicle_model: VehicleModel | None = None
    attributes_by_slug: dict[str, Attribute] = field(default_factory=dict)
    tags_by_slug: dict[str, Tag] = field(default_factory=dict)
    existing_product: Product | None = None


class Command(BaseCommand):
    help = (
        "export_product_bundle ile uretilmis bir JSON paketini (urun + "
        "variant + gorsel + one cikan ozellik gorseli + kaynak dosyasi + "
        "etiket + ozellik degeri) natural key'lere (slug) dayanarak "
        "hedef veritabanina aktarir. Once TUM eksik referanslari toplar; "
        "herhangi biri eksikse HICBIR SEY YAZMADAN durur. --update "
        "verilmezse ve urun zaten varsa da hicbir sey yazmadan durur. "
        "Gercek yazim tek transaction icindedir."
    )

    def add_arguments(self, parser):
        parser.add_argument(
            "json_path",
            type=str,
            help="export_product_bundle'in urettigi JSON dosyasinin yolu.",
        )
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help=(
                "Hicbir veritabani degisikligi yapmadan, ne yapilacagini "
                "ve varsa eksik referanslari raporla."
            ),
        )
        parser.add_argument(
            "--update",
            action="store_true",
            help=(
                "Urun slug'i hedefte zaten varsa, urunu ve tum alt "
                "kayitlarini (variant/gorsel/highlight/kaynak/etiket/"
                "ozellik degeri) JSON'daki haliyle TAM ESITLE -- "
                "JSON'da olmayanlar hedeften silinir."
            ),
        )

    def handle(self, *args, **options):
        json_path = Path(options["json_path"]).expanduser()
        dry_run: bool = options["dry_run"]
        update: bool = options["update"]

        if not json_path.exists():
            raise CommandError(f"JSON dosyasi bulunamadi: {json_path}")
        if not json_path.is_file():
            raise CommandError(f"JSON yolu bir dosya degil: {json_path}")

        # import_products_production.py'deki ile ayni guvenlik deseni:
        # SQLite'a ya da bos host'a karsi calismayi engelle. Hem local
        # hem production gercek PostgreSQL kullandigi icin bu kontrol
        # iki ortamda da gecer, sadece yanlis/eksik DB baglantisina
        # karsi bir savunma katmanidir.
        engine = connection.settings_dict.get("ENGINE", "")
        host = connection.settings_dict.get("HOST", "")
        database_name = connection.settings_dict.get("NAME", "")

        if "postgresql" not in engine:
            raise CommandError(
                "IMPORT BLOCKED: Django PostgreSQL'e bagli degil. "
                f"Mevcut engine: {engine or '(bos)'}"
            )

        if not host:
            raise CommandError("IMPORT BLOCKED: PostgreSQL HOST bos.")

        self.stdout.write(
            self.style.SUCCESS(
                "Veritabani dogrulandi: "
                f"engine={engine} host={host} db={database_name}"
            )
        )

        bundle = json.loads(json_path.read_text(encoding="utf-8"))

        if bundle.get("format_version") != 1:
            raise CommandError(
                "Desteklenmeyen format_version: "
                f"{bundle.get('format_version')!r}"
            )

        ctx = ImportContext()
        errors: list[str] = []
        warnings: list[str] = []

        self._validate_references(
            bundle=bundle,
            ctx=ctx,
            errors=errors,
            warnings=warnings,
        )

        if errors:
            self.stdout.write(
                self.style.ERROR(
                    "Eksik referans(lar) bulundu -- HICBIR SEY YAZILMADI:"
                )
            )
            for error_message in errors:
                self.stdout.write(f"  - {error_message}")
            raise CommandError(
                f"{len(errors)} eksik referans nedeniyle import durduruldu."
            )

        for warning_message in warnings:
            self.stdout.write(
                self.style.WARNING(f"UYARI: {warning_message}")
            )

        slug = bundle["product"]["slug"]
        ctx.existing_product = Product.objects.filter(slug=slug).first()

        if ctx.existing_product is not None and not update:
            message = (
                f"Urun zaten var: slug={slug}. Guncellemek icin --update "
                "bayragiyla tekrar calistir. HICBIR SEY YAZILMADI."
            )
            self.stdout.write(self.style.WARNING(message))

            if dry_run:
                self.stdout.write(
                    "Dry run tamamlandi (gercek calismada da burada "
                    "hicbir sey yazmadan duracakti)."
                )
                return

            raise CommandError(message)

        action = (
            "GUNCELLENECEK (tam esitleme)"
            if ctx.existing_product is not None
            else "OLUSTURULACAK"
        )

        self.stdout.write(f"Urun: {slug} -> {action}")
        self.stdout.write(
            f"  attribute_values: {len(bundle.get('attribute_values', []))}"
        )
        self.stdout.write(f"  variants: {len(bundle.get('variants', []))}")
        self.stdout.write(f"  images: {len(bundle.get('images', []))}")
        self.stdout.write(
            f"  highlight_images: {len(bundle.get('highlight_images', []))}"
        )
        self.stdout.write(f"  resources: {len(bundle.get('resources', []))}")
        self.stdout.write(f"  tags: {len(bundle.get('tags', []))}")

        if dry_run:
            self.stdout.write(
                self.style.SUCCESS(
                    "Dry run tamamlandi. Hicbir veritabani degisikligi "
                    "yapilmadi."
                )
            )
            return

        with transaction.atomic():
            product = self._write_product(bundle=bundle, ctx=ctx)
            self._sync_tags(bundle=bundle, ctx=ctx, product=product)
            self._sync_attribute_values(bundle=bundle, ctx=ctx, product=product)
            self._sync_variants(bundle=bundle, product=product)
            self._sync_images(bundle=bundle, product=product)
            self._sync_highlight_images(bundle=bundle, ctx=ctx, product=product)
            self._sync_resources(bundle=bundle, product=product)

        self.stdout.write(
            self.style.SUCCESS(f"Import tamamlandi: {slug}")
        )

    # ------------------------------------------------------------------
    # Validasyon -- hicbir yazma islemi yapmaz.
    # ------------------------------------------------------------------
    def _validate_references(
        self,
        *,
        bundle: dict[str, Any],
        ctx: ImportContext,
        errors: list[str],
        warnings: list[str],
    ) -> None:
        product_data = bundle["product"]

        brand_slug = product_data["brand_slug"]
        ctx.brand = Brand.objects.filter(slug=brand_slug).first()
        if ctx.brand is None:
            errors.append(f"Brand bulunamadi: slug={brand_slug}")

        category_slug = product_data["category_slug"]
        ctx.category = Category.objects.filter(slug=category_slug).first()
        if ctx.category is None:
            errors.append(f"Category bulunamadi: slug={category_slug}")

        vehicle_model_data = product_data.get("vehicle_model")
        if vehicle_model_data:
            vm_brand_slug = vehicle_model_data["brand_slug"]
            vm_slug = vehicle_model_data["slug"]
            ctx.vehicle_model = VehicleModel.objects.filter(
                brand__slug=vm_brand_slug,
                slug=vm_slug,
            ).first()
            if ctx.vehicle_model is None:
                errors.append(
                    "VehicleModel bulunamadi: "
                    f"brand_slug={vm_brand_slug} slug={vm_slug}"
                )

        attribute_values = bundle.get("attribute_values", [])
        attribute_slugs = {av["attribute_slug"] for av in attribute_values}
        ctx.attributes_by_slug = {
            attribute.slug: attribute
            for attribute in Attribute.objects.filter(
                slug__in=attribute_slugs
            )
        }

        for attribute_value in attribute_values:
            attribute_slug = attribute_value["attribute_slug"]
            attribute = ctx.attributes_by_slug.get(attribute_slug)

            if attribute is None:
                errors.append(
                    f"Attribute bulunamadi: slug={attribute_slug}"
                )
                continue

            if attribute.data_type in (
                Attribute.DataType.SINGLE_SELECT,
                Attribute.DataType.MULTI_SELECT,
            ):
                value = attribute_value["value"]
                option_exists = AttributeOption.objects.filter(
                    attribute=attribute,
                    value=value,
                ).exists()

                if not option_exists:
                    errors.append(
                        "AttributeOption bulunamadi: "
                        f"attribute={attribute_slug} value={value!r} "
                        "(hedef ortamda bu secenek tanimli degil)"
                    )

        if ctx.category is not None:
            for attribute_slug, attribute in ctx.attributes_by_slug.items():
                is_linked = CategoryAttribute.objects.filter(
                    category=ctx.category,
                    attribute=attribute,
                ).exists()

                if not is_linked:
                    errors.append(
                        "CategoryAttribute eksik: "
                        f"category={category_slug} attribute={attribute_slug} "
                        "(kategori semasi hedef ortamda farkli olabilir)"
                    )

        tag_slugs = bundle.get("tags", [])
        ctx.tags_by_slug = {
            tag.slug: tag
            for tag in Tag.objects.filter(slug__in=tag_slugs)
        }

        for tag_slug in tag_slugs:
            tag = ctx.tags_by_slug.get(tag_slug)

            if tag is None:
                errors.append(f"Tag bulunamadi: slug={tag_slug}")
            elif not tag.is_active:
                warnings.append(
                    f"Tag pasif ama yine de baglanacak: slug={tag_slug}"
                )

    # ------------------------------------------------------------------
    # Yazma -- sadece errors bos oldugunda, transaction.atomic() icinde
    # cagrilir.
    # ------------------------------------------------------------------
    def _write_product(
        self,
        *,
        bundle: dict[str, Any],
        ctx: ImportContext,
    ) -> Product:
        data = bundle["product"]

        product = ctx.existing_product or Product()
        product.slug = data["slug"]
        product.name = data["name"]
        product.product_code = data["product_code"]
        product.brand = ctx.brand
        product.category = ctx.category
        product.vehicle_model = ctx.vehicle_model
        product.price = parse_decimal(data["price"])
        product.discount_price = parse_decimal(data["discount_price"])
        product.currency = data["currency"]
        product.stock_status = data["stock_status"]
        product.short_description = data["short_description"]
        product.description = data["description"]
        product.instagram_url = data["instagram_url"]
        product.whatsapp_number = data["whatsapp_number"]
        product.cover_image = data["cover_image"]
        product.is_featured = data["is_featured"]
        product.is_active = data["is_active"]
        product.save()

        return product

    def _sync_tags(
        self,
        *,
        bundle: dict[str, Any],
        ctx: ImportContext,
        product: Product,
    ) -> None:
        tag_slugs = bundle.get("tags", [])
        tags = [ctx.tags_by_slug[slug] for slug in tag_slugs]
        product.tags.set(tags)

    def _sync_attribute_values(
        self,
        *,
        bundle: dict[str, Any],
        ctx: ImportContext,
        product: Product,
    ) -> None:
        ProductAttributeValue.objects.filter(product=product).delete()

        ProductAttributeValue.objects.bulk_create(
            [
                ProductAttributeValue(
                    product=product,
                    attribute=ctx.attributes_by_slug[
                        attribute_value["attribute_slug"]
                    ],
                    value=attribute_value["value"],
                )
                for attribute_value in bundle.get("attribute_values", [])
            ]
        )

    def _sync_variants(
        self,
        *,
        bundle: dict[str, Any],
        product: Product,
    ) -> None:
        ProductVariant.objects.filter(product=product).delete()

        ProductVariant.objects.bulk_create(
            [
                ProductVariant(
                    product=product,
                    sku=variant["sku"],
                    color=variant["color"],
                    size=variant["size"],
                    trim=variant["trim"],
                    capacity=variant["capacity"],
                    wheel_size=variant["wheel_size"],
                    material=variant["material"],
                    bundle=variant["bundle"],
                    price=parse_decimal(variant["price"]),
                    stock_quantity=variant["stock_quantity"],
                    barcode=variant["barcode"],
                    is_default=variant["is_default"],
                    is_active=variant["is_active"],
                )
                for variant in bundle.get("variants", [])
            ]
        )

    def _sync_images(
        self,
        *,
        bundle: dict[str, Any],
        product: Product,
    ) -> None:
        ProductImage.objects.filter(product=product).delete()

        ProductImage.objects.bulk_create(
            [
                ProductImage(
                    product=product,
                    image=image["image"],
                    alt_text=image["alt_text"],
                    is_primary=image["is_primary"],
                    display_order=image["display_order"],
                )
                for image in bundle.get("images", [])
            ]
        )

    def _sync_highlight_images(
        self,
        *,
        bundle: dict[str, Any],
        ctx: ImportContext,
        product: Product,
    ) -> None:
        ProductHighlightImage.objects.filter(product=product).delete()

        ProductHighlightImage.objects.bulk_create(
            [
                ProductHighlightImage(
                    product=product,
                    attribute=ctx.attributes_by_slug[
                        highlight["attribute_slug"]
                    ],
                    image=highlight["image"],
                    title=highlight["title"],
                    description=highlight["description"],
                )
                for highlight in bundle.get("highlight_images", [])
            ]
        )

    def _sync_resources(
        self,
        *,
        bundle: dict[str, Any],
        product: Product,
    ) -> None:
        ProductResource.objects.filter(product=product).delete()

        ProductResource.objects.bulk_create(
            [
                ProductResource(
                    product=product,
                    title=resource["title"],
                    file=resource["file"],
                    display_order=resource["display_order"],
                )
                for resource in bundle.get("resources", [])
            ]
        )
