export type NavItem = {
  label: string;
  href: string;
  isCurrent?: boolean;
  hasCaret?: boolean;
  isMegaTrigger?: boolean;
};

export type HeaderAction = {
  label: string;
  href: string;
  icon: "heart" | "scale" | "user";
  badge?: string;
};

export type MegaMenuLink = {
  label: string;
  href: string;
  badge?: string;
  slug?: string;
};

export type MegaMenuSection = {
  title: string;
  icon: "bike" | "scooter" | "zap" | "buggy" | "bicycle" | "settings";
  items: MegaMenuLink[];
};

export type FooterGroup = {
  title: string;
  links: NavItem[];
};

export type SocialLink = {
  label: string;
  href: string;
};

export type HomeCategoryItem = {
  label: string;
  href: string;
};

export const topBarContent = {
  brandSuffix: ".COM.TR",
  searchPlaceholder: "Marka, model veya kategori ara...",
  searchButtonLabel: "Ara",
};

export const headerActions: HeaderAction[] = [
  {
    label: "Favorilerim",
    href: "#",
    icon: "heart",
  },
  {
    label: "Karşılaştır",
    href: "#",
    icon: "scale",
    badge: "0",
  },
  {
    label: "Giriş Yap",
    href: "#",
    icon: "user",
  },
];

export const mainMenuItems: NavItem[] = [
  { label: "Ana Sayfa", href: "/" },
  {
    label: "Kategoriler",
    href: "#kategoriler",
    isCurrent: true,
    hasCaret: true,
    isMegaTrigger: true,
  },
  { label: "Blog", href: "#blog" },
];


export const megaMenuSections: MegaMenuSection[] = [
  {
    title: "Motosikletler",
    icon: "bike",
    items: [
      { label: "Naked", href: "#naked", slug: "naked" },
      { label: "Sport", href: "#sport", slug: "sport" },
      { label: "Adventure", href: "#adventure", slug: "adventure" },
      { label: "Touring", href: "#touring", slug: "touring" },
      { label: "Chopper", href: "#chopper", slug: "chopper" },
      { label: "Cross", href: "#cross", slug: "cross" },
      { label: "Enduro", href: "#enduro", slug: "enduro" },
      { label: "Cup", href: "#cup" },
    ],
  },
  {
    title: "Scooter",
    icon: "scooter",
    items: [
      { label: "50 cc Scooter", href: "#50cc-scooter", badge: "Popüler" },
      { label: "125 cc Scooter", href: "#125cc-scooter" },
      { label: "150 cc Scooter", href: "#150cc-scooter" },
      { label: "250 cc Scooter", href: "#250cc-scooter" },
      { label: "250 cc Üstü Scooter", href: "#250cc-ustu-scooter" },
    ],
  },
  {
    title: "Elektrikli",
    icon: "zap",
    items: [
      { label: "E-Scooter", href: "#e-scooter", slug: "e-scooter" },
      { label: "E-Car", href: "#e-car", slug: "e-car" },
      { label: "E-Pikap", href: "#e-pikap" },
      { label: "E-Market Tipi", href: "#e-market-tipi", slug: "e-market-tipi" },
      { label: "249 Watt E-Scooter", href: "#249w-e-scooter" },
      { label: "E-Servis Tipi", href: "#e-servis-tipi" },
    ],
  },
  {
    title: "ATV / UTV",
    icon: "buggy",
    items: [
      { label: "ATV", href: "#atv", slug: "atv" },
      { label: "UTV", href: "#utv", slug: "utv" },
    ],
  },
  {
    title: "Bisiklet",
    icon: "bicycle",
    items: [
      { label: "Bisiklet", href: "#bisiklet", slug: "bisiklet" },
      { label: "E-Bike", href: "#e-bike", badge: "Yeni" },
    ],
  },
  {
    title: "Diğer",
    icon: "settings",
    items: [
      { label: "Yedek Parça", href: "#yedek-parca", slug: "yedek-parca" },
      { label: "Aksesuar", href: "#aksesuar", slug: "aksesuar" },
      { label: "Bakım Ürünleri", href: "#bakim-urunleri", slug: "bakim-urunleri" },
      { label: "Kask & Ekipman", href: "#kask-ekipman" },
    ],
  },
];

export const megaMenuSupplementaryLinks: MegaMenuLink[] = [
  { label: "Takas", href: "#takas", badge: "Yeni" },
  { label: "2. El", href: "#ikinci-el", badge: "Yeni" },
];

export const featuredPromo = {
  eyebrow: "Yeni Modeller",
  title: "Seni Bekliyor!",
  description:
    "Yeni modelleri keşfet, karşılaştır, sana uygun modeli bul.",
  ctaLabel: "HEMEN KEŞFET",
  ctaHref: "#yeni-modeller",
};

export const popularBrandStripItems: NavItem[] = [
  { label: "Honda", href: "#honda" },
  { label: "Yamaha", href: "#yamaha" },
  { label: "Kuba", href: "#kuba" },
  { label: "Mondial", href: "#mondial" },
  { label: "RKS", href: "#rks" },
  { label: "Arora", href: "#arora" },
  { label: "SYM", href: "#sym" },
  { label: "Kymco", href: "#kymco" },
  { label: "Regal Raptor", href: "#regal-raptor" },
  { label: "Yuki", href: "#yuki" },
  { label: "Suzuki", href: "#suzuki" },
  { label: "Peugeot", href: "#peugeot" },
  { label: "Tüm Markalar", href: "#markalar" },
];

export const homeCategoryItems: HomeCategoryItem[] = [
  { label: "Motosiklet", href: "#motosiklet" },
  { label: "Scooter", href: "#scooter" },
  { label: "ATV", href: "#atv" },
  { label: "UTV", href: "#utv" },
  { label: "Bisiklet", href: "#bisiklet" },
  { label: "E-Bisiklet", href: "#e-bike" },
  { label: "Yedek Parça", href: "#yedek-parca" },
  { label: "Aksesuar", href: "#aksesuar" },
  { label: "Ekipman", href: "#ekipman" },
];

export const mobileMenuSections = [
  ...megaMenuSections,
  {
    title: "Özel",
    icon: "settings" as const,
    items: megaMenuSupplementaryLinks,
  },
];

export const footerContent = {
  description:
    "MotoPortal, motosiklet dünyasına dair tarafsız incelemeler, güncel haberler ve doğru takas bilgileri için burada.",
  newsletterTitle: "Bülten",
  newsletterDescription:
    "Kampanyalar, yeni modeller ve güncellemeler için bültene abone olun.",
  newsletterPlaceholder: "E-posta adresiniz",
};

export const footerGroups: FooterGroup[] = [
  {
    title: "Kurumsal",
    links: [
      { label: "Hakkımızda", href: "#" },
      { label: "İletişim", href: "#" },
      { label: "Kariyer", href: "#" },
      { label: "Gizlilik Politikası", href: "#" },
      { label: "Kullanım Şartları", href: "#" },
    ],
  },
  {
    title: "Yardım",
    links: [
      { label: "Sıkça Sorulan Sorular", href: "#" },
      { label: "Kargo & Teslimat", href: "#" },
      { label: "İade & Değişim", href: "#" },
      { label: "Ödeme Seçenekleri", href: "#" },
      { label: "Site Haritası", href: "#" },
    ],
  },
  {
    title: "Hızlı Erişim",
    links: [
      { label: "Markalar", href: "#markalar" },
      { label: "Kategoriler", href: "#kategoriler" },
      { label: "Yeni Modeller", href: "#yeni-modeller" },
      { label: "Takas", href: "#takas" },
      { label: "2. El", href: "#ikinci-el" },
    ],
  },
];

export const footerPaymentItems = [
  "VISA",
  "mastercard",
  "troy",
  "SSL Secure",
];

export const socialLinks: SocialLink[] = [
  { label: "Facebook", href: "#" },
  { label: "Instagram", href: "#" },
  { label: "YouTube", href: "#" },
  { label: "X", href: "#" },
  { label: "TikTok", href: "#" },
];

export const routeMismatchNotes = [
  "Next.js tarafında şu anda yalnızca '/' ve '/products/[slug]' route'ları kesin mevcut. '/brands' ve '/blog' menüde kullanılıyor ama app router altında henüz sayfa dosyaları görünmüyor.",
  "Backend kategori slug'larında 'cup', '50 cc scooter', '125 cc scooter', '150 cc scooter', '250 cc scooter', '250 cc üstü scooter', 'e-bike', 'e-pikap', '249 watt e-scooter', 'e-servis tipi', 'kask-ekipman', 'takas' ve '2. el' için birebir slug kaydı görünmüyor.",
  "Backend'de 'e-kasali' slug'ı var, ancak tasarım brief'inde istenen isim 'E-Pikap'. Bu görevde backend slug üretilmediği için frontend tarafında güvenli placeholder anchor link kullanıldı.",
  "Backend'de 'bakim-urunleri' mevcut, fakat tasarımdaki 'Kask & Ekipman' birleşik bir kategori değil; mevcut veride ayrı olarak 'kask' ve 'mont' alt kategorileri bulunuyor.",
];
