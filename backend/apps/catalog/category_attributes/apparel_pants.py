from .ecommerce import (
    COMMON_ATTRIBUTE_SLUGS,
    SEARCH_ATTRIBUTE_SLUGS,
)


APPAREL_PANTS_CATEGORY_SLUGS = [
    "motosiklet-pantolonu",
]


APPAREL_PANTS_ATTRIBUTE_SLUGS = [
    *COMMON_ATTRIBUTE_SLUGS,
    *SEARCH_ATTRIBUTE_SLUGS,

    # apparel_common havuzundan pantolon için seçilenler (ortak 9 + 5 ek)
    "cinsiyet",
    "surus-tarzi",
    "sezon",
    "ana-malzeme",
    "kalip",
    "su-gecirmez-membran",
    "membran-teknolojisi",
    "termal-astar",
    "reflektor",
    "en-17092-sinifi",
    "dis-kumas-detayi",
    "baglanti-fermuari",
    "diz-koruma",
    "diz-slider",

    # apparel_pants'a özel
    "pantolon-tipi",
    "kalca-koruma",
    "paca-boyu",
]


APPAREL_PANTS_HIGHLIGHT_SLUGS = [
    "pantolon-tipi",
    "ana-malzeme",
    "sezon",
    "en-17092-sinifi",
    "diz-koruma",
    "su-gecirmez-membran",
]
