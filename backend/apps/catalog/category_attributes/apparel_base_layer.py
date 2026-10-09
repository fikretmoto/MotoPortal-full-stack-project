from .ecommerce import (
    COMMON_ATTRIBUTE_SLUGS,
    SEARCH_ATTRIBUTE_SLUGS,
)


APPAREL_BASE_LAYER_CATEGORY_SLUGS = [
    "termal-iclik",
]


APPAREL_BASE_LAYER_ATTRIBUTE_SLUGS = [
    *COMMON_ATTRIBUTE_SLUGS,
    *SEARCH_ATTRIBUTE_SLUGS,

    # apparel_common havuzundan termal içlik için seçilenler
    "cinsiyet",
    "sezon",
    "termal-astar",

    # apparel_base_layer'a özel
    "iclik-tipi",
    "iclik-malzemesi",
    "dikissiz",
    "antibakteriyel",
]


APPAREL_BASE_LAYER_HIGHLIGHT_SLUGS = [
    "iclik-tipi",
    "iclik-malzemesi",
    "sezon",
    "dikissiz",
]
