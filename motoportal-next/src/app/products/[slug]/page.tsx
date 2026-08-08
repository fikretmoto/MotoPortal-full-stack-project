import Link from "next/link";
import ProductHero from "@/components/product/ProductHero";

import ProductDescription from "@/components/product/ProductDescription";
import ProductHighlights from "@/components/product/ProductHighlights";
import ProductTechnicalTabs from "@/components/product/ProductTechnicalTabs";
import ProductGallery from "@/components/product/ProductGallery";

import {
  getProductBySlug,
  type ProductDetail,
} from "@/services/catalog";

type ProductDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { slug } = await params;



  let product: ProductDetail;


  try {
    product = await getProductBySlug(slug);
  } catch {


    

    return (
      <main className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-2xl font-bold">
          Ürün bilgisi alınamadı.
        </h1>
      </main>
    );
  }

console.log(product.attributes);
  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <Link
        href="/"
        className="text-sm text-gray-600 transition hover:text-gray-900"
      >
        ← Ürünlere dön
      </Link>

      <ProductHero product={product} />
      



<ProductDescription
  description={product.description}
/>
<ProductHighlights
  attributes={product.attributes}
/>

<ProductTechnicalTabs
  attributes={product.attributes}
/>

<ProductGallery
  images={product.images}
  productName={product.name}
/>

    </main>
  );
}