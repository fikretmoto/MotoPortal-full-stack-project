import type { Metadata } from "next";
import {
  getCategories,
  getCategoryBySlug,
  getProductsByCategory,
} from "@/services/catalog";
import { buildCategoryTitle, buildCategoryDescription } from "@/lib/seo";
import ProductCard from "@/components/product/ProductCard";
import BisikletAksesuarlariHub from "@/components/category/BisikletAksesuarlariHub";
import TemizlikUrunleriHub from "@/components/category/TemizlikUrunleriHub";

const HUB_PAGES: Record<string, () => React.ReactNode> = {
  "bisiklet-aksesuarlari": () => <BisikletAksesuarlariHub />,
  "temizlik-urunleri": () => <TemizlikUrunleriHub />,
};

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ view?: string }>;
};

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;
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
  const canonical = `/kategori/${slug}`;

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
  const { view } = await searchParams;

  if (view !== "all" && HUB_PAGES[slug]) {
    return HUB_PAGES[slug]();
  }

  const categories = await getCategories();
  const category = categories.find((c) => c.slug === slug);
  const products = await getProductsByCategory(slug);

  return (
    <>
      <h1 className="mb-6 text-2xl font-bold">{category?.name}</h1>

      <div className="grid grid-cols-2 gap-1.5 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  );
}