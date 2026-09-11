import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductsByTag,  getProductsByTagAndCategories, getProductsOnDiscount } from "@/services/catalog";
import ProductCard from "@/components/product/ProductCard";
import { campaignTags } from "@/constant/homepageBlocks";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ scope?: string }>;
};

export async function generateStaticParams() {
  return campaignTags.map((tag) => ({
    slug: tag.href.replace("/", ""),
  }));
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const tag = campaignTags.find((t) => t.href === `/${slug}`);

  return {
    title: tag ? tag.label : undefined,
  };
}

export default async function TagPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { scope } = await searchParams;
  const tag = campaignTags.find((t) => t.href === `/${slug}`);

  if (!tag) {
    notFound();
  }

  const EKIPMAN_SCOPE_CATEGORIES = [
    "ekipman",
    "canta-ve-bagaj-sistemleri",
    "kilit-ve-guvenlik",
  ];

  const products =
    scope === "ekipman"
      ? await getProductsByTagAndCategories(slug, EKIPMAN_SCOPE_CATEGORIES)
      : slug === "indirimli-urunler"
      ? await getProductsOnDiscount()
      : await getProductsByTag(slug);
  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <nav className="mb-4 text-sm text-gray-500">
        <span>Anasayfa</span> / <span className="text-gray-900">{tag.label}</span>
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