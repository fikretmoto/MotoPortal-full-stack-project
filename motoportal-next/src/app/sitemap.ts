import type { MetadataRoute } from "next";
import {
  getCategories,
  getBrands,
  type Category,
  type Product,
} from "@/services/catalog";
import {
  campaignTags,
  gearTags,
  bakimTags,
  aksesuarTags,
} from "@/constant/homepageBlocks";

export const revalidate = 3600;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://motoportal.com.tr";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

type PaginatedResponse<T> = {
  next: string | null;
  results: T[];
};

// products/ endpoint'i sayfalı (12'şer, DRF PageNumberPagination) ve
// page_size override parametresi yok -- tüm aktif ürünleri almak için
// `next` linkini sonuna kadar takip ediyoruz. ProductListAPIView zaten
// is_active=True filtreliyor, ekstra bir filtre gerekmiyor.
//
// Tam Product nesnelerini (sadece slug değil) döndürüyoruz çünkü
// kategori/marka listelerini de BUNDAN türetiyoruz (ek API isteği
// yapmamak için) -- her ürünün nested category/brand alanı zaten var.
async function getAllActiveProducts(): Promise<Product[]> {
  const products: Product[] = [];
  let url: string | null = `${API_URL}/products/`;

  while (url) {
    const response = await fetch(url, { next: { revalidate: 3600 } });

    if (!response.ok) {
      break;
    }

    const data: PaginatedResponse<Product> = await response.json();
    products.push(...data.results);
    url = data.next;
  }

  return products;
}

// Bir kategori "ürünü var" sayılır eğer kendisinde VEYA herhangi bir
// alt kategorisinde (recursive) en az 1 aktif ürün varsa. `categories`
// düz liste + `parent` id'si üzerinden üst zinciri yürüyerek, her
// ürünün bağlı olduğu yaprak kategoriden köke kadar tüm ataları
// işaretliyoruz.
function getCategorySlugsWithProducts(
  categories: Category[],
  products: Product[]
): Set<string> {
  const categoryById = new Map(categories.map((c) => [c.id, c]));
  const withProducts = new Set<string>();

  for (const product of products) {
    let current: Category | undefined = categoryById.get(
      product.category.id
    );

    while (current) {
      if (withProducts.has(current.slug)) {
        break;
      }
      withProducts.add(current.slug);
      current = current.parent
        ? categoryById.get(current.parent)
        : undefined;
    }
  }

  return withProducts;
}

// (public)/(tag)/[slug]/page.tsx'teki ALL_TAGS ile aynı birleştirme/
// tekilleştirme mantığı -- o dosyayı değiştirmeden burada tekrarlanıyor
// (sadece scope'suz taban href'ler kanonik tag sayfası sayılıyor).
function getCanonicalTagSlugs(): string[] {
  const merged = [...campaignTags, ...gearTags, ...bakimTags, ...aksesuarTags];
  const seen = new Set<string>();

  for (const tag of merged) {
    const baseHref = tag.href.split("?")[0];
    seen.add(baseHref.replace(/^\//, ""));
  }

  return Array.from(seen);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, brands, products] = await Promise.all([
    getCategories(),
    getBrands(),
    getAllActiveProducts(),
  ]);

  const tagSlugs = getCanonicalTagSlugs();

  // Kategori/marka listeleri ek bir API isteği yapmadan, zaten çekilen
  // ürün listesinden türetiliyor -- sadece kendisinde ya da (kategori
  // için) herhangi bir alt kategorisinde en az 1 aktif ürün olanlar.
  const categorySlugsWithProducts = getCategorySlugsWithProducts(
    categories,
    products
  );
  const brandSlugsWithProducts = new Set(
    products.map((p) => p.brand.slug)
  );

  const entries: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      changeFrequency: "daily",
      priority: 1,
    },
    ...categories
      .filter((c) => c.is_active && categorySlugsWithProducts.has(c.slug))
      .map((c) => ({
        url: `${SITE_URL}/kategori/${c.slug}`,
        changeFrequency: "daily" as const,
        priority: 0.7,
      })),
    ...brands
      .filter((b) => b.is_active && brandSlugsWithProducts.has(b.slug))
      .map((b) => ({
        url: `${SITE_URL}/marka/${b.slug}`,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      })),
    ...tagSlugs.map((slug) => ({
      url: `${SITE_URL}/${slug}`,
      changeFrequency: "daily" as const,
      priority: 0.5,
    })),
    ...products.map((p) => ({
      url: `${SITE_URL}/products/${p.slug}`,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
  ];

  return entries;
}
