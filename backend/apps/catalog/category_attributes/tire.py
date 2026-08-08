from .ecommerce import (
    COMMON_ATTRIBUTE_SLUGS,
    FITMENT_ATTRIBUTE_SLUGS,
    SEARCH_ATTRIBUTE_SLUGS,
)


TIRE_CATEGORY_SLUGS = [
    "lastik",
    "on-lastik",
    "arka-lastik",
]


TIRE_ATTRIBUTE_SLUGS = [
    *COMMON_ATTRIBUTE_SLUGS,
    *FITMENT_ATTRIBUTE_SLUGS,
    *SEARCH_ATTRIBUTE_SLUGS,

    # Genel bilgiler
    "lastik-turu",
    "kullanim-konumu",
    "ic-lastikli-tubeless",

    # Lastik ölçüleri
    "taban-genisligi",
    "kesit-orani",
    "jant-capi",
    "lastik-ebati",

    # Lastik yapısı
    "yapi-tipi",
    "kat-yapisi",
    "karkas-tipi",
    "hamur-tipi",
    "desen-tipi",

    # Performans endeksleri
    "yuk-endeksi",
    "hiz-endeksi",
    "maksimum-yuk",
    "lastik-maksimum-hiz",
    "islak-zemin-performansi",

    # Kullanım ve yol tipi
    "lastik-kullanim-alani",
    "yol-arazi-orani",
    "lastik-mevsim-kullanimi",
    "yagmur-performansi",

    # Uyumluluk
    "uyumlu-motosiklet-tipi",

    # Standartlar
    "lastik-ece-onayi",
    "dot-kodu",
]