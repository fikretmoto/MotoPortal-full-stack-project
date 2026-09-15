import type { ProductVariant } from "@/services/catalog";

type ProductVariantSelectorProps = {
  variants: ProductVariant[];
  selectedVariantId: number | null;
  onSelect: (variantId: number) => void;
};

export default function ProductVariantSelector({
  variants,
  selectedVariantId,
  onSelect,
}: ProductVariantSelectorProps) {
  if (variants.length === 0) {
    return null;
  }

  return (
    <div className="mt-10">
      <h3 className="text-lg font-semibold text-foreground">
        Seçenekler
      </h3>

      <div className="mt-4 flex flex-wrap gap-3">
        {variants.map((variant) => {
          const isSelected = variant.id === selectedVariantId;

          const details = [
            variant.size && `Beden: ${variant.size}`,
            variant.trim && `Donanım: ${variant.trim}`,
            variant.capacity && `Kapasite: ${variant.capacity}`,
            variant.wheel_size && `Jant: ${variant.wheel_size}`,
            variant.material && `Malzeme: ${variant.material}`,
            variant.bundle && variant.bundle,
          ].filter(Boolean);

          return (
            <button
              key={variant.id}
              type="button"
              onClick={() => onSelect(variant.id)}
              disabled={!variant.is_in_stock}
              className={`min-w-[140px] rounded-xl border px-4 py-3 text-left shadow-sm transition ${
                isSelected
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-line bg-card hover:border-fg-subtle hover:shadow-md"
              } ${!variant.is_in_stock ? "cursor-not-allowed opacity-50" : ""}`}
            >
              {variant.color && (
                <p className="font-semibold">{variant.color}</p>
              )}

              {details.map((detail) => (
                <p
                  key={detail}
                  className={`mt-1 text-sm ${
                    isSelected ? "text-primary-foreground/80" : "text-fg-muted"
                  }`}
                >
                  {detail}
                </p>
              ))}

              <p
                className={`mt-2 text-xs ${
                  isSelected ? "text-primary-foreground/70" : "text-fg-subtle"
                }`}
              >
                {variant.is_in_stock
                  ? `${variant.stock_quantity} adet stokta`
                  : "Stok yok"}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}