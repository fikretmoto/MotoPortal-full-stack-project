"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Brand, AttributeGroupWithAttributes } from "@/services/catalog";
import { parseFacets, stringifyFacets } from "@/lib/facets";
import { PRODUCT_GRID_ANCHOR_ID } from "./Pagination";

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
      className="border-b border-line py-4 first:pt-0 last:border-b-0"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-bold text-foreground">
        {title}
        <span className="text-fg-subtle transition-transform group-open:rotate-180">
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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedBrands = (searchParams.get("brand") ?? "")
    .split(",")
    .filter(Boolean);
  const selectedFacets = parseFacets(searchParams.get("facets"));

  const urlPriceMin = searchParams.get("price_min") ?? "";
  const urlPriceMax = searchParams.get("price_max") ?? "";
  const [priceMin, setPriceMin] = useState(urlPriceMin);
  const [priceMax, setPriceMax] = useState(urlPriceMax);

  // Geri/ileri gezinme ya da başka bir filtre URL'yi değiştirdiğinde
  // fiyat input'larının yerel taslak değerini URL ile senkron tut.
  useEffect(() => {
    setPriceMin(urlPriceMin);
    setPriceMax(urlPriceMax);
  }, [urlPriceMin, urlPriceMax]);

  function navigateWithParams(mutate: (params: URLSearchParams) => void) {
    const params = new URLSearchParams(searchParams.toString());
    mutate(params);
    params.delete("page");

    const queryString = params.toString();
    router.push(
      `${pathname}${queryString ? `?${queryString}` : ""}#${PRODUCT_GRID_ANCHOR_ID}`
    );
  }

  function toggleBrand(slug: string) {
    navigateWithParams((params) => {
      const next = selectedBrands.includes(slug)
        ? selectedBrands.filter((s) => s !== slug)
        : [...selectedBrands, slug];

      if (next.length > 0) {
        params.set("brand", next.join(","));
      } else {
        params.delete("brand");
      }
    });
  }

  function toggleFacetOption(attributeSlug: string, value: string) {
    navigateWithParams((params) => {
      const current = selectedFacets[attributeSlug] ?? [];
      const nextValues = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];

      const nextFacets = { ...selectedFacets, [attributeSlug]: nextValues };
      const stringified = stringifyFacets(nextFacets);

      if (stringified) {
        params.set("facets", stringified);
      } else {
        params.delete("facets");
      }
    });
  }

  function applyPrice() {
    navigateWithParams((params) => {
      if (priceMin) {
        params.set("price_min", priceMin);
      } else {
        params.delete("price_min");
      }

      if (priceMax) {
        params.set("price_max", priceMax);
      } else {
        params.delete("price_max");
      }
    });
  }

  function handlePriceKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      applyPrice();
    }
  }

  const filterableAttributes = attributeGroups
    .flatMap((group) => group.attributes)
    .filter(
      (attribute) => attribute.is_filterable && attribute.options.length > 0
    );

  return (
    <div className="sticky top-6 mt-6 max-h-[calc(100vh-8rem)] overflow-y-auto border-t border-line pr-1">
      <FilterSection title="Fiyat Aralığı">
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            onBlur={applyPrice}
            onKeyDown={handlePriceKeyDown}
            className="w-full rounded-md border border-line px-2 py-1.5 text-sm"
          />
          <span className="text-fg-subtle">-</span>
          <input
            type="number"
            placeholder="Max"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            onBlur={applyPrice}
            onKeyDown={handlePriceKeyDown}
            className="w-full rounded-md border border-line px-2 py-1.5 text-sm"
          />
        </div>
      </FilterSection>

      {brands.length > 0 && (
        <FilterSection title="Popüler Markalar">
          {brands.map((brand) => (
            <label
              key={brand.id}
              className="flex items-center gap-2 text-sm text-fg-muted"
            >
              <input
                type="checkbox"
                className="rounded border-line"
                checked={selectedBrands.includes(brand.slug)}
                onChange={() => toggleBrand(brand.slug)}
              />
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
              className="flex items-center gap-2 text-sm text-fg-muted"
            >
              <input
                type="checkbox"
                className="rounded border-line"
                checked={(selectedFacets[attribute.slug] ?? []).includes(
                  option.value
                )}
                onChange={() =>
                  toggleFacetOption(attribute.slug, option.value)
                }
              />
              {option.value}
            </label>
          ))}
        </FilterSection>
      ))}

      <FilterSection title="Özellikler">
        {FEATURE_TAGS.map((tag) => (
          <label
            key={tag.slug}
            className="flex items-center gap-2 text-sm text-fg-muted"
          >
            <input type="checkbox" className="rounded border-line" />
            {tag.name}
          </label>
        ))}
      </FilterSection>
    </div>
  );
}
