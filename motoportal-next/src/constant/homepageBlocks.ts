export type TagPill = {
  label: string;
  href: string;
};

// Kategori kartları artık href değil slug tutuyor. Gerçek yol, kartı
// render eden bileşende kategori listesiyle (getCategoryHref) hesaplanıyor.
export type CategorySlugCard = {
  name: string;
  slug: string;
  image?: string;
};

/* ---- BLOK A: kampanya tag'leri + motosiklet kategorileri ---- */

export const campaignTags: TagPill[] = [
  { label: "İndirimli Ürünler", href: "/indirimli-urunler" },
  { label: "Yeni Gelenler", href: "/yeni-gelenler" },
  { label: "Bitmek Üzere Olanlar", href: "/bitmek-uzere" },
  { label: "Outlet / Fırsat", href: "/outlet-firsat" },
  { label: "Takas Fırsatı", href: "/takas-firsati" },
  { label: "Öne Çıkanlar", href: "/one-cikanlar" },
  { label: "B Ehliyeti ile Sürülebilenler", href: "/b-ehliyeti-surulebilir" },
  { label: "A1 ile Sürülebilenler", href: "/a1-surulebilir" },
  { label: "Yakında Gelecek Olanlar", href: "/yakinda-gelecek" },
  { label: "2. El", href: "/2-el" },
  { label: "Sıfır Faizli Taksit", href: "/sifir-faizli-taksit" },
  { label: "Ücretsiz Kargo", href: "/ucretsiz-kargo" },
  { label: "Şehir Merkezi Ücretsiz Kargo", href: "/sehir-merkezi-ucretsiz-kargo" },
  { label: "Çok Satan", href: "/cok-satan" },
  { label: "Editörün Seçtikleri", href: "/editorun-sectikleri" },
];

export const motorcycleCategories: CategorySlugCard[] = [
  { name: "Motosiklet", slug: "motosiklet" },
  { name: "Scooter", slug: "scooter" },
  { name: "ATV / UTV", slug: "atv-utv" },
  { name: "Bisiklet", slug: "bisiklet" },
  { name: "Elektrikli", slug: "elektrikli" },
];

/* ---- BLOK B: ekipman tag'leri + ekipman kategorileri ---- */

export const gearTags: TagPill[] = [
  { label: "Çok Satan", href: "/cok-satan?scope=ekipman" },
  { label: "İndirimli Ürünler", href: "/indirimli-urunler?scope=ekipman" },
  { label: "Fırsat Ürünleri", href: "/outlet-firsat?scope=ekipman" },
  { label: "Bitmek Üzere Olanlar", href: "/bitmek-uzere?scope=ekipman" },
  { label: "Sezon Sonu", href: "/sezon-sonu?scope=ekipman" },
  { label: "Yeni Çıkanlar", href: "/yeni-gelenler?scope=ekipman" },
  { label: "Öne Çıkanlar", href: "/one-cikanlar?scope=ekipman" },
  { label: "Taksitli Ürünler", href: "/sifir-faizli-taksit?scope=ekipman" },
  { label: "Şehir İçi Ücretsiz Kargo", href: "/sehir-merkezi-ucretsiz-kargo?scope=ekipman" },
  { label: "Açık Kutu", href: "/acik-kutu?scope=ekipman" },
  { label: "2. El", href: "/2-el?scope=ekipman" },
];

export const gearCategories: CategorySlugCard[] = [
  { name: "Kask", slug: "kask" },
  { name: "Mont", slug: "motosiklet-montu" },
  { name: "Pantolon", slug: "motosiklet-pantolonu" },
  { name: "Eldiven", slug: "motosiklet-eldiveni" },
  { name: "Bot", slug: "motosiklet-botu" },
  { name: "Yağmurluk", slug: "yagmurluk" },
  { name: "Koruma Ekipmanı", slug: "koruma-ekipmani" },
];

/* ---- BLOK C: bakım/temizlik tag'leri + bakım/temizlik kategorileri ---- */

export const bakimTags: TagPill[] = [
  { label: "İndirimli Ürünler", href: "/indirimli-urunler?scope=bakim" },
  { label: "Yeni Gelenler", href: "/yeni-gelenler?scope=bakim" },
  { label: "Bitmek Üzere Olanlar", href: "/bitmek-uzere?scope=bakim" },
  { label: "Fırsat", href: "/outlet-firsat?scope=bakim" },
  { label: "Öne Çıkan", href: "/one-cikanlar?scope=bakim" },
  { label: "Editörün Seçtikleri", href: "/editorun-sectikleri?scope=bakim" },
  { label: "Sıfır Faizli Taksit", href: "/sifir-faizli-taksit?scope=bakim" },
  { label: "Ücretsiz Kargo", href: "/ucretsiz-kargo?scope=bakim" },
  { label: "Şehir Merkezi Ücretsiz Kargo", href: "/sehir-merkezi-ucretsiz-kargo?scope=bakim" },
  { label: "Çok Satan", href: "/cok-satan?scope=bakim" },
  { label: "Sezon Sonu", href: "/sezon-sonu?scope=bakim" },
  { label: "Açık Kutu", href: "/acik-kutu?scope=bakim" },
];

export const bakimCategories: CategorySlugCard[] = [
  { name: "Temizlik Ürünleri", slug: "temizlik-urunleri" },
  { name: "Motor Yağı", slug: "motor-yagi" },
  { name: "Zincir Yağı", slug: "zincir-yagi" },
  { name: "Şanzıman Yağı", slug: "sanziman-yagi" },
  { name: "2T Yağı", slug: "2t-yagi" },
  { name: "Fork Yağı", slug: "fork-yagi" },
  { name: "Fren Hidroliği", slug: "fren-hidroligi" },
  { name: "Soğutma Sıvısı", slug: "sogutma-sivisi" },
];

/* ---- BLOK D: aksesuar tag'leri + aksesuar kategorileri ---- */

export const aksesuarTags: TagPill[] = [
  { label: "İndirimli Ürünler", href: "/indirimli-urunler?scope=aksesuar" },
  { label: "Yeni Gelenler", href: "/yeni-gelenler?scope=aksesuar" },
  { label: "Bitmek Üzere Olanlar", href: "/bitmek-uzere?scope=aksesuar" },
  { label: "Fırsat", href: "/outlet-firsat?scope=aksesuar" },
  { label: "Öne Çıkan", href: "/one-cikanlar?scope=aksesuar" },
  { label: "Editörün Seçtikleri", href: "/editorun-sectikleri?scope=aksesuar" },
  { label: "Sıfır Faizli Taksit", href: "/sifir-faizli-taksit?scope=aksesuar" },
  { label: "Ücretsiz Kargo", href: "/ucretsiz-kargo?scope=aksesuar" },
  { label: "Şehir Merkezi Ücretsiz Kargo", href: "/sehir-merkezi-ucretsiz-kargo?scope=aksesuar" },
  { label: "Çok Satan", href: "/cok-satan?scope=aksesuar" },
  { label: "Sezon Sonu", href: "/sezon-sonu?scope=aksesuar" },
  { label: "Açık Kutu", href: "/acik-kutu?scope=aksesuar" },
];

export const aksesuarCategories: CategorySlugCard[] = [
  { name: "Bisiklet Aksesuarları", slug: "bisiklet-aksesuarlari" },
  { name: "Motosiklet Aksesuarları", slug: "motosiklet-aksesuarlari" },
  { name: "Elektrikli Aksesuarları", slug: "elektrikli-aksesuarlari" },
  { name: "ATV/UTV Aksesuarları", slug: "atv-utv-aksesuarlari" },
  { name: "Çanta ve Bagaj Sistemleri", slug: "canta-ve-bagaj-sistemleri" },
  { name: "Ön Cam / Rüzgarlık", slug: "on-cam-ruzgarlik" },
  { name: "Kilit ve Güvenlik", slug: "kilit-ve-guvenlik" },
  { name: "Intercom / Bluetooth İletişim", slug: "intercom-bluetooth-iletisim" },
  { name: "Sele Kılıfı ve Örtü", slug: "sele-kilifi-ve-ortu" },
  { name: "Kamera ve Navigasyon", slug: "kamera-ve-navigasyon" },
];