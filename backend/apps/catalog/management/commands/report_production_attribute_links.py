from __future__ import annotations

import os
from contextlib import contextmanager
from dataclasses import dataclass
from typing import Iterator

import psycopg
from django.core.management.base import BaseCommand, CommandError

from apps.catalog.models import Attribute, Category, CategoryAttribute

PROD_DATABASE_URL_ENV = "PRODUCTS_TEMPLATE_PROD_DATABASE_URL"
DEFAULT_ATTRIBUTE_SLUG = "quickshifter"
FOCUS_CATEGORY_SLUGS = (
    "motosiklet",
    "scooter",
)


@dataclass(frozen=True)
class CategoryAttributeLink:
    category_attribute_id: int
    attribute_name: str
    attribute_slug: str
    category_name: str
    category_slug: str


class Command(BaseCommand):
    help = (
        "Report production CategoryAttribute links for an attribute "
        "using a dedicated read-only PostgreSQL connection."
    )

    def add_arguments(self, parser) -> None:
        parser.add_argument(
            "--attribute-slug",
            default=DEFAULT_ATTRIBUTE_SLUG,
            help=(
                "Attribute slug to inspect in production. "
                f"Default: {DEFAULT_ATTRIBUTE_SLUG}"
            ),
        )

    def handle(self, *args, **options) -> None:
        attribute_slug = options["attribute_slug"].strip()
        if not attribute_slug:
            raise CommandError("attribute slug cannot be blank.")

        links = fetch_category_attribute_links(attribute_slug)
        rows_by_category_slug = {
            link.category_slug: link
            for link in links
        }

        if links:
            self.stdout.write(
                self.style.SUCCESS(
                    "Production CategoryAttribute links found."
                )
            )
            self.stdout.write("")
            for link in links:
                self.stdout.write(
                    f"Attribute name: {link.attribute_name}"
                )
                self.stdout.write(
                    f"Attribute slug: {link.attribute_slug}"
                )
                self.stdout.write(
                    f"Category name: {link.category_name}"
                )
                self.stdout.write(
                    f"Category slug: {link.category_slug}"
                )
                self.stdout.write(
                    "CategoryAttribute id: "
                    f"{link.category_attribute_id}"
                )
                self.stdout.write("")
        else:
            self.stdout.write(
                self.style.WARNING(
                    "No production CategoryAttribute rows found "
                    f"for attribute slug '{attribute_slug}'."
                )
            )
            self.stdout.write("")

        self.stdout.write("Focus categories:")
        for category_slug in FOCUS_CATEGORY_SLUGS:
            link = rows_by_category_slug.get(category_slug)
            if link is None:
                self.stdout.write(
                    f"- {category_slug}: not linked"
                )
                continue

            self.stdout.write(
                f"- {category_slug}: linked "
                f"(CategoryAttribute id: {link.category_attribute_id})"
            )


def fetch_category_attribute_links(
    attribute_slug: str,
) -> list[CategoryAttributeLink]:
    database_url = os.environ.get(
        PROD_DATABASE_URL_ENV,
        "",
    ).strip()
    if not database_url:
        raise CommandError(
            f"{PROD_DATABASE_URL_ENV} is required."
        )

    query = f"""
        SELECT
            category_attribute.id,
            attribute.name,
            attribute.slug,
            category.name,
            category.slug
        FROM {CategoryAttribute._meta.db_table} category_attribute
        INNER JOIN {Attribute._meta.db_table} attribute
            ON attribute.id = category_attribute.attribute_id
        INNER JOIN {Category._meta.db_table} category
            ON category.id = category_attribute.category_id
        WHERE attribute.slug = %s
        ORDER BY
            CASE
                WHEN category.slug = 'motosiklet' THEN 0
                WHEN category.slug = 'scooter' THEN 1
                ELSE 2
            END,
            category.name,
            category_attribute.id
    """

    with get_read_only_cursor(database_url) as cursor:
        cursor.execute(query, [attribute_slug])
        rows = cursor.fetchall()

    return [
        CategoryAttributeLink(
            category_attribute_id=row[0],
            attribute_name=row[1],
            attribute_slug=row[2],
            category_name=row[3],
            category_slug=row[4],
        )
        for row in rows
    ]


@contextmanager
def get_read_only_cursor(
    database_url: str,
) -> Iterator[psycopg.Cursor]:
    with psycopg.connect(
        database_url,
        autocommit=True,
    ) as connection:
        with connection.cursor() as cursor:
            cursor.execute(
                "SET default_transaction_read_only = on"
            )
            cursor.execute("BEGIN READ ONLY")

            try:
                yield cursor
            finally:
                cursor.execute("ROLLBACK")
