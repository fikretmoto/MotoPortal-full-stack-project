# Eski attribute_groups/apparel.py'nin yerine geçti. "koruma" grubu
# (eski apparel.py'ye özeldi, tek kullanıcısıydı) buraya taşınmadı --
# temizlik script'i onu DB'den tamamen kaldırıyor.
# "mevsim-ve-hava-kosullari" slug'ı BİLEREK aynı kaldı (sadece adı
# "Hava Koşulları" oldu) -- DB'deki mevcut satırla sorunsuz eşleşsin.
APPAREL_COMMON_ATTRIBUTE_GROUP_DATA = [
    {
        "name": "Hava Koşulları",
        "slug": "mevsim-ve-hava-kosullari",
        "display_order": 410,
    },
    {
        "name": "Koruma ve Güvenlik",
        "slug": "koruma-ve-guvenlik",
        "display_order": 420,
    },
    {
        "name": "Kullanım ve Konfor",
        "slug": "kullanim-ve-konfor",
        "display_order": 430,
    },
]
