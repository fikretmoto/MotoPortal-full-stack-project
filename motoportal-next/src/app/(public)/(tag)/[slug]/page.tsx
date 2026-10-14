import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductsByTag,  getProductsByTagAndCategories, getProductsOnDiscount } from "@/services/catalog";
import { buildTagDescription } from "@/lib/seo";
import ProductCard from "@/components/product/ProductCard";
import Pagination, {
  PRODUCT_GRID_ANCHOR_ID,
  PRODUCTS_PAGE_SIZE,
} from "@/components/product/Pagination";
import { campaignTags, gearTags, bakimTags, aksesuarTags } from "@/constant/homepageBlocks";
import type { TagPill } from "@/components/Home/TagCategoryBlock/TagCategoryBlock";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ scope?: string; page?: string }>;
};

function parsePage(raw: string | undefined): number {
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 1;
}

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
  searchParams,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const { page: rawPage } = await searchParams;
  const tag = ALL_TAGS.find((t) => t.href === `/${slug}`);

  if (!tag) {
    return {
      title: "Sayfa bulunamadı",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = tag.label;
  const description = buildTagDescription(tag.label);
  const page = parsePage(rawPage);
  // ?scope= her zaman dışlanıyor -- kanonik her zaman taban (scope'suz) path.
  // Sadece sayfa numarası (page>1) kendi canonical'ını taşır.
  const canonical = page > 1 ? `/${slug}?page=${page}` : `/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function TagPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { scope, page: rawPage } = await searchParams;
  const tag = ALL_TAGS.find((t) => t.href === `/${slug}`);

  if (!tag) {
    notFound();
  }

  const page = parsePage(rawPage);
  const scopeCategories = scope ? SCOPE_CATEGORIES[scope] : undefined;

  const { results: products, count } = scopeCategories
    ? await getProductsByTagAndCategories(slug, scopeCategories, page)
    : slug === "indirimli-urunler"
    ? await getProductsOnDiscount(page)
    : await getProductsByTag(slug, page);

  const totalPages = Math.max(1, Math.ceil(count / PRODUCTS_PAGE_SIZE));

  function buildHref(targetPage: number): string {
    const query = new URLSearchParams();
    if (scope) query.set("scope", scope);
    if (targetPage > 1) query.set("page", String(targetPage));

    const queryString = query.toString();
    return `/${slug}${queryString ? `?${queryString}` : ""}`;
  }

  return (
    <>
      <nav className="mb-4 text-sm text-fg-muted">
        <Link href="/" className="hover:text-primary">
          Anasayfa
        </Link>{" "}
        / <span className="text-foreground">{tag.label}</span>
      </nav>

      <h1 className="mb-6 text-2xl font-bold">{tag.label}</h1>

      <div
        id={PRODUCT_GRID_ANCHOR_ID}
        className="grid grid-cols-2 gap-1.5 lg:grid-cols-3"
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {products.length === 0 && (
        <p className="py-10 text-center text-sm text-fg-muted">
          Bu kriterlere uyan ürün bulunamadı.
        </p>
      )}

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        buildHref={buildHref}
      />
    </>
  );
}