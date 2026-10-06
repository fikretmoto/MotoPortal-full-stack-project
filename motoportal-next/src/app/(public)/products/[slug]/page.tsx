import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import ProductHero from "@/components/product/ProductHero";

import ProductCommercialTabs from "@/components/product/ProductCommercialTabs";

import ProductTechnicalTabs from "@/components/product/ProductTechnicalTabs";
import { ProductHighlightCarousel } from "@/components/product/ProductHighlightCarousel";
import ProductReviewsSection from "@/components/product/ProductReviewsSection";

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
import { buildProductTitle, buildProductDescription } from "@/lib/seo";

type ProductDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;

  let product: ProductDetail;
  try {
    // getProductBySlug React cache() ile sarmalı (services/catalog.ts)
    // -- aşağıdaki sayfa gövdesi aynı slug için tekrar çağırdığında
    // gerçek fetch tekrarlanmıyor.
    product = await getProductBySlug(slug);
  } catch {
    return {
      title: "Ürün bulunamadı",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = buildProductTitle(product);
  const description = buildProductDescription(title, product);
  const canonical = `/products/${slug}`;

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
      ...(product.cover_image_url
        ? { images: [{ url: product.cover_image_url, alt: title }] }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(product.cover_image_url
        ? { images: [product.cover_image_url] }
        : {}),
    },
  };
}

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
            <BreadcrumbPage>{product.display_name || product.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

     <ProductHero product={product} reviews={reviews} />
      



<ProductCommercialTabs product={product} />


<ProductTechnicalTabs
  attributes={product.attributes}
/>

<ProductHighlightCarousel attributes={product.attributes} />

<ProductReviewsSection
  slug={product.slug}
  productId={product.id}
  reviews={reviews}
  isAuthenticated={isAuthenticated}
/>

    </main>
  );
}