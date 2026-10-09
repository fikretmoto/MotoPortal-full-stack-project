from .ecommerce import (
    COMMON_ATTRIBUTE_SLUGS,
    SEARCH_ATTRIBUTE_SLUGS,
)


APPAREL_RAIN_CATEGORY_SLUGS = [
    "yagmurluk",
]


APPAREL_RAIN_ATTRIBUTE_SLUGS = [
    *COMMON_ATTRIBUTE_SLUGS,
    *SEARCH_ATTRIBUTE_SLUGS,

    # apparel_common havuzundan yağmurluk için seçilenler
    "cinsiyet",
    "kalip",
    "reflektor",

    # apparel_rain'e özel
    "yagmurluk-tipi",
    "paketlenebilir",
    "dikis-bantli",
    "isi-korumali-panel",
]


APPAREL_RAIN_HIGHLIGHT_SLUGS = [
    "yagmurluk-tipi",
    "paketlenebilir",
    "reflektor",
    "dikis-bantli",
]
