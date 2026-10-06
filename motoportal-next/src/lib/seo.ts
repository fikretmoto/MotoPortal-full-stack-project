// Sayfa metadata'ları (ürün, ve Faz 3'te kategori/marka/etiket) için
// saf (side-effect'siz) yardımcı fonksiyonlar. Veri çekme mantığı
// burada değil, services/ katmanında kalır.

const TITLE_MAX_LENGTH = 50;
const DESCRIPTION_MAX_LENGTH = 155;

export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Metni `max` karakteri aşmayacak şekilde, kelime ortasından kesmeden
 * kısaltır. Elips ("…") eklemez -- çağıran, kesme olup olmadığını
 * `result.length < text.length` ile anlayıp kendi uygun gördüğü
 * yerde ekleyebilir.
 */
export function truncateAtWord(text: string, max: number): string {
  const trimmed = text.trim();

  if (trimmed.length <= max) {
    return trimmed;
  }

  const slice = trimmed.slice(0, max);
  const lastSpace = slice.lastIndexOf(" ");

  return (lastSpace > 0 ? slice.slice(0, lastSpace) : slice).trim();
}

function formatTRY(price: string, currency: string): string {
  const formatted = new Intl.NumberFormat("tr-TR").format(Number(price));
  return currency === "TRY" ? `${formatted} ₺` : `${formatted} ${currency}`;
}

type TitleInput = {
  display_name?: string | null;
  name: string;
  brand: { name: string };
};

export function buildProductTitle(product: TitleInput): string {
  const base = product.display_name || product.name;
  const brandName = product.brand.name;

  const withBrand = base.toLowerCase().includes(brandName.toLowerCase())
    ? base
    : `${base} – ${brandName}`;

  return truncateAtWord(withBrand, TITLE_MAX_LENGTH);
}

/**
 * Metni cümle sınırlarında (., !, ?) biriktirerek `max` karakteri
 * aşmayan en uzun ön eki döner. İlk cümle bile `max`'tan uzunsa,
 * kelime sınırında kesilip "…" eklenir.
 */
function takeLeadingSentences(text: string, max: number): string {
  const sentences = text.split(/(?<=[.!?])\s+/).filter(Boolean);

  let result = "";
  for (const sentence of sentences) {
    const candidate = result ? `${result} ${sentence}` : sentence;
    if (candidate.length > max) {
      break;
    }
    result = candidate;
  }

  if (result) {
    return result;
  }

  // İlk cümle bile sınırdan uzun -- kelime sınırında kes.
  return `${truncateAtWord(text, max - 1)}…`;
}

type DescriptionInput = {
  short_description?: string | null;
  description?: string | null;
  category: { name: string };
  price: string | null;
  discount_price?: string | null;
  currency: string;
};

export function buildProductDescription(
  title: string,
  product: DescriptionInput
): string {
  const shortDescription = product.short_description
    ? stripHtml(product.short_description)
    : "";

  if (shortDescription) {
    return shortDescription.length > DESCRIPTION_MAX_LENGTH
      ? `${truncateAtWord(shortDescription, DESCRIPTION_MAX_LENGTH - 1)}…`
      : shortDescription;
  }

  const fullDescription = product.description
    ? stripHtml(product.description)
    : "";

  if (fullDescription) {
    return takeLeadingSentences(fullDescription, DESCRIPTION_MAX_LENGTH);
  }

  const hasDiscount =
    !!product.discount_price &&
    !!product.price &&
    Number(product.discount_price) < Number(product.price);

  const effectivePrice = hasDiscount ? product.discount_price : product.price;

  const priceSentence = effectivePrice
    ? ` ${formatTRY(effectivePrice, product.currency)} fiyatla incele.`
    : "";

  const template = `${title}, ${product.category.name} kategorisinde MotoPortal'da.${priceSentence}`;

  return template.length > DESCRIPTION_MAX_LENGTH
    ? `${truncateAtWord(template, DESCRIPTION_MAX_LENGTH - 1)}…`
    : template;
}

// --- Kategori ---

type CategoryTitleInput = {
  name: string;
  is_vehicle: boolean;
};

export function buildCategoryTitle(category: CategoryTitleInput): string {
  const phrase = category.is_vehicle
    ? `${category.name} Modelleri ve Fiyatları`
    : `${category.name} Fiyatları ve Modelleri`;

  return truncateAtWord(phrase, TITLE_MAX_LENGTH);
}

type CategoryDescriptionInput = {
  name: string;
  parent_name: string | null;
};

export function buildCategoryDescription(
  category: CategoryDescriptionInput
): string {
  const subject = category.parent_name
    ? `${category.name} · ${category.parent_name}`
    : category.name;

  const template = `${subject} modellerini, özelliklerini ve fiyatlarını MotoPortal'da karşılaştır.`;

  return template.length > DESCRIPTION_MAX_LENGTH
    ? `${truncateAtWord(template, DESCRIPTION_MAX_LENGTH - 1)}…`
    : template;
}

// --- Marka ---

type BrandTitleInput = {
  name: string;
};

export function buildBrandTitle(brand: BrandTitleInput): string {
  return truncateAtWord(`${brand.name} Modelleri ve Fiyatları`, TITLE_MAX_LENGTH);
}

type BrandDescriptionInput = {
  name: string;
  description?: string | null;
};

export function buildBrandDescription(brand: BrandDescriptionInput): string {
  const stripped = brand.description ? stripHtml(brand.description) : "";

  if (stripped) {
    return stripped.length > DESCRIPTION_MAX_LENGTH
      ? `${truncateAtWord(stripped, DESCRIPTION_MAX_LENGTH - 1)}…`
      : stripped;
  }

  return `${brand.name} modellerini ve fiyatlarını MotoPortal'da incele.`;
}

// --- Etiket ---

export function buildTagDescription(label: string): string {
  const template = `${label}: MotoPortal'da en uygun fiyatlarla keşfet, karşılaştır ve hemen incele.`;

  return template.length > DESCRIPTION_MAX_LENGTH
    ? `${truncateAtWord(template, DESCRIPTION_MAX_LENGTH - 1)}…`
    : template;
}
