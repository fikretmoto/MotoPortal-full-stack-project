from __future__ import annotations

import re
import unicodedata


def normalize_match_value(value: str) -> str:
    """
    Kullanici dostu, serbest metin girislerini karsilastirma icin
    normalize eder: buyuk/kucuk harf, Turkce aksan (ı/ş/ğ/ü/ö/ç) ve
    bosluk/noktalama farklarindan bagimsiz hale getirir.

    Ornek: "Hava Soğutmalı" -> "havasogutmali"

    import_products.py (CSV import, attribute option eslestirme) ve
    dashboard urun aramasi ayni mantigi kullanir -- buradan tasinmistir,
    davranis degismemelidir.
    """
    normalized = unicodedata.normalize("NFKD", value.strip().casefold())
    ascii_text = "".join(
        character
        for character in normalized
        if not unicodedata.combining(character)
    )
    ascii_text = (
        ascii_text
        .replace("ı", "i")
        .replace("ş", "s")
        .replace("ğ", "g")
        .replace("ü", "u")
        .replace("ö", "o")
        .replace("ç", "c")
    )
    return re.sub(r"[^a-z0-9]+", "", ascii_text)
