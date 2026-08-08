import type { ProductVariant } from "@/services/catalog";

type ProductVariantSelectorProps = {
  variants: ProductVariant[];
};

export default function ProductVariantSelector({
  variants,
}: ProductVariantSelectorProps) {
  if (variants.length === 0) {
    return null;
  }

  return (
    <div className="mt-10">
      <h3 className="text-lg font-semibold text-gray-900">
        Seçenekler
      </h3>

      <div className="mt-4 flex flex-wrap gap-3">
        {variants.map((variant) => (
          <div
            key={variant.id}
            className="min-w-[140px] rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm transition hover:border-gray-400 hover:shadow-md"
          >
            {variant.color && (
              <p className="font-semibold text-gray-900">
                {variant.color}
              </p>
            )}

            {variant.size && (
              <p className="mt-1 text-sm text-gray-600">
                Beden: {variant.size}
              </p>
            )}

            <p className="mt-2 text-xs text-gray-500">
              {variant.stock_quantity > 0
                ? `${variant.stock_quantity} adet stokta`
                : "Stok yok"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}