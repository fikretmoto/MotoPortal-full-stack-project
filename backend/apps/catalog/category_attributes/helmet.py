from .ecommerce import (
    COMMON_ATTRIBUTE_SLUGS,
    SEARCH_ATTRIBUTE_SLUGS,
)


HELMET_CATEGORY_SLUGS = [
    "kask",
    "integral-kask",
    "moduler-kask",
    "acik-kask",
    "cross-kask",
]


HELMET_ATTRIBUTE_SLUGS = [
    *COMMON_ATTRIBUTE_SLUGS,
    *SEARCH_ATTRIBUTE_SLUGS,

    # Genel bilgiler
    "kask-tipi",
    "kullanim-turu",

    # Malzeme ve yapı
    "kabuk-malzemesi",
    "kabuk-sayisi",
    "ic-darbe-emici-malzeme",
    "kask-agirligi",

    # Vizör ve görüş
    "ana-vizor-tipi",
    "dahili-gunes-vizoru",
    "pinlock-uyumlu",
    "pinlock-dahil",
    "cizilmeye-dayanikli-vizor",
    "uv-korumasi",

    # Güvenlik
    "cene-baglanti-tipi",
    "acil-durum-ped-cikarma",
    "reflektif-detay",

    # Konfor
    "ic-pedler-cikarilabilir",
    "ic-pedler-yikanabilir",
    "gozluk-kullanimina-uygun",
    "intercom-hazirligi",
    "burun-koruyucu",
    "cene-perdesi",

    # Havalandırma
    "on-hava-girisi-sayisi",
    "arka-hava-cikisi-sayisi",
    "ayarlanabilir-havalandirma",

    # Standartlar ve sertifikalar
    "ece-sertifikasi",
    "dot-sertifikasi",
    "snell-sertifikasi",
    "pj-homologasyonu",
]