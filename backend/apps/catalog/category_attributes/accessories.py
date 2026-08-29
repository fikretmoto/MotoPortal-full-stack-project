from .ecommerce import (
    COMMON_ATTRIBUTE_SLUGS,
    SEARCH_ATTRIBUTE_SLUGS,
)


ACCESSORIES_CATEGORY_SLUGS = [
    "canta-ve-bagaj-sistemleri",
    "on-cam-ruzgarlik",
    "kilit-ve-guvenlik",
    "intercom-bluetooth-iletisim",
    "sele-kilifi-ve-ortu",
    "kamera-ve-navigasyon",
]


ACCESSORIES_ATTRIBUTE_SLUGS = [
    *COMMON_ATTRIBUTE_SLUGS,
    *SEARCH_ATTRIBUTE_SLUGS,

    "aksesuar-tipi",
    "aksesuar-kapasitesi",
    "aksesuar-malzemesi",
    "aksesuar-su-gecirmezlik",
    "bluetooth-baglantisi",
    "aksesuar-menzil",
    "aksesuar-pil-omru",
    "video-cozunurlugu",
]