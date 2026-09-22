from .ecommerce import (
    COMMON_ATTRIBUTE_SLUGS,
    SEARCH_ATTRIBUTE_SLUGS,
)


ELECTRIC_CATEGORY_SLUGS = [
    "elektrikli",
    "elektrikli-motosiklet",
]


# Tüm elektrikli araç tiplerinin (e-scooter, e-bisiklet, e-kasali,
# e-market-tipi, e-car) kendi category_attributes dosyalarında import
# ettiği, motor/batarya/şarj/menzil + gösterge paneli çekirdek havuzu.
ELECTRIC_CORE_ATTRIBUTE_SLUGS = [
    # Elektrik motoru
    "elektrikli-motor-gucu",
    "elektrikli-motor-tipi",
    "surus-modlari",

    # Batarya
    "elektrikli-batarya-kapasitesi",
    "elektrikli-batarya-tipi",
    "elektrikli-batarya-garantisi",

    # Şarj
    "elektrikli-sarj-suresi-min",
    "elektrikli-sarj-suresi-max",
    "hizli-sarj-destegi",
    "sarj-soketi-tipi",

    # Elektrikli performans
    "elektrikli-menzil-min",
    "elektrikli-menzil-max",
    "elektrikli-maksimum-hiz",

    # Gösterge (fiziksel havuzu olmayan elektrikli araç tiplerinde de
    # kullanılabilsin diye çekirdeğe dahil edildi)
    "gosterge-paneli",
]


ELECTRIC_ATTRIBUTE_SLUGS = [
    *COMMON_ATTRIBUTE_SLUGS,
    *SEARCH_ATTRIBUTE_SLUGS,
    *ELECTRIC_CORE_ATTRIBUTE_SLUGS,

    # Paylaşılan fiziksel özellikler — sadece "elektrikli-motosiklet"
    # için (diğer elektrikli araç tipleri artık kendi fiziksel
    # havuzlarını kullanıyor: e-scooter -> scooter_common,
    # e-bisiklet -> bicycle ATTRIBUTE_SLUGS).
    "uzunluk",
    "genislik",
    "yukseklik",
    "bos-agirlik",
    "tasima-kapasitesi",
    "on-fren",
    "arka-fren",
    "abs",
    "on-suspansiyon",
    "arka-suspansiyon",
    "on-lastik",
    "arka-lastik",
    "on-jant",
    "arka-jant",
    "far-tipi",
]
