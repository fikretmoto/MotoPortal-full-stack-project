from .ecommerce import (
    COMMON_ATTRIBUTE_SLUGS,
    FITMENT_ATTRIBUTE_SLUGS,
    SEARCH_ATTRIBUTE_SLUGS,
)


PARTS_CATEGORY_SLUGS = [
    "kaporta-plastik-aksam",
    "sele",
    "gidon-ve-gaz-kolu",
    "zincir-ve-disli",
    "debriyaj-parcalari",
    "hava-filtresi",
    "kasa-koruma-dusme-demiri",
]


PARTS_ATTRIBUTE_SLUGS = [
    *COMMON_ATTRIBUTE_SLUGS,
    *FITMENT_ATTRIBUTE_SLUGS,
    *SEARCH_ATTRIBUTE_SLUGS,

    "parca-tipi",
    "parca-rengi",
    "zincir-olcusu",
    "dis-sayisi",
    "filtre-tipi",
    "kasa-koruma-tipi",
    "parca-malzemesi",
    "parca-agirligi",
]