"use client";

import { useMemo, useState } from "react";
import type { ProductDetail, ProductReview } from "@/services/catalog";
import {
  getActiveVariants,
  getDefaultSelection,
  resolveVariant,
  type AxisSelection,
  type VariantAxisField,
} from "@/lib/productVariants";

import ProductPrice from "./ProductPrice";
import ProductStock from "./ProductStock";
import ProductVariantSelector from "./ProductVariantSelector";
import ProductRatingSummary from "./ProductRatingSummary";
import ProductHighlights from "../ProductHighlights";

type ProductHeroAttributesProps = {
  product: ProductDetail;
  reviews: ProductReview[];
};

export default function ProductHeroAttributes({
  product,
  reviews,
}: ProductHeroAttributesProps) {
  const activeVariants = useMemo(
    () => getActiveVariants(product.variants),
    [product.variants]
  );

  const [selection, setSelection] = useState<AxisSelection>(() =>
    getDefaultSelection(activeVariants)
  );

  const handleSelect = (axis: VariantAxisField, value: string) => {
    setSelection((previous) => ({ ...previous, [axis]: value }));
  };

  const selectedVariant = useMemo(
    () => resolveVariant(activeVariants, selection),
    [activeVariants, selection]
  );

  const displayPrice =
    selectedVariant?.price != null
      ? selectedVariant.effective_price
      : product.price;

  const displayDiscountPrice =
    selectedVariant?.price != null ? null : product.discount_price;

  return (
    <div className="flex flex-col justify-center">
      {/* SATIR 1: Ürün adı — tek başına */}
      <h1 className="mt-5 text-2xl font-bold tracking-tight text-foreground lg:text-3xl">
        {product.display_name || product.name}
      </h1>

      {/* SATIR 2: Puan + yorum sayısı + stok rozeti aynı satırda */}
      <div className="mt-3 flex flex-wrap items-center gap-4">
        <ProductRatingSummary reviews={reviews} />
        <ProductStock stockStatus={product.stock_status} />
      </div>

      {/* SATIR 3: Kısa açıklama */}
      {product.short_description && (
        <p className="mt-5 text-lg leading-8 text-fg-muted">
          {product.short_description}
        </p>
      )}

      {/* SATIR 4: Fiyat — kendi satırında */}
      <div className="mt-5">
        <ProductPrice
          price={displayPrice}
          discountPrice={displayDiscountPrice}
          currency={product.currency}
        />
      </div>

      {/* SATIR 5: Instagram / WhatsApp butonları */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        {product.whatsapp_number && (
          
            <a href={`https://wa.me/${product.whatsapp_number}?text=${encodeURIComponent(
              `Merhaba, ${product.display_name || product.name} hakkında bilgi almak istiyorum.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-600 px-6 py-3 text-base font-semibold text-white transition hover:bg-green-700"
          >
            WhatsApp&apos;tan Yaz
          </a>
        )}

        {product.instagram_url && (
          
           <a href={product.instagram_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-line px-6 py-3 text-base font-semibold text-foreground transition hover:bg-surface-hover"
          >
            Instagram&apos;da İncele
          </a>
        )}
      </div>

      {/* SATIR 6: Varyant seçimi (renk, cc vb.) */}
      <ProductVariantSelector
        variants={activeVariants}
        selection={selection}
        onSelect={handleSelect}
      />

      {/* SATIR 7: Ürün Detayları başlığı + öne çıkan özellik kartları */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold text-foreground">
          Ürün Detayları
        </h2>

        <div className="mt-4">
          <ProductHighlights attributes={product.attributes} compact />
        </div>
      </div>
    </div>
  );
}