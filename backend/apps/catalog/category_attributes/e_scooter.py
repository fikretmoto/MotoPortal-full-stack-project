from .ecommerce import (
    COMMON_ATTRIBUTE_SLUGS,
    SEARCH_ATTRIBUTE_SLUGS,
)
from apps.catalog.attributes.scooter_common import SCOOTER_COMMON_ATTRIBUTE_SLUGS
from .electric import ELECTRIC_CORE_ATTRIBUTE_SLUGS


E_SCOOTER_CATEGORY_SLUGS = [
    "e-scooter",
]


E_SCOOTER_ATTRIBUTE_SLUGS = [
    *COMMON_ATTRIBUTE_SLUGS,
    *SEARCH_ATTRIBUTE_SLUGS,
    *SCOOTER_COMMON_ATTRIBUTE_SLUGS,

    # elektrikli-maksimum-hiz hariç tutuldu — scooter_common'ın
    # maksimum-hiz-min/max'ı zaten var, aynı anlamda iki farklı
    # alan (tekil vs min/max) çakışmasın diye.
    *[
        slug for slug in ELECTRIC_CORE_ATTRIBUTE_SLUGS
        if slug != "elektrikli-maksimum-hiz"
    ],
]
