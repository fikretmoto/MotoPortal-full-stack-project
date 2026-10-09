from .ecommerce import (
    COMMON_ATTRIBUTE_SLUGS,
    SEARCH_ATTRIBUTE_SLUGS,
)


APPAREL_SUIT_CATEGORY_SLUGS = [
    "tulum",
]


APPAREL_SUIT_ATTRIBUTE_SLUGS = [
    *COMMON_ATTRIBUTE_SLUGS,
    *SEARCH_ATTRIBUTE_SLUGS,

    # apparel_common havuzundan tulum için seçilenler
    "cinsiyet",
    "surus-tarzi",
    "kalip",
    "sezon",
    "ana-malzeme",
    "dis-kumas-detayi",
    "su-gecirmez-membran",
    "membran-teknolojisi",
    "termal-astar",
    "reflektor",
    "en-17092-sinifi",
    "omuz-dirsek-koruma",
    "sirt-koruma",
    "gogus-koruma",
    "airbag",
    "diz-koruma",
    "diz-slider",

    # apparel_suit'e özel
    "tulum-tipi",
    "aerodinamik-kambur",
    "strec-paneller",
]


APPAREL_SUIT_HIGHLIGHT_SLUGS = [
    "tulum-tipi",
    "ana-malzeme",
    "en-17092-sinifi",
    "sirt-koruma",
    "diz-koruma",
    "airbag",
]
