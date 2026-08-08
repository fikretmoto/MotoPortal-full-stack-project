import type { ProductDetail } from "@/services/catalog";

import ProductPrice from "./ProductPrice";
import ProductStock from "./ProductStock";
import ProductVariantSelector from "./ProductVariantSelector";

type ProductHeroProps = {
  product: ProductDetail;
};

export default function ProductHero({
  product,
}: ProductHeroProps) {
  return (
    <section className="mt-8 grid gap-10 lg:grid-cols-2">
      {/* Sol taraf */}
      <div>
        {product.cover_image_url ? (
          <img
            src={product.cover_image_url}
            alt={product.name}
            className="w-full rounded-2xl border border-gray-200 object-cover"
          />
        ) : (
          <div className="flex h-[500px] items-center justify-center rounded-2xl border border-gray-200 bg-gray-100 text-gray-500">
            Görsel Yok
          </div>
        )}
      </div>

      {/* Sağ taraf */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-600">
            {product.brand.name}
          </span>

          <span className="text-sm text-gray-500">
            {product.category.name}
          </span>
        </div>

        <h1 className="mt-5 text-4xl font-bold tracking-tight text-gray-900 lg:text-5xl">
          {product.name}
        </h1>

        {product.short_description && (
          <p className="mt-5 text-lg leading-8 text-gray-600">
            {product.short_description}
          </p>
        )}

        <ProductPrice
          price={product.price}
          currency={product.currency}
        />

        <ProductStock
          stockStatus={product.stock_status}
        />

        <ProductVariantSelector
          variants={product.variants}
        />
      </div>
    </section>
  );
}