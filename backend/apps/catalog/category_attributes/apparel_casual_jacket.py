
from .ecommerce import COMMON_ATTRIBUTE_SLUGS, SEARCH_ATTRIBUTE_SLUGS


APPAREL_CASUAL_JACKET_CATEGORY_SLUGS = [
    "ceket",
]


APPAREL_CASUAL_JACKET_ATTRIBUTE_SLUGS = list(dict.fromkeys([
    *COMMON_ATTRIBUTE_SLUGS,
    *SEARCH_ATTRIBUTE_SLUGS,
    "kalip",
    "ana-malzeme",
    "kumas-tipi",
    "desen",
    "kol-boyu",
    "yaka-tipi",
    "kapama-sekli",
    "cep",
    "astar-durumu",
    "ceket-boyu",
    "kullanim-ortami",
    "materyal-bileseni",
    "astar-malzemesi",
]))


APPAREL_CASUAL_JACKET_HIGHLIGHT_SLUGS = [
    "kalip",
    "ana-malzeme",
    "kumas-tipi",
    "renk",
    "cep",
    "kapama-sekli",
    "sezon",
]
