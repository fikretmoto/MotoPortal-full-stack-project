import importlib

from django.apps import apps
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction


def _model(name):
    for m in apps.get_models():
        if m.__name__ == name:
            return m
    raise CommandError(f"Model bulunamadı: {name}")


class Command(BaseCommand):
    help = "Tek bir attribute_options dosyasını (ör. elect) seed eder. Tüm sistemi seed etmez."

    def add_arguments(self, parser):
        parser.add_argument("module", help="attribute_options altındaki dosya adı, ör: elect")
        parser.add_argument("--attribute", help="Sadece bu attribute slug'ını seed et")
        parser.add_argument("--dry-run", action="store_true")

    def handle(self, module, attribute=None, dry_run=False, **opts):
        try:
            mod = importlib.import_module(f"apps.catalog.attribute_options.{module}")
        except ImportError as e:
            raise CommandError(f"Dosya bulunamadı: attribute_options/{module}.py ({e})")

        rows = []
        for val in vars(mod).values():
            if isinstance(val, (list, tuple)):
                rows += [r for r in val if isinstance(r, dict) and "attribute_slug" in r]
        if attribute:
            rows = [r for r in rows if r["attribute_slug"] == attribute]
        if not rows:
            raise CommandError("Seed edilecek satır bulunamadı.")

        Attribute = _model("Attribute")
        Option = _model("AttributeOption")
        fk = next(f.name for f in Option._meta.fields
                  if f.is_relation and f.related_model is Attribute)
        fields = {f.name for f in Option._meta.fields}

        created = updated = 0
        with transaction.atomic():
            for r in rows:
                try:
                    attr = Attribute.objects.get(slug=r["attribute_slug"])
                except Attribute.DoesNotExist:
                    raise CommandError(f"Attribute yok: {r['attribute_slug']}")
                defaults = {k: v for k, v in r.items()
                            if k not in ("attribute_slug", "value") and k in fields}
                _, is_new = Option.objects.update_or_create(
                    **{fk: attr, "value": r["value"]}, defaults=defaults)
                created += is_new
                updated += not is_new
                if is_new:
                    self.stdout.write(f"  + {r['attribute_slug']}: {r['value']}")
            if dry_run:
                transaction.set_rollback(True)

        tag = "DRY-RUN (kaydedilmedi)" if dry_run else "Tamam"
        self.stdout.write(self.style.SUCCESS(
            f"{tag}: {created} yeni, {updated} güncellendi ({len(rows)} satır)"))