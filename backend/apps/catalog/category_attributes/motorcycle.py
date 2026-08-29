from .ecommerce import (
    COMMON_ATTRIBUTE_SLUGS,
    SEARCH_ATTRIBUTE_SLUGS,
)


MOTORCYCLE_CATEGORY_SLUGS = [
    "motosiklet",
    "naked",
    "enduro",
    "adventure",
    "touring",
    "sport",
    "chopper",
    "cross",
]


MOTORCYCLE_ATTRIBUTE_SLUGS = [
    *COMMON_ATTRIBUTE_SLUGS,
    *SEARCH_ATTRIBUTE_SLUGS,

    # Motor
    "motor-hacmi",
    "silindir-sayisi",
    "motor-tipi",
    "sogutma-sistemi",
    "supap-sayisi",
    "sikistirma-orani",

    # Performans
    "maksimum-guc",
    "maksimum-guc-devri",
    "maksimum-tork",
    "maksimum-tork-devri",
    "maksimum-hiz",

    # Şanzıman ve aktarma
    "sanziman-tipi",
    "vites-sayisi",
    "debriyaj-tipi",
    "son-aktarma-tipi",

    # Yakıt ve enerji
    "yakit-turu",
    "yakit-sistemi",
    "yakit-deposu",
    "yakit-tuketimi",

    # Boyutlar ve ağırlık
    "uzunluk",
    "genislik",
    "yukseklik",
    "dingil-mesafesi",
    "sele-yuksekligi",
    "yerden-yukseklik",
    "bos-agirlik",
    "tasima-kapasitesi",

    # Fren ve güvenlik
    "on-fren",
    "arka-fren",
    "abs",
    "cbs",
    "cekis-kontrolu",
    "immobilizer",

    # Süspansiyon
    "on-suspansiyon",
    "arka-suspansiyon",

    # Jant ve lastik
    "on-lastik",
    "arka-lastik",
    "on-jant",
    "arka-jant",

    # Elektrik ve elektronik
    "aku",
    "far-tipi",
    "gosterge-paneli",

    # Donanım
    "usb-sarj-girisi",
    "anahtarsiz-calistirma",

    
]

MOTORCYCLE_HIGHLIGHT_SLUGS = [
    "model-yili",
    "motor-hacmi",
    "maksimum-guc",
    "maksimum-tork",
    "sanziman-tipi",
]