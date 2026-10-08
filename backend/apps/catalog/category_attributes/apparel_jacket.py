from .ecommerce import (
    COMMON_ATTRIBUTE_SLUGS,
    SEARCH_ATTRIBUTE_SLUGS,
)


APPAREL_JACKET_CATEGORY_SLUGS = [
    "motosiklet-montu",
]


APPAREL_JACKET_ATTRIBUTE_SLUGS = [
    *COMMON_ATTRIBUTE_SLUGS,
    *SEARCH_ATTRIBUTE_SLUGS,

    # apparel_common havuzundan mont için seçilenler (ortak 9 + 7 ek)
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
    "omuz-dirsek-koruma",
    "sirt-koruma",
    "gogus-koruma",
    "airbag",

    # apparel_jacket'a özel
    "mont-tipi",
    "havalandirma-fermuarlari",
    "ayarlanabilir-bel-kol",
    "su-gecirmez-ic-cep",
]


APPAREL_JACKET_HIGHLIGHT_SLUGS = [
    "mont-tipi",
    "ana-malzeme",
    "sezon",
    "en-17092-sinifi",
    "sirt-koruma",
    "su-gecirmez-membran",
]
