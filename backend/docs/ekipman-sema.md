# Ekipman Kategorisi — Şema Tasarımı (Onaylı, 8 Ekim 2026)

Bu dosya Ekipman kategorisinin yeni özellik (attribute) şemasının onaylanmış tasarımıdır.
Kask (helmet.py) BU TURA DAHİL DEĞİL — dokunulmayacak.
Ekipman kategorilerinde şu an hiç ürün yok, bu yüzden eski şemayı tamamen kaldırmak risksizdir.

---

## 1. Kategori ağacı (hedef)

```
Ekipman (ekipman)
├─ Motosiklet Montu (motosiklet-montu)
├─ Motosiklet Pantolonu (motosiklet-pantolonu)
├─ Motosiklet Eldiveni (motosiklet-eldiveni)
├─ Bot (motosiklet-botu)
├─ Yağmurluk (yagmurluk)
├─ Tulum (tulum)                              ← YENİ yaprak
├─ Termal İçlik (termal-iclik)                ← YENİ yaprak
├─ Bone & Boyunluk (bone-boyunluk)            ← YENİ üst kategori
│   ├─ Kask İçi Bone (kask-ici-bone)          ← YENİ yaprak
│   └─ Boyunluk / Bandana (boyunluk-bandana)  ← YENİ yaprak
├─ Koruma Ekipmanı (koruma-ekipmani)          ← üst kategori, ürün almaz
│   ├─ Boyun Koruyucu (boyun-koruyucu)
│   ├─ Dirseklik (dirseklik)
│   ├─ Dizlik (dizlik)
│   ├─ Göğüs Koruyucu (gogus-koruyucu)
│   ├─ Sırt Koruyucu (sirt-koruyucu)
│   ├─ Yedek Zırh (yedek-zirh)
│   └─ Zırhlı Gömlek / Yelek (zirhli-gomlek-yelek)
└─ Kask (kask) — DOKUNULMAYACAK
```

Not: "Boyun Koruyucu" (sert neck brace, Koruma altında) ile "Boyunluk / Bandana" (kumaş, Bone & Boyunluk altında) farklı ürünlerdir.

---

## 2. Dosya planı (mevcut düz klasör düzeni korunur)

Her biri, ilgili klasörlerde (`attributes/`, `attribute_groups/`, `attribute_options/`, `category_attributes/`) karşılığına sahip olacak:

| Dosya adı (tip) | Bağlandığı yaprak kategoriler |
|---|---|
| apparel_common | Kategorisi yok — ortak havuz (sadece attribute + option tanımları) |
| apparel_jacket | motosiklet-montu |
| apparel_pants | motosiklet-pantolonu |
| apparel_gloves | motosiklet-eldiveni |
| apparel_boots | motosiklet-botu |
| apparel_rain | yagmurluk |
| apparel_suit | tulum |
| apparel_base_layer | termal-iclik |
| headwear | kask-ici-bone, boyunluk-bandana |
| protection | 7 koruma yaprağı |

- Eski `apparel.py` (tüm klasörlerdeki karşılıklarıyla) tamamen kaldırılır.
- Hiçbir `*_CATEGORY_SLUGS` listesinde üst kategori (ekipman, koruma-ekipmani, bone-boyunluk) YER ALMAZ — sadece yaprak slug'lar.
- Mevcut ortak `ecommerce` bloğu (Model Yılı, Renk, Menşei vb.) bu kategorilere eskisi gibi bağlı kalır, değiştirilmez.
- Havuz (apparel_common) bir depodur: bir alanın havuzda olması her kategoriye otomatik gelmesi demek değildir. Her kategori aşağıdaki listelerde yazan slug'ları seçer.

---

## 3. apparel_common — ortak havuz

| Alan | Slug | data_type | Seçenekler |
|---|---|---|---|
| Cinsiyet | cinsiyet | single_select | Erkek / Kadın / Unisex / Çocuk |
| Sürüş Tarzı | surus-tarzi | single_select | Şehir / Touring-Adventure / Sport-Racing / Klasik-Cafe / Off-Road-Enduro |
| Sezon | sezon | single_select | Yaz / 3 Mevsim / 4 Mevsim / Kış |
| Ana Malzeme | ana-malzeme | single_select | Deri / Tekstil / File (Mesh) / Denim / Karma |
| Kalıp | kalip | single_select | Dar (Slim) / Standart / Geniş (Relaxed) |
| Su Geçirmez Membran | su-gecirmez-membran | single_select | Yok / Dahili / Çıkarılabilir |
| Membran Teknolojisi | membran-teknolojisi | text | (ör. GORE-TEX, Drystar) |
| Termal Astar | termal-astar | single_select | Yok / Dahili / Çıkarılabilir |
| Reflektör | reflektor | boolean | — |
| EN 17092 Sınıfı | en-17092-sinifi | single_select | AAA / AA / A / B / C / Sertifikasız |
| Dış Kumaş Detayı | dis-kumas-detayi | text | (ör. Cordura 500D) |
| Bağlantı Fermuarı | baglanti-fermuari | single_select | Yok / Kısa / Uzun (Tam Çevre) |
| Omuz-Dirsek Koruma | omuz-dirsek-koruma | single_select | Yok / Seviye 1 / Seviye 2 |
| Sırt Koruma | sirt-koruma | single_select | Yok / Cebi Var (Ayrı Satılır) / Dahil – Seviye 1 / Dahil – Seviye 2 |
| Göğüs Koruma | gogus-koruma | single_select | Yok / Cebi Var (Ayrı Satılır) / Dahil – Seviye 1 / Dahil – Seviye 2 |
| Airbag | airbag | single_select | Yok / Uyumlu / Entegre |
| Diz Koruma | diz-koruma | single_select | Yok / Seviye 1 / Seviye 2 |
| Diz Slider | diz-slider | boolean | — |
| İşlev | islev | single_select | Isıtıcı (Kış) / Serinletici (Yaz) |

"Ortak 9" = cinsiyet, surus-tarzi, sezon, ana-malzeme, kalip, su-gecirmez-membran, membran-teknolojisi, termal-astar, reflektor.

Not: surus-tarzi bilinçli olarak single_select (multi_select altyapısı şu an sadece Paket İçeriği için çalışıyor; ileride yükseltilecek).

---

## 4. Kategori bazlı şemalar

### Mont — apparel_jacket (motosiklet-montu)
Havuzdan: ortak 9 + en-17092-sinifi, dis-kumas-detayi, baglanti-fermuari, omuz-dirsek-koruma, sirt-koruma, gogus-koruma, airbag

| Alan | Slug | data_type | Seçenekler |
|---|---|---|---|
| Ürün Tipi | mont-tipi | single_select | Mont / Yelek / Korumalı Hoodie / Sürüş Gömleği |
| Havalandırma Fermuarları | havalandirma-fermuarlari | boolean | — |
| Ayarlanabilir Bel/Kol | ayarlanabilir-bel-kol | boolean | — |
| Su Geçirmez İç Cep | su-gecirmez-ic-cep | boolean | — |

Highlight: mont-tipi, ana-malzeme, sezon, en-17092-sinifi, sirt-koruma, su-gecirmez-membran

### Pantolon — apparel_pants (motosiklet-pantolonu)
Havuzdan: ortak 9 + en-17092-sinifi, dis-kumas-detayi, baglanti-fermuari, diz-koruma, diz-slider

| Alan | Slug | data_type | Seçenekler |
|---|---|---|---|
| Pantolon Tipi | pantolon-tipi | single_select | Pantolon / Motosiklet Kotu / Üst Pantolon (Overpant) |
| Kalça Koruma | kalca-koruma | single_select | Yok / Cebi Var (Ayrı Satılır) / Dahil – Seviye 1 / Dahil – Seviye 2 |
| Paça Boyu | paca-boyu | single_select | Kısa / Normal / Uzun |

Highlight: pantolon-tipi, ana-malzeme, sezon, en-17092-sinifi, diz-koruma, su-gecirmez-membran

### Eldiven — apparel_gloves (motosiklet-eldiveni)
Havuzdan: cinsiyet, surus-tarzi, sezon, ana-malzeme, su-gecirmez-membran, membran-teknolojisi, termal-astar, reflektor (kalip YOK)

| Alan | Slug | data_type | Seçenekler |
|---|---|---|---|
| Bilek Tipi | bilek-tipi | single_select | Kısa Bilek / Uzun Bilek (Gauntlet) / Parmaksız |
| EN 13594 Seviyesi | en-13594-seviyesi | single_select | Seviye 1 / Seviye 2 / Sertifikasız |
| Parmak Eklem Koruması | eklem-korumasi | boolean | — |
| Avuç İçi Malzemesi | avuc-ici-malzemesi | single_select | Keçi Derisi / Kanguru Derisi / İnek Derisi / Sentetik / Karma |
| Avuç İçi Slider | avuc-ici-slider | boolean | — |
| Dokunmatik Uyumlu | dokunmatik-uyumlu | boolean | — |
| Isıtmalı | isitmali | boolean | — |

Highlight: bilek-tipi, ana-malzeme, sezon, en-13594-seviyesi, dokunmatik-uyumlu, su-gecirmez-membran

### Bot — apparel_boots (motosiklet-botu)
Havuzdan: cinsiyet, surus-tarzi, sezon, ana-malzeme, su-gecirmez-membran, membran-teknolojisi, reflektor

| Alan | Slug | data_type | Seçenekler |
|---|---|---|---|
| Konç Yüksekliği | konc-yuksekligi | single_select | Ayakkabı / Kısa Bot / Orta Konç / Uzun Konç |
| EN 13634 Sertifikası | en-13634 | boolean | — |
| Kapanma Tipi | kapanma-tipi | single_select | Bağcık / Fermuar / BOA / Toka / Karma |
| Taban Tipi | taban-tipi | single_select | Yol / Off-Road (Kramponlu) / Pist-Yarış |
| Vites Pedi | vites-pedi | boolean | — |
| Ayak Bileği Koruması | ayak-bilegi-korumasi | boolean | — |

Highlight: konc-yuksekligi, ana-malzeme, su-gecirmez-membran, kapanma-tipi, en-13634, sezon

### Yağmurluk — apparel_rain (yagmurluk)
Havuzdan: cinsiyet, kalip, reflektor

| Alan | Slug | data_type | Seçenekler |
|---|---|---|---|
| Yağmurluk Tipi | yagmurluk-tipi | single_select | Üst / Alt / Takım (Tek Parça) / Takım (İki Parça) |
| Paketlenebilir | paketlenebilir | boolean | — |
| Dikişler Bantlı | dikis-bantli | boolean | — |
| Isıya Dayanıklı Bacak Paneli | isi-korumali-panel | boolean | — |

Highlight: yagmurluk-tipi, paketlenebilir, reflektor, dikis-bantli

### Tulum — apparel_suit (tulum)
Havuzdan: ortak 9 + en-17092-sinifi, omuz-dirsek-koruma, sirt-koruma, diz-koruma, diz-slider, airbag

| Alan | Slug | data_type | Seçenekler |
|---|---|---|---|
| Tulum Tipi | tulum-tipi | single_select | Tek Parça / İki Parça (Fermuarla Birleşen) |
| Aerodinamik Kambur | aerodinamik-kambur | boolean | — |
| Streç Paneller | strec-paneller | boolean | — |

Highlight: tulum-tipi, ana-malzeme, en-17092-sinifi, sirt-koruma, airbag, aerodinamik-kambur

### Termal İçlik — apparel_base_layer (termal-iclik)
Havuzdan: cinsiyet, kalip, islev

| Alan | Slug | data_type | Seçenekler |
|---|---|---|---|
| İçlik Tipi | iclik-tipi | single_select | Üst / Alt / Takım |
| İçlik Malzemesi | iclik-malzemesi | single_select | Merino Yün / Sentetik / Pamuk Karışımlı |
| Dikişsiz | dikissiz | boolean | — |
| Antibakteriyel | antibakteriyel | boolean | — |

Highlight: iclik-tipi, iclik-malzemesi, islev

### Bone & Boyunluk — headwear (kask-ici-bone, boyunluk-bandana)
Havuzdan: islev

| Alan | Slug | data_type | Seçenekler |
|---|---|---|---|
| Malzeme | baslik-malzemesi | single_select | Polyester / Merino / Polar / Karışım |
| Rüzgar Geçirmez | ruzgar-gecirmez | boolean | — |

Highlight: baslik-malzemesi, islev, ruzgar-gecirmez

### Koruma Ekipmanı — protection (7 yaprak)
Havuzdan: yok. İSTİSNA: zirhli-gomlek-yelek ayrıca havuzdan cinsiyet ve kalip alır (ayrı bir slug listesiyle).

| Alan | Slug | data_type | Seçenekler |
|---|---|---|---|
| Koruma Standardı | koruma-standardi | single_select | EN 1621-1 (Uzuv) / EN 1621-2 (Sırt) / EN 1621-3 (Göğüs) / Sertifikasız |
| Koruma Seviyesi | koruma-seviyesi | single_select | Seviye 1 / Seviye 2 / Yok |
| Koruyucu Malzemesi | koruyucu-malzemesi | single_select | Viskoelastik (D3O vb.) / Köpük / Sert Kabuk / Hibrit |
| Kullanım Şekli | kullanim-sekli | single_select | Tek Başına (Kayışlı) / Cep İçi (Giysiye Takılır) / Giysiye Entegre |
| Havalandırmalı | havalandirmali | boolean | — |

Highlight: koruma-standardi, koruma-seviyesi, koruyucu-malzemesi, kullanim-sekli

Bilinçli karar: "Koruma Bölgesi" alanı YOK — bölge bilgisi zaten yaprak kategorinin kendisinde (dizlik, dirseklik…). Aynı bilgi iki yerde tutulmaz (ATV "Çekiş Tipi" kararıyla aynı mantık).

---

## 5. Attribute grupları (form akordeon başlıkları)

Kural:
- Genel Bilgiler: cinsiyet, surus-tarzi, kalip ve her kategorinin "...-tipi" alanı (mont-tipi, pantolon-tipi, bilek-tipi, konc-yuksekligi, yagmurluk-tipi, tulum-tipi, iclik-tipi)
- Malzeme ve Yapı: ana-malzeme, dis-kumas-detayi, avuc-ici-malzemesi, iclik-malzemesi, baslik-malzemesi, koruyucu-malzemesi, taban-tipi, kapanma-tipi
- Hava Koşulları: sezon, su-gecirmez-membran, membran-teknolojisi, termal-astar, islev, dikis-bantli, ruzgar-gecirmez
- Koruma ve Güvenlik: tüm koruma/sertifika alanları + reflektor, airbag, diz-slider, avuc-ici-slider, eklem-korumasi, vites-pedi, ayak-bilegi-korumasi, isi-korumali-panel
- Kullanım ve Konfor: kalan tüm boolean'lar (havalandırma, cep, dokunmatik, ısıtmalı, paketlenebilir, dikişsiz vb.)

---

## 6. Kapsam dışı (bu turda yapılmayacak)
- Kask şeması (helmet.py)
- Beden standardı / dealer panelinde varyant girişi / import_products beden kolonu
- multi_select genelleştirmesi
