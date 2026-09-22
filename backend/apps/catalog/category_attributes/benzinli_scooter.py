from .ecommerce import (
    COMMON_ATTRIBUTE_SLUGS,
    SEARCH_ATTRIBUTE_SLUGS,
)
from apps.catalog.attributes.scooter_common import SCOOTER_COMMON_ATTRIBUTE_SLUGS


BENZINLI_SCOOTER_CATEGORY_SLUGS = [
    "scooter",
    "50cc-scooter",
    "125cc-scooter",
    "150-250cc-arasi-scooter",
    "maxi-scooter-250cc",
    "maxi-scooter-250cc-uzeri",
]


BENZINLI_SCOOTER_ATTRIBUTE_SLUGS = [
    *COMMON_ATTRIBUTE_SLUGS,
    *SEARCH_ATTRIBUTE_SLUGS,
    *SCOOTER_COMMON_ATTRIBUTE_SLUGS,

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

    # Şanzıman ve aktarma
    "sanziman-tipi",
    "debriyaj-tipi",
    "son-aktarma-tipi",

    # Yakıt ve enerji
    "yakit-turu",
    "yakit-sistemi",
    "yakit-deposu",
    "yakit-tuketimi-min",
    "yakit-tuketimi-max",
    "yakit-deposu-konumu",

    # Elektrik (benzinli-özel: 12V marş aküsü)
    "aku",

    # Scooter'a özel donanım (motor-bağımlı)
    "start-stop-sistemi",
    "idling-stop",
    "ayak-marsi",
]

BENZINLI_SCOOTER_HIGHLIGHT_SLUGS = [
    "model-yili",
    "motor-hacmi",
    "yakit-deposu",
    "yakit-tuketimi-min",
    "bos-agirlik",
    "maksimum-guc",
    "maksimum-tork",
    "on-fren",
    "sele-alti-bagaj-hacmi",
    "maksimum-hiz-min",
    "yakit-deposu-konumu",
]
