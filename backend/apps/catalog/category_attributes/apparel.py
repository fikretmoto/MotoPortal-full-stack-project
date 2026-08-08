from .ecommerce import (
    COMMON_ATTRIBUTE_SLUGS,
    SEARCH_ATTRIBUTE_SLUGS,
)


APPAREL_CATEGORY_SLUGS = [
    "motosiklet-montu",
    "motosiklet-pantolonu",
    "motosiklet-eldiveni",
    "motosiklet-botu",
    "yagmurluk",
    "koruma-ekipmani",
]


APPAREL_ATTRIBUTE_SLUGS = [
    *COMMON_ATTRIBUTE_SLUGS,
    *SEARCH_ATTRIBUTE_SLUGS,

    # Genel bilgiler
    "urun-turu",
    "kullanim-turu",

    # Malzeme ve yapı
    "dis-malzeme",
    "ic-astar-malzemesi",
    "asinmaya-dayanikli-bolge",
    "dikis-yapisi",

    # Koruma
    "omuz-korumasi",
    "dirsek-korumasi",
    "sirt-korumasi",
    "kalca-korumasi",
    "diz-korumasi",
    "parmak-korumasi",
    "bilek-korumasi",
    "kaval-korumasi",
    "koruma-sertifika-seviyesi",

    # Konfor
    "cikarilabilir-iclik",
    "ayarlanabilir-bel",
    "ayarlanabilir-kol",
    "esnek-paneller",
    "baglanti-fermuari",
    "dokunmatik-ekran-uyumu",

    # Havalandırma
    "havalandirma-fermuari",
    "file-panel",

    # Mevsim ve hava koşulları
    "kullanim-mevsimi",
    "su-gecirmezlik",
    "ruzgar-gecirmezlik",
    "termal-iclik",
    "nefes-alabilirlik",

    # Güvenlik
    "giyim-reflektif-detay",

    # Standartlar ve sertifikalar
    "ce-sertifikasi",
]