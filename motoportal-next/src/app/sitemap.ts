import type { MetadataRoute } from "next";
import { getCategories, getBrands, type Product } from "@/services/catalog";
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
async function getAllActiveProductSlugs(): Promise<string[]> {
  const slugs: string[] = [];
  let url: string | null = `${API_URL}/products/`;

  while (url) {
    const response = await fetch(url, { next: { revalidate: 3600 } });

    if (!response.ok) {
      break;
    }

    const data: PaginatedResponse<Product> = await response.json();
    slugs.push(...data.results.map((p) => p.slug));
    url = data.next;
  }

  return slugs;
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
  const [categories, brands, productSlugs] = await Promise.all([
    getCategories(),
    getBrands(),
    getAllActiveProductSlugs(),
  ]);

  const tagSlugs = getCanonicalTagSlugs();

  const entries: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      changeFrequency: "daily",
      priority: 1,
    },
    ...categories
      .filter((c) => c.is_active)
      .map((c) => ({
        url: `${SITE_URL}/kategori/${c.slug}`,
        changeFrequency: "daily" as const,
        priority: 0.7,
      })),
    ...brands
      .filter((b) => b.is_active)
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
    ...productSlugs.map((slug) => ({
      url: `${SITE_URL}/products/${slug}`,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
  ];

  return entries;
}
