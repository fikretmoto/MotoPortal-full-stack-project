"use client";

import { useState } from "react";
import type { ProductDetail } from "@/services/catalog";

import ProductPrice from "./ProductPrice";
import ProductStock from "./ProductStock";
import ProductVariantSelector from "./ProductVariantSelector";
import ProductRatingSummary from "./ProductRatingSummary";
import ProductHighlights from "../ProductHighlights";

type ProductHeroAttributesProps = {
  product: ProductDetail;
};

export default function ProductHeroAttributes({
  product,
}: ProductHeroAttributesProps) {
  const defaultVariant =
    product.variants.find((variant) => variant.is_default) ??
    product.variants[0] ??
    null;

  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(
    defaultVariant?.id ?? null
  );

  const selectedVariant =
    product.variants.find((variant) => variant.id === selectedVariantId) ??
    null;

  const displayPrice =
    selectedVariant?.price != null
      ? selectedVariant.effective_price
      : product.price;

  const displayDiscountPrice =
    selectedVariant?.price != null ? null : product.discount_price;

  return (
    <div className="flex flex-col justify-center">
      {/* SATIR 1: Ürün adı + fiyat aynı satırda, aynı eksende */}
      <div className="mt-5 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-2xl font-bold tracking-tight text-gray-900 lg:text-3xl">
            {product.name}
          </h1>
        </div>

        <div className="shrink-0">
          <ProductPrice
            price={displayPrice}
            discountPrice={displayDiscountPrice}
            currency={product.currency}
          />
        </div>
      </div>

      {/* SATIR 2: Puan + yorum sayısı + stok rozeti aynı satırda */}
      <div className="mt-3 flex flex-wrap items-center gap-4">
        <ProductRatingSummary slug={product.slug} />
        <ProductStock stockStatus={product.stock_status} />
      </div>

      {/* SATIR 3: Kısa açıklama */}
      {product.short_description && (
        <p className="mt-5 text-lg leading-8 text-gray-600">
          {product.short_description}
        </p>
      )}

      {/* SATIR 4: Instagram / WhatsApp butonları */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        {product.whatsapp_number && (
          
           <a href={`https://wa.me/${product.whatsapp_number}?text=${encodeURIComponent(
              `Merhaba, ${product.name} hakkında bilgi almak istiyorum.`
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
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 px-6 py-3 text-base font-semibold text-gray-900 transition hover:bg-gray-50"
          >
            Instagram&apos;da İncele
          </a>
        )}
      </div>

      {/* SATIR 5: Varyant seçimi (renk, cc vb.) */}
      <ProductVariantSelector
        variants={product.variants}
        selectedVariantId={selectedVariantId}
        onSelect={setSelectedVariantId}
      />

      {/* SATIR 6: Ürün Detayları başlığı + öne çıkan özellik kartları */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold text-gray-900">
          Ürün Detayları
        </h2>

        <div className="mt-4">
          <ProductHighlights attributes={product.attributes} compact />
        </div>
      </div>
    </div>
  );
}