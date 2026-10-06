import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import {
  getBrands,
  getBrandBySlug,
  getProductsByBrand,
  type Brand,
} from "@/services/catalog";
import { buildBrandTitle, buildBrandDescription } from "@/lib/seo";
import BrandProductsSection from "@/components/product/BrandProductsSection";
import { BRAND_LOGOS } from "@/constant/brandLogos";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const brands = await getBrands();
  return brands.map((brand) => ({ slug: brand.slug }));
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;

  let brand: Brand;
  try {
    // getBrandBySlug cache()'li -- tek markayı doğrudan çekiyor,
    // generateMetadata içinde getBrands()+.find() tekrarına gerek
    // kalmıyor.
    brand = await getBrandBySlug(slug);
  } catch {
    return {
      title: "Marka bulunamadı",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = buildBrandTitle(brand);
  const description = buildBrandDescription(brand);
  const canonical = `/marka/${slug}`;

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
      ...(brand.logo_url
        ? { images: [{ url: brand.logo_url, alt: title }] }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(brand.logo_url ? { images: [brand.logo_url] } : {}),
    },
  };
}

export default async function BrandPage({ params }: Props) {
  const { slug } = await params;
  const brands = await getBrands();
  const brand = brands.find((b) => b.slug === slug);

  if (!brand) {
    notFound();
  }

  const products = await getProductsByBrand(slug);

  const subtitleParts: string[] = [];
  if (brand.founded_year) {
    subtitleParts.push(`${brand.founded_year} yılından beri`);
  }
  if (brand.country) {
    subtitleParts.push(brand.country);
  }

  return (
    <>
      <div className="relative h-40 w-full bg-elevated sm:h-48">
        {BRAND_LOGOS[slug] && (
          <div className="absolute left-1/2 top-full -mt-12 -translate-x-1/2">
            <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-inverted bg-inverted shadow-lg">
              <Image
                src={BRAND_LOGOS[slug]}
                alt={brand.name}
                fill
                className="object-contain"
                sizes="96px"
              />
            </div>
          </div>
        )}
      </div>

      <div className="mt-16 flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">{brand.name}</h1>

        {subtitleParts.length > 0 && (
          <p className="text-sm text-fg-muted">
            {subtitleParts.join(" · ")}
          </p>
        )}

        <p className="text-sm text-fg-muted">{products.length} ürün</p>
      </div>

      <div className="mt-8">
        <BrandProductsSection brandSlug={slug} products={products} />
      </div>
    </>
  );
}
