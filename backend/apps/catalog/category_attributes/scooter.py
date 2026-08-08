from .ecommerce import (
    COMMON_ATTRIBUTE_SLUGS,
    SEARCH_ATTRIBUTE_SLUGS,
)


SCOOTER_CATEGORY_SLUGS = [
    "scooter",
]


SCOOTER_ATTRIBUTE_SLUGS = [
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
    "maksimum-hiz",

    # Şanzıman ve aktarma
    "sanziman-tipi",
    "son-aktarma-tipi",

    # Yakıt ve enerji
    "yakit-turu",
    "yakit-sistemi",
    "yakit-deposu",
    "yakit-tuketimi",
    "yakit-deposu-konumu",

    # Boyutlar ve ağırlık
    "uzunluk",
    "genislik",
    "yukseklik",
    "dingil-mesafesi",
    "sele-yuksekligi",
    "yerden-yukseklik",
    "bos-agirlik",
    "tasima-kapasitesi",
    "sele-alti-bagaj-hacmi",

    # Fren ve güvenlik
    "on-fren",
    "arka-fren",
    "abs",
    "cbs",
    "el-freni",
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
    "telefon-baglantisi",
    "navigasyon-destegi",

    # Scooter'a özel donanım
    "duz-taban",
    "on-cam",
    "start-stop-sistemi",
    "idling-stop",
    "akilli-anahtar",
    "arka-portbagaj",
    "ayak-marsi",
    "on-saklama-gozu",
]