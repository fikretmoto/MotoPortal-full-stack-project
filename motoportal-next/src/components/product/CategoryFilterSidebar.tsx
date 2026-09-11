import type { Brand, AttributeGroupWithAttributes } from "@/services/catalog";

const FEATURE_TAGS = [
  { name: "Ücretsiz Kargo", slug: "ucretsiz-kargo" },
  { name: "Sıfır Faizli Taksit", slug: "sifir-faizli-taksit" },
  { name: "2. El", slug: "2-el" },
  { name: "Açık Kutu", slug: "acik-kutu" },
];

type Props = {
  attributeGroups: AttributeGroupWithAttributes[];
  brands: Brand[];
};

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <details
      open
      className="border-b border-gray-200 py-4 first:pt-0 last:border-b-0"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-bold text-gray-900">
        {title}
        <span className="text-gray-400 transition-transform group-open:rotate-180">
          ▾
        </span>
      </summary>
      <div className="mt-3 flex max-h-48 flex-col gap-2 overflow-y-auto pr-1">
        {children}
      </div>
    </details>
  );
}

export default function CategoryFilterSidebar({
  attributeGroups,
  brands,
}: Props) {
  const filterableAttributes = attributeGroups
    .flatMap((group) => group.attributes)
    .filter(
      (attribute) => attribute.is_filterable && attribute.options.length > 0
    );

  return (
    <div className="sticky top-6 mt-6 max-h-[calc(100vh-8rem)] overflow-y-auto border-t border-gray-200 pr-1">
      <FilterSection title="Fiyat Aralığı">
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm"
          />
          <span className="text-gray-400">-</span>
          <input
            type="number"
            placeholder="Max"
            className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm"
          />
        </div>
      </FilterSection>

      {brands.length > 0 && (
        <FilterSection title="Popüler Markalar">
          {brands.map((brand) => (
            <label
              key={brand.id}
              className="flex items-center gap-2 text-sm text-gray-700"
            >
              <input type="checkbox" className="rounded border-gray-300" />
              {brand.name}
            </label>
          ))}
        </FilterSection>
      )}

      {filterableAttributes.map((attribute) => (
        <FilterSection key={attribute.slug} title={attribute.name}>
          {attribute.options.map((option) => (
            <label
              key={option.id}
              className="flex items-center gap-2 text-sm text-gray-700"
            >
              <input type="checkbox" className="rounded border-gray-300" />
              {option.value}
            </label>
          ))}
        </FilterSection>
      ))}

      <FilterSection title="Özellikler">
        {FEATURE_TAGS.map((tag) => (
          <label
            key={tag.slug}
            className="flex items-center gap-2 text-sm text-gray-700"
          >
            <input type="checkbox" className="rounded border-gray-300" />
            {tag.name}
          </label>
        ))}
      </FilterSection>
    </div>
  );
}