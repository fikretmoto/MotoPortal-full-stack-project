import type { ProductAttribute } from "@/services/catalog";

type ProductHighlightsProps = {
  attributes: ProductAttribute[];
  compact?: boolean;
};

export default function ProductHighlights({
  attributes,
  compact = false,
}: ProductHighlightsProps) {
  const highlightAttributes = attributes.filter(
    (attribute) => attribute.is_highlight && attribute.value?.trim()
  );

  if (highlightAttributes.length === 0) {
    return null;
  }

  if (compact) {
    return (
      <dl className="divide-y divide-line">
        {highlightAttributes.map((attribute) => (
          <div
            key={attribute.id}
            className="flex items-center justify-between py-3"
          >
            <dt className="text-sm text-fg-muted">{attribute.name}</dt>
            <dd className="text-sm font-semibold text-foreground">
              {attribute.value}
              {attribute.unit ? ` ${attribute.unit}` : ""}
            </dd>
          </div>
        ))}
      </dl>
    );
  }

  return (
    <section className="mt-10">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {highlightAttributes.map((attribute) => (
          <div
            key={attribute.id}
            className="rounded-2xl border border-line bg-card p-5 shadow-sm"
          >
            <p className="text-sm font-medium text-fg-muted">
              {attribute.name}
            </p>

            <p className="mt-2 text-xl font-semibold text-foreground">
              {attribute.value}
              {attribute.unit ? ` ${attribute.unit}` : ""}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}