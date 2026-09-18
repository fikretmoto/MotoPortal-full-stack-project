import Link from "next/link";
import { cookies } from "next/headers";
import ProductHero from "@/components/product/ProductHero";

import ProductCommercialTabs from "@/components/product/ProductCommercialTabs";

import ProductTechnicalTabs from "@/components/product/ProductTechnicalTabs";
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
  getProductReviews,
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

  const reviews = await getProductReviews(slug);

  const cookieStore = await cookies();
  const isAuthenticated = Boolean(cookieStore.get("access_token")?.value);


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

     <ProductHero product={product} reviews={reviews} />
      



<ProductCommercialTabs
  product={product}
  reviews={reviews}
  isAuthenticated={isAuthenticated}
/>


<ProductTechnicalTabs
  attributes={product.attributes}
/>

<ProductHighlightCarousel attributes={product.attributes} />

    </main>
  );
}