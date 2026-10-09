"""
Ekipman semasi gecis temizligi (PRODUCTION).

Production'da hala ESKI apparel.py semasi var (Faz 1/2 hic uygulanmadi).
Bu script, yeni semaya gecmeden once (seed_catalog calistirilmadan once)
eski semanin kalintilarini temizler:

  1. Eski apparel yapraklarinin (motosiklet-montu, motosiklet-pantolonu,
     motosiklet-eldiveni, motosiklet-botu, yagmurluk) ve koruma-ekipmani
     ust kategorisinin TUM CategoryAttribute baglantilarini siler.
  2. 28 eski Attribute'u siler (kullanim-turu ve baglanti-fermuari HARIC
     - bunlar yeni semada da kullaniliyor/yeniden kullaniliyor).
  3. Temizlik sonrasi hic attribute'u kalmayan eski gruplari siler
     (ornegin "Koruma"). Baska kategorinin kullandigi gruba dokunmaz.
     "mevsim-ve-hava-kosullari" grubu KORUNUR (Faz 1'de "Hava Kosullari"
     olarak yeniden kullanilacak, bos olsa bile silinmez).

Calistirma (local'de kullanilan ayni desen):
    python manage.py shell -c "exec(open(r'scripts/ekipman_cleanup.py', encoding='utf-8').read())"

DRY_RUN = True oldugu surece HICBIR SEY SILINMEZ -- sadece ne silinecegini
ve sayilarini yazdirir. DRY_RUN = False yapildiginda tek transaction
icinde calisir; herhangi bir hata olursa (ornegin PROTECT kisitlamasi
yuzunden) hicbir sey silinmeden islem geri alinir.
"""

DRY_RUN = True


from django.db import connection, transaction

from apps.catalog.models import (
    Attribute,
    AttributeGroup,
    AttributeOption,
    Category,
    CategoryAttribute,
)


print("=== 0. VERITABANI DOGRULAMA ===")
print("HOST:", connection.settings_dict["HOST"], "NAME:", connection.settings_dict["NAME"])
print("DRY_RUN =", DRY_RUN)


OLD_LEAF_CATEGORY_SLUGS = [
    "motosiklet-montu",
    "motosiklet-pantolonu",
    "motosiklet-eldiveni",
    "motosiklet-botu",
    "yagmurluk",
]

OLD_PARENT_CATEGORY_SLUGS = [
    "koruma-ekipmani",
]

OLD_CATEGORY_SLUGS = OLD_LEAF_CATEGORY_SLUGS + OLD_PARENT_CATEGORY_SLUGS

# Eski apparel.py'nin 30 "kendine ozel" (ecommerce disi) alanindan,
# kullanim-turu (kask tarafindan hala kullaniliyor) ve baglanti-fermuari
# (yeni semada reuse edilecek) haric kalan 28 alan.
OLD_ATTRIBUTE_SLUGS_TO_DELETE = [
    "urun-turu",
    "dis-malzeme",
    "ic-astar-malzemesi",
    "asinmaya-dayanikli-bolge",
    "dikis-yapisi",
    "omuz-korumasi",
    "dirsek-korumasi",
    "sirt-korumasi",
    "kalca-korumasi",
    "diz-korumasi",
    "parmak-korumasi",
    "bilek-korumasi",
    "kaval-korumasi",
    "koruma-sertifika-seviyesi",
    "cikarilabilir-iclik",
    "ayarlanabilir-bel",
    "ayarlanabilir-kol",
    "esnek-paneller",
    "dokunmatik-ekran-uyumu",
    "havalandirma-fermuari",
    "file-panel",
    "kullanim-mevsimi",
    "su-gecirmezlik",
    "ruzgar-gecirmezlik",
    "termal-iclik",
    "nefes-alabilirlik",
    "giyim-reflektif-detay",
    "ce-sertifikasi",
]

assert len(OLD_ATTRIBUTE_SLUGS_TO_DELETE) == 28

# Faz 1 kararinca bu grup silinmez: ayni slug ile "Hava Kosullari"
# olarak yeniden kullanilacak (seed_catalog sonraki adimda gunceller).
PROTECTED_GROUP_SLUGS = {
    "mevsim-ve-hava-kosullari",
}


def run():
    categories = Category.objects.filter(slug__in=OLD_CATEGORY_SLUGS)
    found_category_slugs = set(categories.values_list("slug", flat=True))
    missing_categories = set(OLD_CATEGORY_SLUGS) - found_category_slugs
    if missing_categories:
        print(f"UYARI: bulunamayan kategori slug'lari: {sorted(missing_categories)}")

    attributes = Attribute.objects.filter(slug__in=OLD_ATTRIBUTE_SLUGS_TO_DELETE)
    found_attribute_slugs = set(attributes.values_list("slug", flat=True))
    missing_attributes = set(OLD_ATTRIBUTE_SLUGS_TO_DELETE) - found_attribute_slugs
    if missing_attributes:
        print(f"UYARI: bulunamayan attribute slug'lari: {sorted(missing_attributes)}")

    # --- 1. CategoryAttribute baglantilari ---
    print("\n=== 1. ESKI KATEGORI-OZELLIK BAGLANTILARI ===")
    category_attribute_qs = CategoryAttribute.objects.filter(
        category__in=categories
    ).select_related("category", "attribute")

    ca_list = list(category_attribute_qs)
    print(f"Silinecek CategoryAttribute sayisi: {len(ca_list)}")
    for ca in ca_list:
        print(f"  {ca.category.slug} -> {ca.attribute.slug}")

    # --- 2. Attribute'lar + bagli AttributeOption / ProductAttributeValue ---
    print("\n=== 2. ESKI ATTRIBUTE'LAR (28 adet) ===")
    attribute_list = list(attributes)
    print(f"Silinecek Attribute sayisi: {len(attribute_list)}")
    for attribute in attribute_list:
        print(f"  {attribute.slug} ({attribute.name}, grup: {attribute.group.slug})")

    option_count = AttributeOption.objects.filter(attribute__in=attributes).count()
    print(f"\nBu attribute'lara bagli AttributeOption (CASCADE ile silinecek): {option_count}")

    product_value_qs = None
    try:
        from apps.catalog.models import ProductAttributeValue

        product_value_qs = ProductAttributeValue.objects.filter(attribute__in=attributes)
    except ImportError:
        pass

    if product_value_qs is not None:
        product_value_count = product_value_qs.count()
        print(
            f"Bu attribute'lara bagli ProductAttributeValue: {product_value_count} "
            "(attribute FK'si PROTECT -- CASCADE DEGIL: bu sayi 0'dan "
            "buyukse Attribute.delete() hata verir ve DRY_RUN=False "
            "calistirmada transaction hicbir sey silmeden geri alinir)"
        )
        if product_value_count > 0:
            for pav in product_value_qs.select_related("product", "attribute")[:20]:
                print(f"  ENGEL: {pav.product_id} -> {pav.attribute.slug} = {pav.value!r}")

    # --- 3. Bu silme sonrasi bos kalacak gruplar ---
    affected_group_ids = {a.group_id for a in attribute_list}
    affected_groups = AttributeGroup.objects.filter(id__in=affected_group_ids)

    print("\n=== 3. BOS KALACAK (SILINECEK) OZELLIK GRUPLARI ===")
    groups_to_delete = []
    for group in affected_groups:
        if group.slug in PROTECTED_GROUP_SLUGS:
            print(f"  KORUNUYOR: {group.slug} (korumali, silinmeyecek)")
            continue

        remaining_count = (
            Attribute.objects.filter(group=group)
            .exclude(slug__in=OLD_ATTRIBUTE_SLUGS_TO_DELETE)
            .count()
        )
        if remaining_count == 0:
            groups_to_delete.append(group)
            print(f"  SILINECEK: {group.slug} ({group.name}) -- silme sonrasi 0 attribute")
        else:
            print(
                f"  KALACAK: {group.slug} ({group.name}) -- silme sonrasi "
                f"{remaining_count} attribute baska kategorilerce kullaniliyor"
            )

    print(f"\nSilinecek grup sayisi: {len(groups_to_delete)}")

    if DRY_RUN:
        print("\n=== DRY_RUN = True -- HICBIR SEY SILINMEDI ===")
        return

    print("\n=== GERCEK SILME ISLEMI BASLIYOR (tek transaction) ===")
    with transaction.atomic():
        deleted_ca_count, _ = category_attribute_qs.delete()
        print(f"Silinen CategoryAttribute: {deleted_ca_count}")

        deleted_attr_count, _ = attributes.delete()
        print(f"Silinen Attribute (+ cascade AttributeOption): {deleted_attr_count}")

        for group in groups_to_delete:
            group.delete()
            print(f"Silinen grup: {group.slug}")

    print("\n=== TAMAMLANDI (silindi) ===")


run()
