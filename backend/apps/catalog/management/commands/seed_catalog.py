from django.core.management.base import BaseCommand
from django.db import transaction

from apps.catalog.attributes.ecommerce import ECOMMERCE_ATTRIBUTE_DATA
from apps.catalog.attributes.scooter import SCOOTER_ATTRIBUTE_DATA

from apps.catalog.attribute_groups import ATTRIBUTE_GROUP_DATA
from apps.catalog.attributes.helmet import HELMET_ATTRIBUTE_DATA
from apps.catalog.attributes.motorcycle import MOTORCYCLE_ATTRIBUTE_DATA
from apps.catalog.categories import CATEGORY_DATA
from apps.catalog.category_attributes.scooter import (
    SCOOTER_ATTRIBUTE_SLUGS,
    SCOOTER_CATEGORY_SLUGS,
)
from apps.catalog.category_attributes.helmet import (
    HELMET_ATTRIBUTE_SLUGS,
    HELMET_CATEGORY_SLUGS,
)
from apps.catalog.category_attributes.motorcycle import (
    MOTORCYCLE_ATTRIBUTE_SLUGS,
    MOTORCYCLE_CATEGORY_SLUGS,
)
from apps.catalog.models import (
    Attribute,
    AttributeGroup,
    Category,
    CategoryAttribute,
)


class Command(BaseCommand):
    help = "MotoPortal katalog verilerini oluşturur ve günceller."

    @transaction.atomic
    def handle(self, *args, **options):
        self.stdout.write(
            self.style.WARNING(
                "MotoPortal katalog verileri hazırlanıyor..."
            )
        )

        categories = self.seed_categories()
        groups = self.seed_attribute_groups()
        attributes = self.seed_attributes(groups)

        self.seed_category_attributes(
            categories=categories,
            attributes=attributes,
        )

        self.stdout.write(
            self.style.SUCCESS(
                "MotoPortal katalog çekirdeği başarıyla hazırlandı."
            )
        )

    def seed_categories(self):
        categories = {}

        # Önce ana kategoriler
        for item in CATEGORY_DATA:
            if item["parent_slug"] is not None:
                continue

            category, created = Category.objects.update_or_create(
                slug=item["slug"],
                defaults={
                    "name": item["name"],
                    "parent": None,
                    "is_active": True,
                },
            )

            categories[item["slug"]] = category

            self.print_result(
                created=created,
                model_name="Kategori",
                name=item["name"],
            )

        # Sonra alt kategoriler
        for item in CATEGORY_DATA:
            parent_slug = item["parent_slug"]

            if parent_slug is None:
                continue

            parent = categories.get(parent_slug)

            if parent is None:
                raise ValueError(
                    f"Üst kategori bulunamadı: {parent_slug}"
                )

            category, created = Category.objects.update_or_create(
                slug=item["slug"],
                defaults={
                    "name": item["name"],
                    "parent": parent,
                    "is_active": True,
                },
            )

            categories[item["slug"]] = category

            self.print_result(
                created=created,
                model_name="Kategori",
                name=item["name"],
            )

        self.stdout.write(
            self.style.SUCCESS(
                f"{len(categories)} kategori hazır."
            )
        )

        return categories

    def seed_attribute_groups(self):
        groups = {}

        for item in ATTRIBUTE_GROUP_DATA:
            group, created = AttributeGroup.objects.update_or_create(
                slug=item["slug"],
                defaults={
                    "name": item["name"],
                    "display_order": item["display_order"],
                    "is_active": True,
                },
            )

            groups[item["slug"]] = group

            self.print_result(
                created=created,
                model_name="Özellik Grubu",
                name=item["name"],
            )

        self.stdout.write(
            self.style.SUCCESS(
                f"{len(groups)} özellik grubu hazır."
            )
        )

        return groups

    def seed_attributes(self, groups):
        attributes = {}

        all_attribute_data = [
            *MOTORCYCLE_ATTRIBUTE_DATA,
            *HELMET_ATTRIBUTE_DATA,
            *SCOOTER_ATTRIBUTE_DATA,
            *ECOMMERCE_ATTRIBUTE_DATA
        ]

        for item in all_attribute_data:
            group_slug = item["group_slug"]
            group = groups.get(group_slug)

            if group is None:
                raise ValueError(
                    f"Özellik grubu bulunamadı: {group_slug}"
                )

            attribute, created = Attribute.objects.update_or_create(
                slug=item["slug"],
                defaults={
                    "name": item["name"],
                    "group": group,
                    "data_type": item["data_type"],
                    "unit": item["unit"],
                    "display_order": item["display_order"],
                    "is_filterable": item["is_filterable"],
                    "is_comparable": item["is_comparable"],
                    "is_searchable": item["is_searchable"],
                    "is_active": True,
                },
            )

            attributes[item["slug"]] = attribute

            self.print_result(
                created=created,
                model_name="Özellik",
                name=item["name"],
            )

        self.stdout.write(
            self.style.SUCCESS(
                f"{len(attributes)} özellik hazır."
            )
        )

        return attributes

    def seed_category_attributes(
        self,
        categories,
        attributes,
    ):
        mappings = {}

        for category_slug in MOTORCYCLE_CATEGORY_SLUGS:
            mappings[category_slug] = MOTORCYCLE_ATTRIBUTE_SLUGS

        for category_slug in HELMET_CATEGORY_SLUGS:
                mappings[category_slug] = HELMET_ATTRIBUTE_SLUGS

        for category_slug in SCOOTER_CATEGORY_SLUGS:
                mappings[category_slug] = SCOOTER_ATTRIBUTE_SLUGS

        connection_count = 0

        for category_slug, attribute_slugs in mappings.items():
            category = categories.get(category_slug)

            if category is None:
                raise ValueError(
                    f"Kategori bulunamadı: {category_slug}"
                )

            for attribute_slug in attribute_slugs:
                attribute = attributes.get(attribute_slug)

                if attribute is None:
                    raise ValueError(
                        f"Özellik bulunamadı: {attribute_slug}"
                    )

                _, created = CategoryAttribute.objects.update_or_create(
                    category=category,
                    attribute=attribute,
                    defaults={
                        "is_required": False,
                        "is_filterable": attribute.is_filterable,
                        "is_comparable": attribute.is_comparable,
                        "display_order": attribute.display_order,
                    },
                )

                connection_count += 1

                if created:
                    self.stdout.write(
                        self.style.SUCCESS(
                            "OLUŞTURULDU: "
                            f"{category.name} -> "
                            f"{attribute.name}"
                        )
                    )

        self.stdout.write(
            self.style.SUCCESS(
                f"{connection_count} kategori-özellik bağlantısı hazır."
            )
        )

    def print_result(
        self,
        *,
        created,
        model_name,
        name,
    ):
        if created:
            self.stdout.write(
                self.style.SUCCESS(
                    f"OLUŞTURULDU: {model_name} -> {name}"
                )
            )
            return

        self.stdout.write(
            f"GÜNCELLENDİ: {model_name} -> {name}"
        )
