from __future__ import annotations

from pathlib import Path

from django.core.management.base import BaseCommand, CommandError
from django.db import connection

from .import_products import ProductCSVImporter


class Command(BaseCommand):
    help = (
        "Safely import products into the production PostgreSQL database. "
        "Refuses to run against SQLite or another non-PostgreSQL database."
    )

    def add_arguments(self, parser) -> None:
        parser.add_argument(
            "csv_path",
            type=str,
            help="Path to the CSV file to import.",
        )

    def handle(self, *args, **options) -> None:
        csv_path = Path(options["csv_path"]).expanduser()

        if not csv_path.exists():
            raise CommandError(f"CSV file not found: {csv_path}")

        if not csv_path.is_file():
            raise CommandError(f"CSV path is not a file: {csv_path}")

        engine = connection.settings_dict.get("ENGINE", "")
        host = connection.settings_dict.get("HOST", "")
        database_name = connection.settings_dict.get("NAME", "")

        if "postgresql" not in engine:
            raise CommandError(
                "PRODUCTION IMPORT BLOCKED: Django is not connected to PostgreSQL. "
                f"Current engine: {engine or '(empty)'}"
            )

        if not host:
            raise CommandError(
                "PRODUCTION IMPORT BLOCKED: PostgreSQL HOST is empty."
            )

        self.stdout.write(
            self.style.SUCCESS(
                "Production DB verified: "
                f"engine={engine} host={host} db={database_name}"
            )
        )

        importer = ProductCSVImporter()

        self.stdout.write("")
        self.stdout.write(self.style.MIGRATE_HEADING("1/2 Dry-run"))

        dry_report = importer.run(
            csv_path,
            dry_run=True,
        )

        self._print_report(
            dry_report,
            dry_run=True,
        )

        if dry_report.errors:
            raise CommandError(
                "Production import cancelled because the dry-run has errors."
            )

        if dry_report.success_count == 0:
            raise CommandError(
                "Production import cancelled because there are no valid rows."
            )

        if dry_report.warnings:
            answer = input(
                f"{dry_report.warning_count} warning(s) found. "
                "Import valid data anyway? [y/N]: "
            ).strip().casefold()

            if answer not in {"y", "yes", "e", "evet"}:
                raise CommandError(
                    "Production import cancelled by user."
                )

        self.stdout.write("")
        self.stdout.write(
            self.style.MIGRATE_HEADING("2/2 Production import")
        )

        report = importer.run(
            csv_path,
            dry_run=False,
        )

        self._print_report(
            report,
            dry_run=False,
        )

        if report.errors:
            raise CommandError(
                "Production import finished with row-level errors."
            )

        self.stdout.write("")
        self.stdout.write(
            self.style.SUCCESS(
                "Production import completed successfully."
            )
        )

    def _print_report(
        self,
        report,
        *,
        dry_run: bool,
    ) -> None:
        for warning in report.warnings:
            self.stdout.write(
                self.style.WARNING(
                    f"WARNING: {warning}"
                )
            )

        for error in report.errors:
            self.stderr.write(
                self.style.ERROR(error)
            )

        create_label = (
            "Will create"
            if dry_run
            else "Created"
        )

        update_label = (
            "Will update"
            if dry_run
            else "Updated"
        )

        self.stdout.write(
            f"Total rows: {report.total_rows}"
        )

        self.stdout.write(
            f"Successful rows: {report.success_count}"
        )

        self.stdout.write(
            f"{create_label}: {report.create_count}"
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