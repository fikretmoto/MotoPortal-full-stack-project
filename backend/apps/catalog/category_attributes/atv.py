from .ecommerce import (
    COMMON_ATTRIBUTE_SLUGS,
    SEARCH_ATTRIBUTE_SLUGS,
)


ATV_CATEGORY_SLUGS = [
    "atv-4-ceker",
    "atv-2-ceker",
    "utv-4-ceker",
    "utv-2-ceker",
]


ATV_ATTRIBUTE_SLUGS = [
    *COMMON_ATTRIBUTE_SLUGS,
    *SEARCH_ATTRIBUTE_SLUGS,

    # Motor
    "motor-hacmi",
    "silindir-sayisi",
    "motor-tipi",
    "sogutma-sistemi",
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
    "diferansiyel-kilidi",

    # Yakıt ve enerji
    "yakit-turu",
    "yakit-sistemi",
    "yakit-deposu",

    # Boyutlar ve ağırlık
    "uzunluk",
    "genislik",
    "yukseklik",
    "dingil-mesafesi",
    "sele-yuksekligi",
    "yerden-yukseklik",
    "bos-agirlik",
    "tasima-kapasitesi",

    # Fren ve süspansiyon
    "on-fren",
    "arka-fren",
    "abs",
    "ebs",
    "on-suspansiyon",
    "arka-suspansiyon",

    # Jant ve lastik
    "on-lastik",
    "arka-lastik",
    "on-jant",
    "arka-jant",
    "beadlock-jant",

    # Elektrik ve elektronik
    "far-tipi",
    "gosterge-paneli",
    "eps",
    "telefon-baglantisi",

    # Donanım
    "vinc-kapasitesi",
    "cekme-gucu",
    "on-tampon",
    "celik-raf",
    "plastik-raf",
    "on-raf-kapasitesi",
    "arka-raf-kapasitesi",
    "cekici-apartlari",
    "gidon-korumasi",

    # Malzeme ve yapı
    "sasi-malzemesi",

    # Genel bilgiler
    "arac-sinifi",
]
