import type { CategoryCard, TagPill } from "@/components/Home/TagCategoryBlock/TagCategoryBlock";

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
];

export const motorcycleCategories: CategoryCard[] = [
  { name: "Motosiklet", href: "/kategori/motosiklet" },
  { name: "Scooter", href: "/kategori/scooter" },
  { name: "ATV / UTV", href: "/kategori/atv-utv" },
  { name: "Bisiklet", href: "/kategori/bisiklet" },
  { name: "Elektrikli", href: "/kategori/elektrikli" },
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

export const gearCategories: CategoryCard[] = [
  { name: "Kask", href: "/kategori/kask" },
  { name: "Mont", href: "/kategori/motosiklet-montu" },
  { name: "Pantolon", href: "/kategori/motosiklet-pantolonu" },
  { name: "Eldiven", href: "/kategori/motosiklet-eldiveni" },
  { name: "Bot", href: "/kategori/motosiklet-botu" },
  { name: "Yağmurluk", href: "/kategori/yagmurluk" },
  { name: "Koruma Ekipmanı", href: "/kategori/koruma-ekipmani" },
  { name: "Çanta", href: "/kategori/canta-ve-bagaj-sistemleri" },
  { name: "Kilit & Zincir", href: "/kategori/kilit-ve-guvenlik" },
];
