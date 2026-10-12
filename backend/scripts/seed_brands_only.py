"""
Sadece Brand modelini brands.py'deki BRAND_DATA'ya gore senkronize eder.
seed_catalog.py'nin tam calismasini gerektirmeden markalari eklemek/
guncellemek icin.

seed_catalog.py'nin seed_brands() metoduyla ayni mantik: Brand.objects
.update_or_create(name=..., defaults={...}). Hicbir silme islemi yapmaz,
hicbir baska modele (kategori, ozellik, urun vb.) dokunmaz.

Calistirma (local):
    python manage.py shell -c "exec(open(r'scripts/seed_brands_only.py', encoding='utf-8').read())"

Calistirma (production, run_production.ps1 ile):
    ./scripts/run_production.ps1 shell -c "exec(open(r'scripts/seed_brands_only.py', encoding='utf-8').read())"
"""

from django.db import connection

from apps.catalog.brands import BRAND_DATA
from apps.catalog.models import Brand

print("=== VERITABANI ===")
print("HOST:", connection.settings_dict["HOST"], "NAME:", connection.settings_dict["NAME"])

print(f"\nbrands.py BRAND_DATA toplam: {len(BRAND_DATA)}")

created_count = 0
updated_count = 0

for item in BRAND_DATA:
    _, created = Brand.objects.update_or_create(
        name=item["name"],
        defaults={
            "slug": item["slug"],
            "country": item["country"],
            "founded_year": item["founded_year"],
            "website": item["website"],
            "description": item["description"],
            "is_active": True,
        },
    )

    if created:
        created_count += 1
        print(f"OLUSTURULDU: {item['name']}")

print(f"\nToplam olusturulan: {created_count}")
print(f"Toplam guncellenen: {len(BRAND_DATA) - created_count}")
print(f"DB'deki toplam Brand sayisi (seed sonrasi): {Brand.objects.count()}")

print("\nTAMAMLANDI.")
