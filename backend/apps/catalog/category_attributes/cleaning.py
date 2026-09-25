from .ecommerce import (
    COMMON_ATTRIBUTE_SLUGS,
    SEARCH_ATTRIBUTE_SLUGS,
)


CLEANING_CATEGORY_SLUGS = [
    # Motosiklet Temizliği
    "motosiklet-sampuanlari",
    "genel-temizleyiciler",
    "kopuk-temizleyiciler",
    "yag-ve-kir-sokuculer",
    "jant-temizleyiciler",
    "lastik-temizleyiciler",
    "motor-metal-temizleyiciler",
    "plastik-grenaj-temizleyiciler",

    # Zincir Temizliği
    "zincir-temizleyici",
    "zincir-yag-sokucu-degreaser",
    "zincir-temizleme-spreyi",
    "zincir-fircasi",
    "zincir-temizlik-seti",

    # Kask ve Vizör Bakımı
    "kask-temizleyiciler",
    "vizor-temizleyiciler",
    "vizor-bezleri",
    "anti-fog-bugu-onleyiciler",
    "kask-ic-temizleyiciler",
    "kask-bakim-setleri",

    # Parlatma ve Koruma
    "pasta",
    "cila",
    "sprey-cila",
    "wax",
    "boya-koruyucular",
    "seramik-yuzey-koruma",
    "plastik-koruyucular",
    "metal-parlaticilar",
    "krom-parlaticilar",

    # Fırça ve Bezler
    "zincir-fircalari",
    "jant-fircalari",
    "detay-fircalari",
    "yikama-fircalari",
    "mikrofiber-bezler",
    "kurulama-bezleri",
    "sungerler",
    "temizlik-eldivenleri",

    # Bakım Setleri
    "zincir-bakim-setleri",
    "motosiklet-yikama-setleri",
    "detayli-temizlik-setleri",
    "genel-bakim-setleri",

    # Hava Filtresi Bakımı
    "hava-filtresi-temizleyiciler",
    "hava-filtresi-yaglari",
    "hava-filtresi-bakim-setleri",
]


CLEANING_ATTRIBUTE_SLUGS = [
    *COMMON_ATTRIBUTE_SLUGS,
    *SEARCH_ATTRIBUTE_SLUGS,

    "temizlik-hacmi",
]
