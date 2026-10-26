
import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from django.db import transaction
from apps.catalog.models import Category, Attribute, CategoryAttribute
from apps.catalog.attributes.apparel_casual_jacket import APPAREL_CASUAL_JACKET_ATTRIBUTE_DATA
from apps.catalog.category_attributes.apparel_casual_jacket import (
    APPAREL_CASUAL_JACKET_ATTRIBUTE_SLUGS,
    APPAREL_CASUAL_JACKET_HIGHLIGHT_SLUGS,
)

with transaction.atomic():
    ceket = Category.objects.get(slug="ceket")

    for item in APPAREL_CASUAL_JACKET_ATTRIBUTE_DATA:
        Attribute.objects.get_or_create(
            slug=item["slug"],
            defaults=item,
        )

    attributes = {
        slug: Attribute.objects.get(slug=slug)
        for slug in APPAREL_CASUAL_JACKET_ATTRIBUTE_SLUGS
    }

    for order, slug in enumerate(APPAREL_CASUAL_JACKET_ATTRIBUTE_SLUGS, start=1):
        CategoryAttribute.objects.update_or_create(
            category=ceket,
            attribute=attributes[slug],
            defaults={
                "is_required": False,
                "is_filterable": True,
                "is_comparable": True,
                "is_highlight": slug in APPAREL_CASUAL_JACKET_HIGHLIGHT_SLUGS,
                "display_order": order,
            },
        )

print("Ceket bağlantı sayısı:", CategoryAttribute.objects.filter(category=ceket).count())
