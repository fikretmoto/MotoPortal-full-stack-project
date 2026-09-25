from .ecommerce import (
    COMMON_ATTRIBUTE_SLUGS,
    SEARCH_ATTRIBUTE_SLUGS,
)


ACCESSORIES_CATEGORY_SLUGS = [
    # Bisiklet Aksesuarları artık üst kategori (16 yaprak alt
    # kategoriye ayrıldı) — kendisi değil, yaprakları şemaya dahil.
    "bisiklet-kilitleri",
    "bisiklet-cantalari",
    "bisiklet-sepetleri",
    "bisiklet-aydinlatma",
    "bisiklet-telefon-tutuculari",
    "bisiklet-bilgisayarlari",
    "bisiklet-camurluklari",
    "bisiklet-matara",
    "bisiklet-ayakliklari",
    "bisiklet-pompa-sisirme",
    "bisiklet-tamir-bakim",
    "bisiklet-bagaj-tasima",
    "bisiklet-zil-korna",
    "bisiklet-guvenlik-gorunurluk",
    "bisiklet-konfor",
    "bisiklet-arac-tasima",
    "motosiklet-aksesuarlari",
    "elektrikli-aksesuarlari",
    "atv-utv-aksesuarlari",
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
    "uyumluluk-tipi",
    "montaj-tipi",
]