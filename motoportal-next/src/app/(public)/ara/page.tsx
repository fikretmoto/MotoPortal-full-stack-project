import type { Metadata } from "next";
import Link from "next/link";
import { getProductsBySearch } from "@/services/catalog";
import ProductCard from "@/components/product/ProductCard";
import Pagination, {
  PRODUCT_GRID_ANCHOR_ID,
  PRODUCTS_PAGE_SIZE,
} from "@/components/product/Pagination";

const POPULAR_CATEGORIES = [
  { slug: "tasitlar", name: "Taşıtlar" },
  { slug: "ekipman", name: "Ekipman" },
  { slug: "yedek-parca", name: "Yedek Parça" },
  { slug: "aksesuar", name: "Aksesuar" },
  { slug: "bakim-ve-temizlik", name: "Bakım ve Temizlik" },
];

type SearchParams = {
  q?: string;
  page?: string;
};

type Props = {
  searchParams: Promise<SearchParams>;
};

function parsePage(raw: string | undefined): number {
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 1;
}

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const { q } = await searchParams;
  const trimmed = q?.trim();

  return {
    title: trimmed ? `"${trimmed}" için arama sonuçları` : "Arama",
    // Arama sonucu sayfaları indexlenmesin (her sorgu kendi URL'i --
    // sonsuz, duplike/tekil-degeri-dusuk sayfa uretir) ama linkler
    // takip edilsin (urun sayfalarina giden linkler onemli).
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function SearchPage({ searchParams }: Props) {
  const { q, page: rawPage } = await searchParams;
  const trimmed = q?.trim() ?? "";
  const page = parsePage(rawPage);

  function buildHref(targetPage: number): string {
    const query = new URLSearchParams();
    query.set("q", trimmed);
    if (targetPage > 1) query.set("page", String(targetPage));
    return `/ara?${query.toString()}`;
  }

  return (
    <div className="mx-auto max-w-6xl px-1.5 py-10 lg:px-6">
      {!trimmed ? (
        <p className="py-10 text-center text-sm text-fg-muted">
          Aramak istediğiniz ürünü yazın.
        </p>
      ) : (
        <SearchResults trimmed={trimmed} page={page} buildHref={buildHref} />
      )}
    </div>
  );
}

async function SearchResults({
  trimmed,
  page,
  buildHref,
}: {
  trimmed: string;
  page: number;
  buildHref: (page: number) => string;
}) {
  const { results: products, count } = await getProductsBySearch(
    trimmed,
    page
  );
  const totalPages = Math.max(1, Math.ceil(count / PRODUCTS_PAGE_SIZE));

  return (
    <>
      <h1 className="mb-6 text-2xl font-bold">
        “{trimmed}” için {count} sonuç
      </h1>

      {products.length === 0 ? (
        <div className="py-10 text-center">
          <p className="text-sm text-fg-muted">
            Aramanıza uygun ürün bulunamadı.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            {POPULAR_CATEGORIES.map((category) => (
              <Link
                key={category.slug}
                href={`/kategori/${category.slug}`}
                className="rounded-full border border-line px-4 py-1.5 text-sm text-foreground transition hover:border-primary hover:text-primary"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div
            id={PRODUCT_GRID_ANCHOR_ID}
            className="grid grid-cols-2 gap-1.5 lg:grid-cols-3"
          >
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            buildHref={buildHref}
          />
        </>
      )}
    </>
  );
}
