from .ecommerce import (
    COMMON_ATTRIBUTE_SLUGS,
    SEARCH_ATTRIBUTE_SLUGS,
)


MOTORCYCLE_CATEGORY_SLUGS = [
    "motosiklet",
    "naked",
    "enduro",
    "adventure",
    "touring",
    "sport",
    "chopper",
    "cross",
    "cub",
    "klasik",
]


MOTORCYCLE_ATTRIBUTE_SLUGS = [
    *COMMON_ATTRIBUTE_SLUGS,
    *SEARCH_ATTRIBUTE_SLUGS,

    # Motor
    "motor-hacmi",
    "silindir-sayisi",
    "motor-tipi",
    "sogutma-sistemi",
    "supap-sayisi",
    "sikistirma-orani",

    # Performans
    "maksimum-guc",
    "maksimum-guc-devri",
    "maksimum-tork",
    "maksimum-tork-devri",
    "maksimum-hiz-min",
    "maksimum-hiz-max",

    # Şanzıman ve aktarma
    "sanziman-tipi",
    "vites-sayisi",
    "debriyaj-tipi",
    "son-aktarma-tipi",

    # Yakıt ve enerji
    "yakit-turu",
    "yakit-sistemi",
    "yakit-deposu",
    "yakit-tuketimi-min",
    "yakit-tuketimi-max",

    # Boyutlar ve ağırlık
    "uzunluk",
    "genislik",
    "yukseklik",
    "dingil-mesafesi",
    "sele-yuksekligi",
    "yerden-yukseklik",
    "bos-agirlik",
    "tasima-kapasitesi",

    # Fren ve güvenlik
    "on-fren",
    "arka-fren",
    "abs",
    "cbs",
    "cekis-kontrolu",
    "immobilizer",

    # Süspansiyon
    "on-suspansiyon",
    "arka-suspansiyon",

    # Jant ve lastik
    "on-lastik",
    "arka-lastik",
    "on-jant",
    "arka-jant",

    # Elektrik ve elektronik
    "aku",
    "far-tipi",
    "gosterge-paneli",

    # Donanım
    "usb-sarj-girisi",
    "anahtarsiz-calistirma",

    
]

# Adventure/Touring tipi motosikletlerde anlamlı olan, ama Naked/Racing
# gibi diğer motosiklet alt kategorilerinde alakasız kalacak ek donanım
# alanları. Sadece "adventure" kategorisine eklenir, tüm
# MOTORCYCLE_CATEGORY_SLUGS ağacına değil.
ADVENTURE_EXTRA_ATTRIBUTE_SLUGS = [
    "telefon-baglantisi",
    "on-cam",
    "arka-portbagaj",
    "navigasyon-destegi",
]

MOTORCYCLE_HIGHLIGHT_SLUGS = [
    "model-yili",
    "motor-hacmi",
    "yakit-deposu",
    "yakit-tuketimi-min",
    "bos-agirlik",
    "maksimum-guc",
    "maksimum-tork",
    "on-fren",
]