import Link from "next/link";

import {
  getProducts,
  type Product,
} from "@/services/catalog";

type FeaturedProductCardProps = {
  product: Product;
};

function FeaturedProductCard({
  product,
}: FeaturedProductCardProps) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group rounded-3xl border border-neutral-200 bg-white transition hover:border-neutral-300"
    >
      <article className="flex h-full flex-col overflow-hidden rounded-3xl">
        <div className="relative aspect-[4/3] border-b border-neutral-200 bg-neutral-100">
          {product.cover_image_url ? (
            <img
              src={product.cover_image_url}
              alt={product.name}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-neutral-400">
              Gorsel yakinda
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col p-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-600">
              {product.brand.name}
            </span>

            <span className="text-sm text-neutral-500">
              {product.category.name}
            </span>
          </div>

          <h3 className="mt-5 text-2xl font-semibold tracking-tight text-neutral-950">
            {product.name}
          </h3>

          <p className="mt-3 line-clamp-3 text-sm leading-6 text-neutral-600">
            {product.short_description || "Model detaylari yakinda eklenecek."}
          </p>

          <span className="mt-6 text-sm font-medium text-neutral-950">
            Incele
          </span>
        </div>
      </article>
    </Link>
  );
}

export default async function FeaturedProducts() {
  const products = await getProducts();

  const activeProducts = products.filter(
    (product) => product.is_active,
  );

  const featuredProducts = activeProducts.filter(
    (product) => product.is_featured,
  );

  const displayedProducts = (
    featuredProducts.length > 0
      ? featuredProducts
      : activeProducts
  ).slice(0, 8);

  if (displayedProducts.length === 0) {
    return null;
  }

  return (
    <section
      id="yeni-modeller"
      className="border-b border-neutral-200 bg-neutral-50"
    >
      <div className="mx-auto max-w-6xl px-6 py-14 md:py-16">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
            Secili Modeller
          </span>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
            One Cikan Modeller
          </h2>

          <p className="mt-4 text-base leading-7 text-neutral-600">
            Mevcut urun verilerinden secilen modelleri hizlica incele ve
            detay sayfalarina gec.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {displayedProducts.map((product) => (
            <FeaturedProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
