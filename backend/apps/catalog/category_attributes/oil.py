from .ecommerce import (
    COMMON_ATTRIBUTE_SLUGS,
    FITMENT_ATTRIBUTE_SLUGS,
    SEARCH_ATTRIBUTE_SLUGS,
)


OIL_CATEGORY_SLUGS = [
    "motor-yagi",
    "sanziman-yagi",
    "2t-yagi",
    "fork-yagi",
    "fren-hidroligi",
    "sogutma-sivisi",
]


OIL_ATTRIBUTE_SLUGS = [
    *COMMON_ATTRIBUTE_SLUGS,
    *FITMENT_ATTRIBUTE_SLUGS,
    *SEARCH_ATTRIBUTE_SLUGS,

    # Genel Bilgiler
    "yag-turu",
    "yag-motor-tipi",

    # Teknik Değerler
    "viskozite",
    "baz-yag-tipi",
    "yag-hacmi",

    # Standartlar
    "api-standardi",
    "jaso-standardi",
    "acea-standardi",
    "uretici-onayi",

    # Kullanım
    "yag-kullanim-alani",
    "islak-debriyaj-uyumlu",
    "iki-zamanli-dort-zamanli",

    # Yağa özel uyumluluk
    "yag-uyumlu-motosiklet",
]