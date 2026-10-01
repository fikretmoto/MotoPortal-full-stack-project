from rest_framework.throttling import AnonRateThrottle

# NOT: ScopedRateThrottle değil AnonRateThrottle'dan türetiyoruz.
# ScopedRateThrottle.allow_request() scope'u view'ın kendi
# `throttle_scope` attribute'undan okuyor (alt sınıftaki `scope`
# class attribute'unu YOK sayıyor) -- bu yüzden bir view'a birden
# fazla farklı-scope'lu ScopedRateThrottle eklemek (verify-email'de
# tek, resend-verification'da iki farklı limit gibi) çalışmıyor,
# hepsi aynı (view'daki) tek scope'u paylaşıyor. AnonRateThrottle
# ise `scope`'u doğrudan sınıfın kendi class attribute'undan okuyor
# (get_rate/get_cache_key ikisi de), bu yüzden burada istenen
# "aynı view'da birden fazla bağımsız limit" deseni için doğru olan
# budur. Tüm bu endpoint'ler zaten AllowAny/girişsiz olduğu için
# semantik olarak da "anonim kullanıcı" limiti doğru sınıf.


class VerifyEmailThrottle(AnonRateThrottle):
    """5 istek / 15 dakika.

    DRF'nin DEFAULT_THROTTLE_RATES formatı (örn. "5/min", "100/day")
    sadece tek birimlik periyotları destekliyor -- 15 dakikalık bir
    pencere ifade edebilmek için parse_rate burada override edildi
    (settings.py'de bu scope için "5/15m" gibi bir rate string'i
    tanımlanıyor).
    """

    scope = "verify-email"

    def parse_rate(self, rate):
        if rate is None:
            return (None, None)

        num, period = rate.split("/")
        num_requests = int(num)

        digits = "".join(ch for ch in period if ch.isdigit())
        multiplier = int(digits) if digits else 1
        unit = period[len(digits):]

        unit_seconds = {
            "s": 1, "sec": 1,
            "m": 60, "min": 60,
            "h": 3600, "hour": 3600,
            "d": 86400, "day": 86400,
        }[unit[0]]

        return (num_requests, unit_seconds * multiplier)


class ResendVerificationMinuteThrottle(AnonRateThrottle):
    scope = "resend-verification-minute"


class ResendVerificationHourThrottle(AnonRateThrottle):
    scope = "resend-verification-hour"
