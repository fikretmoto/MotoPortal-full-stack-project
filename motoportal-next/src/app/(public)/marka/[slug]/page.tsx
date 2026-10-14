import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import {
  getBrands,
  getBrandBySlug,
  getProductsByBrand,
  getProductsByBrandPage,
  type Brand,
} from "@/services/catalog";
import { buildBrandTitle, buildBrandDescription } from "@/lib/seo";
import BrandProductsSection from "@/components/product/BrandProductsSection";
import { BRAND_LOGOS } from "@/constant/brandLogos";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

function parsePage(raw: string | undefined): number {
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 1;
}

export async function generateStaticParams() {
  const brands = await getBrands();
  return brands.map((brand) => ({ slug: brand.slug }));
}

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const { page: rawPage } = await searchParams;
  const page = parsePage(rawPage);

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
  const canonical =
    page > 1 ? `/marka/${slug}?page=${page}` : `/marka/${slug}`;

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

export default async function BrandPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page: rawPage } = await searchParams;
  const page = parsePage(rawPage);

  const brands = await getBrands();
  const brand = brands.find((b) => b.slug === slug);

  if (!brand) {
    notFound();
  }

  // Marka sayfasının kategori filtresi markanın TÜM ürünlerinden
  // gelmeli (Mondial scooter'ları dahil) -- bu yüzden tüm sayfaları
  // gezen getProductsByBrand burada ayrıca, sadece bu listeyi (ve
  // üstteki "X ürün" toplamını) türetmek için çağrılıyor. Izgaranın
  // kendisi ayrı, URL'deki ?page'e uyan getProductsByBrandPage'den
  // besleniyor -- aksi halde ilk render'da tüm ürünler görünüp client
  // tarafında sayfa 1'e "zıplardı".
  const allProducts = await getProductsByBrand(slug);
  const { results: initialProducts, count: initialCount } =
    await getProductsByBrandPage(slug, { page });

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

        <p className="text-sm text-fg-muted">{allProducts.length} ürün</p>
      </div>

        <div className="mx-auto mt-8 max-w-6xl px-1.5 lg:px-6">
        <BrandProductsSection
          brandSlug={slug}
          allProducts={allProducts}
          initialProducts={initialProducts}
          initialCount={initialCount}
          initialPage={page}
        />
      </div>
    </>
  );
}
