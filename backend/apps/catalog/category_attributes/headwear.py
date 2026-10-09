from .ecommerce import (
    COMMON_ATTRIBUTE_SLUGS,
    SEARCH_ATTRIBUTE_SLUGS,
)


# kask-ici-bone ve boyunluk-bandana aynı şemayı paylaşır
HEADWEAR_CATEGORY_SLUGS = [
    "kask-ici-bone",
    "boyunluk-bandana",
]


HEADWEAR_ATTRIBUTE_SLUGS = [
    *COMMON_ATTRIBUTE_SLUGS,
    *SEARCH_ATTRIBUTE_SLUGS,

    # apparel_common havuzundan baş giyim için seçilenler
    "islev",

    # headwear'a özel
    "baslik-malzemesi",
    "ruzgar-gecirmez",
]


HEADWEAR_HIGHLIGHT_SLUGS = [
    "baslik-malzemesi",
    "islev",
    "ruzgar-gecirmez",
]
