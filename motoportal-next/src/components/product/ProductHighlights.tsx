import type { ProductAttribute } from "@/services/catalog";

type ProductHighlightsProps = {
  attributes: ProductAttribute[];
  compact?: boolean;
};

export default function ProductHighlights({
  attributes,
  compact = false,
}: ProductHighlightsProps) {
  const highlightSlugs = new Set([
    "model-yili",
    "motor-hacmi",
    "maksimum-guc",
    "maksimum-tork",
    "sanziman-tipi",
  ]);

  const highlightAttributes = attributes.filter(
    (attribute) =>
      attribute.value?.trim() &&
      highlightSlugs.has(attribute.slug)
  );

  if (highlightAttributes.length === 0) {
    return null;
  }

  return (
    <section className={compact ? "" : "mt-10"}>
      <div
        className={
          compact
            ? "grid grid-cols-2 gap-3 sm:grid-cols-3"
            : "grid gap-4 sm:grid-cols-2 lg:grid-cols-5"
        }
      >
        {highlightAttributes.map((attribute) => (
          <div
            key={attribute.id}
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm font-medium text-gray-500">
              {attribute.name}
            </p>

            <p className="mt-2 text-xl font-semibold text-gray-900">
              {attribute.value}
              {attribute.unit ? ` ${attribute.unit}` : ""}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}