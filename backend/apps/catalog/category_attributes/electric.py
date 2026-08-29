from .ecommerce import (
    COMMON_ATTRIBUTE_SLUGS,
    SEARCH_ATTRIBUTE_SLUGS,
)


ELECTRIC_CATEGORY_SLUGS = [
    "elektrikli",
    "elektrikli-motosiklet",
    "e-scooter",
    "e-bisiklet",
    "e-car",
    "e-kasali",
    "e-market-tipi",
]


ELECTRIC_ATTRIBUTE_SLUGS = [
    *COMMON_ATTRIBUTE_SLUGS,
    *SEARCH_ATTRIBUTE_SLUGS,

    # Elektrik motoru
    "elektrikli-motor-gucu",
    "elektrikli-motor-tipi",
    "surus-modlari",

    # Batarya
    "elektrikli-batarya-kapasitesi",
    "elektrikli-batarya-tipi",
    "elektrikli-batarya-garantisi",

    # Şarj
    "elektrikli-sarj-suresi",
    "hizli-sarj-destegi",
    "sarj-soketi-tipi",

    # Elektrikli performans
    "elektrikli-menzil",
    "elektrikli-maksimum-hiz",

    # Paylaşılan fiziksel özellikler (motorcycle.py'den referans, tekrar tanımlanmadı)
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
    "gosterge-paneli",
]