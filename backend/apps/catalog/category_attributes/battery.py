from .ecommerce import (
    COMMON_ATTRIBUTE_SLUGS,
    FITMENT_ATTRIBUTE_SLUGS,
    SEARCH_ATTRIBUTE_SLUGS,
)


BATTERY_CATEGORY_SLUGS = [
    "aku",
]


BATTERY_ATTRIBUTE_SLUGS = [
    *COMMON_ATTRIBUTE_SLUGS,
    *FITMENT_ATTRIBUTE_SLUGS,
    *SEARCH_ATTRIBUTE_SLUGS,

    # Genel bilgiler
    "aku-tipi",
    "bakim-durumu",

    # Akü elektrik değerleri
    "aku-voltaj",
    "aku-kapasite",
    "soguk-mars-akimi",
    "aku-enerji",

    # Akü boyutları
    "aku-uzunluk",
    "aku-genislik",
    "aku-yukseklik",
    "aku-agirligi",

    # Akü teknolojisi
    "aku-teknolojisi",
    "kutup-yerlesimi",
    "aku-havalandirma",

    # Aküye özel uyumluluk
    "uyumlu-motosiklet",

    # Aküye özel garanti
    "aku-garanti-suresi",
]