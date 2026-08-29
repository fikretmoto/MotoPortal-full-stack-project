import Link from "next/link";
import ProductHero from "@/components/product/ProductHero";

import ProductDescription from "@/components/product/ProductDescription";

import ProductTechnicalTabs from "@/components/product/ProductTechnicalTabs";
import ProductReviews from "@/components/product/ProductReviews";
import { ProductHighlightCarousel } from "@/components/product/ProductHighlightCarousel";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";



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


  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
    <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Anasayfa</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <span className="text-muted-foreground">
              {product.category.name}
            </span>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{product.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <ProductHero product={product} />
      



<ProductDescription
  description={product.description}
/>


<ProductTechnicalTabs
  attributes={product.attributes}
/>

<ProductHighlightCarousel />

<ProductReviews
  slug={product.slug}
/>


    </main>
  );
}