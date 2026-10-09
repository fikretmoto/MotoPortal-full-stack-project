from .ecommerce import (
    COMMON_ATTRIBUTE_SLUGS,
    SEARCH_ATTRIBUTE_SLUGS,
)


APPAREL_BOOTS_CATEGORY_SLUGS = [
    "motosiklet-botu",
]


APPAREL_BOOTS_ATTRIBUTE_SLUGS = [
    *COMMON_ATTRIBUTE_SLUGS,
    *SEARCH_ATTRIBUTE_SLUGS,

    # apparel_common havuzundan bot için seçilenler
    "cinsiyet",
    "surus-tarzi",
    "sezon",
    "ana-malzeme",
    "su-gecirmez-membran",
    "membran-teknolojisi",
    "reflektor",

    # apparel_boots'a özel
    "konc-yuksekligi",
    "en-13634",
    "kapanma-tipi",
    "taban-tipi",
    "vites-pedi",
    "ayak-bilegi-korumasi",
]


APPAREL_BOOTS_HIGHLIGHT_SLUGS = [
    "konc-yuksekligi",
    "ana-malzeme",
    "su-gecirmez-membran",
    "kapanma-tipi",
    "en-13634",
    "sezon",
]
