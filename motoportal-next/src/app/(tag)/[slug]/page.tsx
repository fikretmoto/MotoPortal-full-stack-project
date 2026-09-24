import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductsByTag,  getProductsByTagAndCategories, getProductsOnDiscount } from "@/services/catalog";
import ProductCard from "@/components/product/ProductCard";
import { campaignTags, gearTags, bakimTags, aksesuarTags } from "@/constant/homepageBlocks";
import type { TagPill } from "@/components/Home/TagCategoryBlock/TagCategoryBlock";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ scope?: string }>;
};

/**
 * Bantların pill href'leri "?scope=..." soneki taşıyabiliyor
 * (ör. gearTags/bakimTags); bu sayfanın slug eşleştirmesi sadece
 * path'e bakar, query'e bakmaz — bu yüzden lookup için önce sorgu
 * dizesi ayıklanıyor. Aynı base slug birden fazla bantta geçiyorsa
 * (çoğu tag öyle) ilk geçen (campaignTags önce) kazanır, böylece
 * başlık/etiket metni her zaman "kanonik" (scope'suz) banttan gelir.
 */
function toBaseHref(href: string): string {
  return href.split("?")[0];
}

const ALL_TAGS: TagPill[] = (() => {
  const merged = [...campaignTags, ...gearTags, ...bakimTags, ...aksesuarTags];
  const seen = new Map<string, TagPill>();

  for (const tag of merged) {
    const baseHref = toBaseHref(tag.href);
    if (!seen.has(baseHref)) {
      seen.set(baseHref, { label: tag.label, href: baseHref });
    }
  }

  return Array.from(seen.values());
})();

const SCOPE_CATEGORIES: Record<string, string[]> = {
  ekipman: ["ekipman"],
  bakim: ["bakim-ve-temizlik"],
  aksesuar: ["aksesuar"],
};

export async function generateStaticParams() {
  return ALL_TAGS.map((tag) => ({
    slug: tag.href.replace("/", ""),
  }));
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const tag = ALL_TAGS.find((t) => t.href === `/${slug}`);

  return {
    title: tag ? tag.label : undefined,
  };
}

export default async function TagPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { scope } = await searchParams;
  const tag = ALL_TAGS.find((t) => t.href === `/${slug}`);

  if (!tag) {
    notFound();
  }

  const scopeCategories = scope ? SCOPE_CATEGORIES[scope] : undefined;

  const products = scopeCategories
    ? await getProductsByTagAndCategories(slug, scopeCategories)
    : slug === "indirimli-urunler"
    ? await getProductsOnDiscount()
    : await getProductsByTag(slug);
  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <nav className="mb-4 text-sm text-fg-muted">
        <span>Anasayfa</span> / <span className="text-foreground">{tag.label}</span>
      </nav>

      <h1 className="mb-6 text-2xl font-bold">{tag.label}</h1>

      <div className="flex flex-wrap gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}