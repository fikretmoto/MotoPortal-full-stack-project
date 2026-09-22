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


# Normal Bisiklet + E-Bisiklet ortak alanları (motordan bağımsız,
# çerçeve/mekanik bileşenler + boyutlar). category_attributes/e_bike.py
# BICYCLE_ATTRIBUTE_SLUGS'ın tamamını (bu liste dahil) "e-bisiklet"
# kategorisine bağlar — diğer elektrikli araç kategorileri
# (elektrikli-motosiklet, e-scooter, e-car, vb.) pedal/krank/vites
# içermediği için bu alanları hiç görmez.
BICYCLE_COMMON_ATTRIBUTE_SLUGS = [
    "cerceve-geometrisi",
    "bisiklet-jant-malzemesi",
    "krank-seti",
    "vites-aktarici",
    "sele-malzemesi",
    "uzunluk",
    "genislik",
    "yukseklik",
]


BICYCLE_ATTRIBUTE_SLUGS = [
    *COMMON_ATTRIBUTE_SLUGS,
    *SEARCH_ATTRIBUTE_SLUGS,
    *BICYCLE_COMMON_ATTRIBUTE_SLUGS,

    # Çerçeve
    "cerceve-malzemesi",
    "cerceve-bedeni",
    # cerceve-geometrisi -> BICYCLE_COMMON_ATTRIBUTE_SLUGS'a taşındı

    # Tekerlek ve lastik
    "bisiklet-jant-capi",
    "bisiklet-lastik-genisligi",
    # bisiklet-jant-malzemesi -> BICYCLE_COMMON_ATTRIBUTE_SLUGS'a taşındı

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

    

    # Boyut ve ağırlık
    "bisiklet-agirlik",
    "bisiklet-tasima-kapasitesi",

    # Donanım
    "camurluk",
    "bisiklet-bagaj",
    "bisiklet-isik",
    "standart-kickstand",
]