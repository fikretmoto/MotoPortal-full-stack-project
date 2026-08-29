from .ecommerce import (
    COMMON_ATTRIBUTE_SLUGS,
    SEARCH_ATTRIBUTE_SLUGS,
)


BICYCLE_CATEGORY_SLUGS = [
    "bisiklet",
    "dag-bisikleti",
    "yol-bisikleti",
    "sehir-bisikleti",
    "cocuk-bisikleti",
]


BICYCLE_ATTRIBUTE_SLUGS = [
    *COMMON_ATTRIBUTE_SLUGS,
    *SEARCH_ATTRIBUTE_SLUGS,

    # Çerçeve
    "cerceve-malzemesi",
    "cerceve-bedeni",
    "cerceve-geometrisi",

    # Tekerlek ve lastik
    "bisiklet-jant-capi",
    "bisiklet-lastik-genisligi",
    "bisiklet-jant-malzemesi",

    # Vites sistemi
    "bisiklet-vites-sayisi",
    "vites-grubu-markasi",
    "bisiklet-sanziman-tipi",

    # Fren sistemi
    "bisiklet-fren-tipi",
    "fren-mekanizmasi",

    # Süspansiyon
    "bisiklet-on-suspansiyon",
    "bisiklet-arka-suspansiyon",
    "suspansiyon-seyahati",

    # Elektrikli sistem
    "bisiklet-motor-gucu",
    "bisiklet-batarya-kapasitesi",
    "bisiklet-menzil",
    "bisiklet-sarj-suresi",

    # Boyut ve ağırlık
    "bisiklet-agirlik",
    "bisiklet-tasima-kapasitesi",

    # Donanım
    "camurluk",
    "bisiklet-bagaj",
    "bisiklet-isik",
    "standart-kickstand",
]