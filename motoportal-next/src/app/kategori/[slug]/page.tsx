import type { Metadata } from "next";
import { getCategories, getProductsByCategory } from "@/services/catalog";
import ProductCard from "@/components/product/ProductCard";
import BisikletAksesuarlariHub from "@/components/category/BisikletAksesuarlariHub";

const BISIKLET_AKSESUAR_HUB_SLUG = "bisiklet-aksesuarlari";

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
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === slug);

  return { title: category ? category.name : undefined };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { view } = await searchParams;

  if (slug === BISIKLET_AKSESUAR_HUB_SLUG && view !== "all") {
    return <BisikletAksesuarlariHub />;
  }

  const categories = await getCategories();
  const category = categories.find((c) => c.slug === slug);
  const products = await getProductsByCategory(slug);

  return (
    <>
      <h1 className="mb-6 text-2xl font-bold">{category?.name}</h1>

      <div className="flex flex-wrap gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  );
}