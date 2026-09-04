import type { CategoryCard, TagPill } from "@/components/Home/TagCategoryBlock/TagCategoryBlock";

/* ---- BLOK A: kampanya tag'leri + motosiklet kategorileri ---- */

export const campaignTags: TagPill[] = [
  { label: "İndirimli Ürünler", href: "/kampanya/indirimli-urunler" },
  { label: "Yeni Gelenler", href: "/kampanya/yeni-gelenler" },
  { label: "Bitmek Üzere Olanlar", href: "/kampanya/bitmek-uzere" },
  { label: "Outlet / Fırsat", href: "/kampanya/outlet-firsat" },
  { label: "Takas Fırsatı", href: "/kampanya/takas-firsati" },
  { label: "Öne Çıkanlar", href: "/kampanya/one-cikanlar" },
  { label: "B Ehliyeti ile Sürülebilenler", href: "/kampanya/b-ehliyeti-surulebilir" },
  { label: "A1 ile Sürülebilenler", href: "/kampanya/a1-surulebilir" },
  { label: "Yakında Gelecek Olanlar", href: "/kampanya/yakinda-gelecek" },
  { label: "2. El", href: "/kampanya/2-el" },
  { label: "Sıfır Faizli Taksit", href: "/kampanya/sifir-faizli-taksit" },
  { label: "Ücretsiz Kargo", href: "/kampanya/ucretsiz-kargo" },
  { label: "Şehir Merkezi Ücretsiz Kargo", href: "/kampanya/sehir-merkezi-ucretsiz-kargo" },
   { label: "Çok Satan", href: "/kampanya/cok-satan" },
];

export const motorcycleCategories: CategoryCard[] = [
  { name: "Motosikletler", href: "/kategori/motosikletler" },
  { name: "Scooter", href: "/kategori/scooter" },
  { name: "Cross / Enduro", href: "/kategori/cross-enduro" },
  { name: "Elektrikli", href: "/kategori/elektrikli" },
  { name: "ATV", href: "/kategori/atv" },
  { name: "Bisikletler", href: "/kategori/bisikletler" },
  { name: "Cruiser", href: "/kategori/cruiser" },
  { name: "Touring", href: "/kategori/touring" },
  { name: "Naked", href: "/kategori/naked" },
];

/* ---- BLOK B: rehber tag'leri + ekipman/parça kategorileri ---- */

export const guideTags: TagPill[] = [
  { label: "Güvenlik 101", href: "/rehber/guvenlik-101" },
  { label: "Kask Rehberi", href: "/rehber/kask" },
  { label: "Airbag Rehberi", href: "/rehber/airbag" },
  { label: "Yeni Sürücü Rehberi", href: "/rehber/yeni-surucu" },
  { label: "Nasıl Yapılır", href: "/rehber/nasil-yapilir" },
  { label: "2026'nın En İyileri", href: "/rehber/2026-en-iyiler" },
];

export const gearCategories: CategoryCard[] = [
  { name: "Kasklar", href: "/kategori/kasklar" },
  { name: "Mont & Ceket", href: "/kategori/mont" },
  { name: "Eldiven", href: "/kategori/eldiven" },
  { name: "Bot", href: "/kategori/bot" },
  { name: "Koruma", href: "/kategori/koruma" },
  { name: "Yedek Parça", href: "/kategori/yedek-parca" },
  { name: "Lastik", href: "/kategori/lastik" },
  { name: "Aksesuar", href: "/kategori/aksesuar" },
  { name: "Bakım", href: "/kategori/bakim" },
];
