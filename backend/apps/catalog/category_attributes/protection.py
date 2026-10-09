from .ecommerce import (
    COMMON_ATTRIBUTE_SLUGS,
    SEARCH_ATTRIBUTE_SLUGS,
)


# 6 yaprak aynı şemayı paylaşır (bölge bilgisi kategorinin kendisinde)
PROTECTION_CATEGORY_SLUGS = [
    "boyun-koruyucu",
    "dirseklik",
    "dizlik",
    "gogus-koruyucu",
    "sirt-koruyucu",
    "yedek-zirh",
]


PROTECTION_ATTRIBUTE_SLUGS = [
    *COMMON_ATTRIBUTE_SLUGS,
    *SEARCH_ATTRIBUTE_SLUGS,

    # protection'a özel
    "koruma-standardi",
    "koruma-seviyesi",
    "koruyucu-malzemesi",
    "kullanim-sekli",
    "havalandirmali",
]


PROTECTION_HIGHLIGHT_SLUGS = [
    "koruma-standardi",
    "koruma-seviyesi",
    "koruyucu-malzemesi",
    "kullanim-sekli",
]


# Zırhlı Gömlek / Yelek: protection şemasının aynısı + havuzdan cinsiyet ve kalip
ZIRHLI_GOMLEK_YELEK_CATEGORY_SLUGS = [
    "zirhli-gomlek-yelek",
]


ZIRHLI_GOMLEK_YELEK_ATTRIBUTE_SLUGS = [
    *PROTECTION_ATTRIBUTE_SLUGS,
    "cinsiyet",
    "kalip",
]


ZIRHLI_GOMLEK_YELEK_HIGHLIGHT_SLUGS = [
    *PROTECTION_HIGHLIGHT_SLUGS,
]
