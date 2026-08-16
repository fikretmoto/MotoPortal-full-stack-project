import csv
import tempfile
from decimal import Decimal
from io import StringIO
from pathlib import Path
from unittest.mock import ANY, MagicMock, patch

from django.core.management import call_command
from django.core.management.base import CommandError
from django.test import SimpleTestCase, TestCase

from apps.catalog.models import (
    Attribute,
    AttributeGroup,
    AttributeOption,
    Brand,
    Category,
    CategoryAttribute,
    Product,
    ProductAttributeValue,
)


class ImportProductsCommandTests(TestCase):
    def setUp(self) -> None:
        self.temp_files: list[Path] = []

        self.brand = Brand.objects.create(
            name="RKS",
            slug="rks",
            is_active=True,
        )
        self.category = Category.objects.create(
            name="Scooter",
            slug="scooter",
            is_active=True,
        )
        self.group = AttributeGroup.objects.create(
            name="Motor",
            slug="motor",
            display_order=10,
            is_active=True,
        )

        self.motor_hacmi = Attribute.objects.create(
            group=self.group,
            name="Motor Hacmi",
            slug="motor-hacmi",
            data_type=Attribute.DataType.INTEGER,
            unit="cc",
            display_order=10,
            is_active=True,
        )
        self.sanziman_tipi = Attribute.objects.create(
            group=self.group,
            name="Sanziman Tipi",
            slug="sanziman-tipi",
            data_type=Attribute.DataType.SINGLE_SELECT,
            display_order=20,
            is_active=True,
        )
        self.abs = Attribute.objects.create(
            group=self.group,
            name="ABS",
            slug="abs",
            data_type=Attribute.DataType.BOOLEAN,
            display_order=30,
            is_active=True,
        )

        AttributeOption.objects.create(
            attribute=self.sanziman_tipi,
            value="cvt",
            display_order=10,
            is_active=True,
        )
        AttributeOption.objects.create(
            attribute=self.sanziman_tipi,
            value="manuel",
            display_order=20,
            is_active=True,
        )

        CategoryAttribute.objects.create(
            category=self.category,
            attribute=self.motor_hacmi,
            is_required=True,
            display_order=10,
        )
        CategoryAttribute.objects.create(
            category=self.category,
            attribute=self.sanziman_tipi,
            is_required=False,
            display_order=20,
        )
        CategoryAttribute.objects.create(
            category=self.category,
            attribute=self.abs,
            is_required=False,
            display_order=30,
        )

    def tearDown(self) -> None:
        for path in self.temp_files:
            if path.exists():
                path.unlink()

    def write_csv(
        self,
        headers: list[str],
        rows: list[list[str]],
    ) -> Path:
        temp_file = tempfile.NamedTemporaryFile(
            mode="w",
            encoding="utf-8",
            newline="",
            suffix=".csv",
            delete=False,
        )
        temp_file.close()

        path = Path(temp_file.name)
        self.temp_files.append(path)

        with path.open(
            "w",
            encoding="utf-8",
            newline="",
        ) as handle:
            writer = csv.writer(handle)
            writer.writerow(headers)
            writer.writerows(rows)

        return path

    def test_dry_run_validates_without_writing_database(self) -> None:
        csv_path = self.write_csv(
            headers=[
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
                "motor-hacmi",
                "sanziman-tipi",
                "abs",
            ],
            rows=[
                [
                    "RKS Freccia 150",
                    "rks-freccia-150",
                    "rks",
                    "scooter",
                    "SKU-001",
                    "125000.50",
                    "TRY",
                    "in_stock",
                    "Kisa aciklama",
                    "Uzun aciklama",
                    "true",
                    "true",
                    "150",
                    "cvt",
                    "true",
                ],
            ],
        )

        stdout = StringIO()
        call_command(
            "import_products",
            str(csv_path),
            "--dry-run",
            stdout=stdout,
        )

        output = stdout.getvalue()
        self.assertIn("Total rows: 1", output)
        self.assertIn("Successful rows: 1", output)
        self.assertIn("Will create: 1", output)
        self.assertIn(
            "Dry run complete. No database changes were made.",
            output,
        )
        self.assertEqual(Product.objects.count(), 0)
        self.assertEqual(
            ProductAttributeValue.objects.count(),
            0,
        )

    def test_import_creates_product_and_missing_attribute_shells(self) -> None:
        csv_path = self.write_csv(
            headers=[
                "name",
                "slug",
                "brand_slug",
                "category_slug",
                "product_code",
                "price",
                "motor-hacmi",
                "sanziman-tipi",
            ],
            rows=[
                [
                    "RKS Freccia 150",
                    "rks-freccia-150",
                    "rks",
                    "scooter",
                    "SKU-001",
                    "125000.50",
                    "150",
                    "cvt",
                ],
            ],
        )

        stdout = StringIO()
        call_command(
            "import_products",
            str(csv_path),
            stdout=stdout,
        )

        product = Product.objects.get(
            slug="rks-freccia-150"
        )
        self.assertEqual(product.brand, self.brand)
        self.assertEqual(product.category, self.category)
        self.assertEqual(
            product.price,
            Decimal("125000.50"),
        )

        attribute_values = {
            value.attribute.slug: value.value
            for value in ProductAttributeValue.objects
            .filter(product=product)
            .select_related("attribute")
        }

        self.assertEqual(attribute_values["motor-hacmi"], "150")
        self.assertEqual(attribute_values["sanziman-tipi"], "cvt")
        self.assertEqual(attribute_values["abs"], "")
        self.assertIn(
            "Import completed successfully.",
            stdout.getvalue(),
        )

    def test_import_updates_existing_product_and_preserves_omitted_attribute(self) -> None:
        product = Product.objects.create(
            name="RKS Freccia 150",
            slug="rks-freccia-150",
            brand=self.brand,
            category=self.category,
            short_description="Eski aciklama",
            is_active=True,
        )
        ProductAttributeValue.objects.create(
            product=product,
            attribute=self.abs,
            value="true",
        )

        csv_path = self.write_csv(
            headers=[
                "name",
                "slug",
                "brand_slug",
                "category_slug",
                "price",
                "short_description",
                "motor-hacmi",
                "sanziman-tipi",
            ],
            rows=[
                [
                    "RKS Freccia 150",
                    "rks-freccia-150",
                    "rks",
                    "scooter",
                    "150000",
                    "Yeni aciklama",
                    "155",
                    "manuel",
                ],
            ],
        )

        call_command(
            "import_products",
            str(csv_path),
        )

        product.refresh_from_db()
        self.assertEqual(
            product.price,
            Decimal("150000"),
        )
        self.assertEqual(
            product.short_description,
            "Yeni aciklama",
        )

        attribute_values = {
            value.attribute.slug: value.value
            for value in ProductAttributeValue.objects
            .filter(product=product)
            .select_related("attribute")
        }

        self.assertEqual(attribute_values["abs"], "true")
        self.assertEqual(attribute_values["motor-hacmi"], "155")
        self.assertEqual(attribute_values["sanziman-tipi"], "manuel")

    def test_invalid_option_raises_error_and_rolls_back(self) -> None:
        csv_path = self.write_csv(
            headers=[
                "name",
                "slug",
                "brand_slug",
                "category_slug",
                "motor-hacmi",
                "sanziman-tipi",
            ],
            rows=[
                [
                    "RKS Freccia 150",
                    "rks-freccia-150",
                    "rks",
                    "scooter",
                    "150",
                    "rocket",
                ],
            ],
        )

        stderr = StringIO()
        with self.assertRaises(CommandError):
            call_command(
                "import_products",
                str(csv_path),
                stderr=stderr,
            )

        self.assertIn(
            "Invalid option for sanziman-tipi: rocket",
            stderr.getvalue(),
        )
        self.assertEqual(Product.objects.count(), 0)

    def test_required_attribute_missing_raises_error(self) -> None:
        csv_path = self.write_csv(
            headers=[
                "name",
                "slug",
                "brand_slug",
                "category_slug",
                "sanziman-tipi",
            ],
            rows=[
                [
                    "RKS Freccia 150",
                    "rks-freccia-150",
                    "rks",
                    "scooter",
                    "cvt",
                ],
            ],
        )

        stderr = StringIO()
        with self.assertRaises(CommandError):
            call_command(
                "import_products",
                str(csv_path),
                "--dry-run",
                stderr=stderr,
            )

        self.assertIn(
            "Required attribute missing: motor-hacmi",
            stderr.getvalue(),
        )
        self.assertEqual(Product.objects.count(), 0)


class GenerateProductsTemplateXlsxTests(TestCase):
    def setUp(self) -> None:
        self.temp_files: list[Path] = []
        self.motosiklet = Category.objects.create(
            name="Motosiklet",
            slug="motosiklet",
            is_active=True,
        )
        self.scooter = Category.objects.create(
            name="Scooter",
            slug="scooter",
            is_active=True,
        )
        self.group = AttributeGroup.objects.create(
            name="Teknik",
            slug="teknik",
            display_order=10,
            is_active=True,
        )
        self.yakit_sistemi = Attribute.objects.create(
            group=self.group,
            name="Yakit Sistemi",
            slug="yakit-sistemi",
            data_type=Attribute.DataType.SINGLE_SELECT,
            display_order=10,
            is_active=True,
        )
        self.model_yili = Attribute.objects.create(
            group=self.group,
            name="Model Yili",
            slug="model-yili",
            data_type=Attribute.DataType.SINGLE_SELECT,
            display_order=20,
            is_active=True,
        )
        self.renk = Attribute.objects.create(
            group=self.group,
            name="Renk",
            slug="renk",
            data_type=Attribute.DataType.SINGLE_SELECT,
            display_order=30,
            is_active=True,
        )
        self.quickshifter = Attribute.objects.create(
            group=self.group,
            name="Quickshifter",
            slug="quickshifter",
            data_type=Attribute.DataType.BOOLEAN,
            display_order=40,
            is_active=True,
        )

        for display_order, value in enumerate(
            ["benzin", "elektrik"],
            start=10,
        ):
            AttributeOption.objects.create(
                attribute=self.yakit_sistemi,
                value=value,
                display_order=display_order,
                is_active=True,
            )

        for display_order, value in enumerate(
            ["2025", "2026"],
            start=10,
        ):
            AttributeOption.objects.create(
                attribute=self.model_yili,
                value=value,
                display_order=display_order,
                is_active=True,
            )

        for display_order, value in enumerate(
            ["kirmizi", "siyah"],
            start=10,
        ):
            AttributeOption.objects.create(
                attribute=self.renk,
                value=value,
                display_order=display_order,
                is_active=True,
            )

        CategoryAttribute.objects.create(
            category=self.motosiklet,
            attribute=self.yakit_sistemi,
            display_order=10,
        )
        CategoryAttribute.objects.create(
            category=self.motosiklet,
            attribute=self.model_yili,
            display_order=20,
        )
        CategoryAttribute.objects.create(
            category=self.scooter,
            attribute=self.renk,
            display_order=10,
        )

    def tearDown(self) -> None:
        for path in self.temp_files:
            if path.exists():
                path.unlink()

    def write_csv(
        self,
        headers: list[str],
        rows: list[list[str]],
    ) -> Path:
        temp_file = tempfile.NamedTemporaryFile(
            mode="w",
            encoding="utf-8",
            newline="",
            suffix=".csv",
            delete=False,
        )
        temp_file.close()

        path = Path(temp_file.name)
        self.temp_files.append(path)

        with path.open(
            "w",
            encoding="utf-8",
            newline="",
        ) as handle:
            writer = csv.writer(handle)
            writer.writerow(headers)
            writer.writerows(rows)

        return path

    def test_local_template_uses_only_selected_category_attributes(
        self,
    ) -> None:
        from scripts.generate_products_template_xlsx import (
            BASE_PRODUCT_HEADERS,
            load_template_definition_from_local,
        )

        headers, option_map = load_template_definition_from_local(
            "motosiklet"
        )

        self.assertEqual(
            headers,
            [
                *BASE_PRODUCT_HEADERS,
                "yakit-sistemi",
                "model-yili",
            ],
        )
        self.assertNotIn("quickshifter", headers)
        self.assertEqual(
            option_map,
            {
                "yakit-sistemi": [
                    "benzin",
                    "elektrik",
                ],
                "model-yili": [
                    "2025",
                    "2026",
                ],
            },
        )

    def test_sample_rows_filter_by_category_and_generated_headers(
        self,
    ) -> None:
        from scripts.generate_products_template_xlsx import (
            BASE_PRODUCT_HEADERS,
            load_sample_rows,
        )

        csv_path = self.write_csv(
            headers=[
                *BASE_PRODUCT_HEADERS,
                "quickshifter",
                "renk",
            ],
            rows=[
                [
                    "Scooter Ornek",
                    "scooter-ornek",
                    "rks",
                    "scooter",
                    "SKU-001",
                    "100000",
                    "TRY",
                    "in_stock",
                    "Kisa aciklama",
                    "Uzun aciklama",
                    "false",
                    "true",
                    "true",
                    "siyah",
                ],
                [
                    "Motosiklet Ornek",
                    "motosiklet-ornek",
                    "cfmoto",
                    "motosiklet",
                    "SKU-002",
                    "200000",
                    "TRY",
                    "pre_order",
                    "Baska kisa aciklama",
                    "Baska uzun aciklama",
                    "true",
                    "true",
                    "false",
                    "kirmizi",
                ],
            ],
        )

        rows = load_sample_rows(
            headers=[
                *BASE_PRODUCT_HEADERS,
                "renk",
            ],
            target_category_slug="scooter",
            path=csv_path,
        )

        self.assertEqual(
            rows,
            [[
                "Scooter Ornek",
                "scooter-ornek",
                "rks",
                "scooter",
                "SKU-001",
                "100000",
                "TRY",
                "in_stock",
                "Kisa aciklama",
                "Uzun aciklama",
                "false",
                "true",
                "siyah",
            ]],
        )

    def test_category_slug_env_is_used_for_local_templates(
        self,
    ) -> None:
        from scripts import generate_products_template_xlsx

        with patch.dict(
            "os.environ",
            {
                generate_products_template_xlsx.CATALOG_SOURCE_ENV:
                    "local",
                generate_products_template_xlsx.CATEGORY_SLUG_ENV:
                    "scooter",
            },
            clear=False,
        ):
            headers, option_map = (
                generate_products_template_xlsx
                .load_template_definition(
                    generate_products_template_xlsx
                    .get_target_category_slug()
                )
            )

        self.assertEqual(
            headers[-1],
            "renk",
        )
        self.assertEqual(
            headers,
            [
                *generate_products_template_xlsx
                .BASE_PRODUCT_HEADERS,
                "renk",
            ],
        )
        self.assertEqual(
            option_map,
            {
                "renk": [
                    "kirmizi",
                    "siyah",
                ],
            },
        )


class ReportProductionAttributeLinksCommandTests(
    SimpleTestCase
):
    def test_command_requires_production_database_url(
        self,
    ) -> None:
        from apps.catalog.management.commands import (
            report_production_attribute_links,
        )

        with patch.dict(
            "os.environ",
            {},
            clear=True,
        ):
            with self.assertRaisesMessage(
                CommandError,
                "PRODUCTS_TEMPLATE_PROD_DATABASE_URL is required.",
            ):
                (
                    report_production_attribute_links
                    .fetch_category_attribute_links(
                        "quickshifter"
                    )
                )

    def test_command_reports_links_with_read_only_connection(
        self,
    ) -> None:
        cursor = MagicMock()
        cursor.__enter__.return_value = cursor
        cursor.fetchall.return_value = [
            (
                41,
                "Quickshifter",
                "quickshifter",
                "Motosiklet",
                "motosiklet",
            ),
            (
                73,
                "Quickshifter",
                "quickshifter",
                "ATV",
                "atv",
            ),
        ]
        connection = MagicMock()
        connection.__enter__.return_value = connection
        connection.cursor.return_value = cursor

        with patch.dict(
            "os.environ",
            {
                "PRODUCTS_TEMPLATE_PROD_DATABASE_URL":
                    "postgres://readonly",
            },
            clear=False,
        ):
            with patch(
                "apps.catalog.management.commands."
                "report_production_attribute_links."
                "psycopg.connect",
                return_value=connection,
            ) as connect_mock:
                stdout = StringIO()
                call_command(
                    "report_production_attribute_links",
                    stdout=stdout,
                )

        output = stdout.getvalue()
        self.assertIn(
            "Attribute name: Quickshifter",
            output,
        )
        self.assertIn(
            "Attribute slug: quickshifter",
            output,
        )
        self.assertIn(
            "Category name: Motosiklet",
            output,
        )
        self.assertIn(
            "Category slug: motosiklet",
            output,
        )
        self.assertIn(
            "CategoryAttribute id: 41",
            output,
        )
        self.assertIn(
            "- motosiklet: linked (CategoryAttribute id: 41)",
            output,
        )
        self.assertIn(
            "- scooter: not linked",
            output,
        )

        connect_mock.assert_called_once_with(
            "postgres://readonly",
            autocommit=True,
        )
        self.assertEqual(
            cursor.execute.call_args_list[0].args,
            ("SET default_transaction_read_only = on",),
        )
        self.assertEqual(
            cursor.execute.call_args_list[1].args,
            ("BEGIN READ ONLY",),
        )
        self.assertIn(
            "WHERE attribute.slug = %s",
            cursor.execute.call_args_list[2].args[0],
        )
        self.assertEqual(
            cursor.execute.call_args_list[2].args[1],
            ["quickshifter"],
        )
        self.assertEqual(
            cursor.execute.call_args_list[-1].args,
            ("ROLLBACK",),
        )
