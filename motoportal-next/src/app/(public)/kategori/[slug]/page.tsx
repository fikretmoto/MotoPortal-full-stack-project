import type { Metadata } from "next";
import {
  getCategories,
  getCategoryBySlug,
  getProductsByCategory,
} from "@/services/catalog";
import { buildCategoryTitle, buildCategoryDescription } from "@/lib/seo";
import ProductCard from "@/components/product/ProductCard";
import Pagination, {
  PRODUCT_GRID_ANCHOR_ID,
  PRODUCTS_PAGE_SIZE,
} from "@/components/product/Pagination";
import BisikletAksesuarlariHub from "@/components/category/BisikletAksesuarlariHub";
import TemizlikUrunleriHub from "@/components/category/TemizlikUrunleriHub";

const HUB_PAGES: Record<string, () => React.ReactNode> = {
  "bisiklet-aksesuarlari": () => <BisikletAksesuarlariHub />,
  "temizlik-urunleri": () => <TemizlikUrunleriHub />,
};

type SearchParams = {
  view?: string;
  brand?: string;
  price_min?: string;
  price_max?: string;
  facets?: string;
  page?: string;
};

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParams>;
};

function parsePage(raw: string | undefined): number {
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 1;
}

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const { page: rawPage } = await searchParams;
  // getCategoryBySlug, cache()'li getCategories()'i kullanıyor --
  // sayfa gövdesindeki ayrı getCategories()+.find() çağrısıyla aynı
  // fetch'i paylaşır, ?view= gibi query parametrelerine bakılmaz.
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return {
      title: "Kategori bulunamadı",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = buildCategoryTitle(category);
  const description = buildCategoryDescription(category);
  const page = parsePage(rawPage);
  // Filtre kombinasyonları (brand/price/facets) canonical'a hiç
  // taşınmıyor -- bilerek, aksi halde filtre permütasyonları kadar
  // "farklı" URL indexlenebilir hale gelir. Sadece sayfa numarası
  // kendi canonical'ını taşır.
  const canonical =
    page > 1 ? `/kategori/${slug}?page=${page}` : `/kategori/${slug}`;

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

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const {
    view,
    brand,
    price_min: priceMin,
    price_max: priceMax,
    facets,
    page: rawPage,
  } = await searchParams;

  if (view !== "all" && HUB_PAGES[slug]) {
    return HUB_PAGES[slug]();
  }

  const page = parsePage(rawPage);

  const categories = await getCategories();
  const category = categories.find((c) => c.slug === slug);
  const { results: products, count } = await getProductsByCategory(slug, {
    brand,
    price_min: priceMin,
    price_max: priceMax,
    facets,
    page,
  });

  const totalPages = Math.max(1, Math.ceil(count / PRODUCTS_PAGE_SIZE));

  function buildHref(targetPage: number): string {
    const query = new URLSearchParams();
    if (view) query.set("view", view);
    if (brand) query.set("brand", brand);
    if (priceMin) query.set("price_min", priceMin);
    if (priceMax) query.set("price_max", priceMax);
    if (facets) query.set("facets", facets);
    if (targetPage > 1) query.set("page", String(targetPage));

    const queryString = query.toString();
    return `/kategori/${slug}${queryString ? `?${queryString}` : ""}`;
  }

  return (
    <>
      <h1 className="mb-6 text-2xl font-bold">{category?.name}</h1>

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
