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

export default function CategoryFilterSidebar({
  attributeGroups,
  brands,
}: Props) {
  const filterableAttributes = attributeGroups
    .flatMap((group) => group.attributes)
    .filter((attribute) => attribute.is_filterable && attribute.options.length > 0);

  return (
    <div className="mt-6 flex flex-col gap-6 border-t border-gray-200 pt-6">
      <div>
        <h3 className="mb-3 text-sm font-bold text-gray-900">Fiyat Aralığı</h3>
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
      </div>

      {brands.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-bold text-gray-900">Popüler Markalar</h3>
          <div className="flex flex-col gap-2">
            {brands.slice(0, 8).map((brand) => (
              <label
                key={brand.id}
                className="flex items-center gap-2 text-sm text-gray-700"
              >
                <input type="checkbox" className="rounded border-gray-300" />
                {brand.name}
              </label>
            ))}
          </div>
        </div>
      )}

      {filterableAttributes.map((attribute) => (
        <div key={attribute.slug}>
          <h3 className="mb-3 text-sm font-bold text-gray-900">{attribute.name}</h3>
          <div className="flex flex-col gap-2">
            {attribute.options.map((option) => (
              <label
                key={option.id}
                className="flex items-center gap-2 text-sm text-gray-700"
              >
                <input type="checkbox" className="rounded border-gray-300" />
                {option.value}
              </label>
            ))}
          </div>
        </div>
      ))}

      <div>
        <h3 className="mb-3 text-sm font-bold text-gray-900">Özellikler</h3>
        <div className="flex flex-col gap-2">
          {FEATURE_TAGS.map((tag) => (
            <label
              key={tag.slug}
              className="flex items-center gap-2 text-sm text-gray-700"
            >
              <input type="checkbox" className="rounded border-gray-300" />
              {tag.name}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}