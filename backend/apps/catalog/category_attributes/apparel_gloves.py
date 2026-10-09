from .ecommerce import (
    COMMON_ATTRIBUTE_SLUGS,
    SEARCH_ATTRIBUTE_SLUGS,
)


APPAREL_GLOVES_CATEGORY_SLUGS = [
    "motosiklet-eldiveni",
]


APPAREL_GLOVES_ATTRIBUTE_SLUGS = [
    *COMMON_ATTRIBUTE_SLUGS,
    *SEARCH_ATTRIBUTE_SLUGS,

    # apparel_common havuzundan eldiven için seçilenler
    "cinsiyet",
    "surus-tarzi",
    "sezon",
    "ana-malzeme",
    "su-gecirmez-membran",
    "membran-teknolojisi",
    "termal-astar",
    "reflektor",

    # apparel_gloves'a özel
    "bilek-tipi",
    "en-13594-seviyesi",
    "eklem-korumasi",
    "avuc-ici-malzemesi",
    "avuc-ici-slider",
    "dokunmatik-uyumlu",
    "isitmali",
]


APPAREL_GLOVES_HIGHLIGHT_SLUGS = [
    "bilek-tipi",
    "ana-malzeme",
    "sezon",
    "en-13594-seviyesi",
    "dokunmatik-uyumlu",
    "su-gecirmez-membran",
]
