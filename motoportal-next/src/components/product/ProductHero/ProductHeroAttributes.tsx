import type { ProductDetail } from "@/services/catalog";

import ProductPrice from "./ProductPrice";
import ProductStock from "./ProductStock";
import ProductVariantSelector from "./ProductVariantSelector";
import ProductRatingSummary from "./ProductRatingSummary";
type ProductHeroAttributesProps = {
  product: ProductDetail;
};

export default function ProductHeroAttributes({
  product,
}: ProductHeroAttributesProps) {
  return (
    <div className="flex flex-col justify-center">
      <div className="flex flex-wrap items-center gap-3">
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

      <div className="mt-3">
        <ProductRatingSummary slug={product.slug} />
      </div>

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
     <div className="mt-6 flex flex-wrap gap-3">
        {product.instagram_url && (
          
           <a href={product.instagram_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Instagram&apos;da İncele
          </a>
        )}

        {product.whatsapp_number && (
          
            <a href={`https://wa.me/${product.whatsapp_number}?text=${encodeURIComponent(
              `Merhaba, ${product.name} hakkında bilgi almak istiyorum.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-green-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-green-700"
          >
            WhatsApp&apos;tan Yaz
          </a>
        )}
      </div>
    
      

      </div >

    
  );
}