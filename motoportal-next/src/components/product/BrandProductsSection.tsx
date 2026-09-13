"use client";

import { useEffect, useMemo, useState } from "react";
import type { AttributeGroupWithAttributes, Product } from "@/services/catalog";
import {
  getCategoryAttributes,
  getProductsByBrandFiltered,
} from "@/services/catalog";
import ProductCard from "./ProductCard";

type Props = {
  brandSlug: string;
  products: Product[];
};

export default function BrandProductsSection({
  brandSlug,
  products: initialProducts,
}: Props) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(false);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [selectedFacets, setSelectedFacets] = useState<Record<string, string[]>>({});

  const [categoryAttributes, setCategoryAttributes] = useState
    AttributeGroupWithAttributes[]
  >([]);

  // İlk yüklemedeki ürünlerden kategori listesi + sayıları çıkar (sadece görsel liste için)
  const categories = useMemo(() => {
    const map = new Map<string, { slug: string; name: string; count: number }>();
    for (const product of initialProducts) {
      const existing = map.get(product.category.slug);
      if (existing) {
        existing.count += 1;
      } else {
        map.set(product.category.slug, {
          slug: product.category.slug,
          name: product.category.name,
          count: 1,
        });
      }
    }
    return Array.from(map.values());
  }, [initialProducts]);

  function toggleCategory(slug: string) {
    setSelectedCategories((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  }

  function toggleFacetValue(attributeSlug: string, value: string) {
    setSelectedFacets((prev) => {
      const current = prev[attributeSlug] ?? [];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];

      const updated = { ...prev };
      if (next.length === 0) {
        delete updated[attributeSlug];
      } else {
        updated[attributeSlug] = next;
      }
      return updated;
    });
  }

  // Tek kategori seçiliyken o kategorinin attribute'larını çek
  useEffect(() => {
    if (selectedCategories.length !== 1) {
      setCategoryAttributes([]);
      setSelectedFacets({});
      return;
    }

    let cancelled = false;

    getCategoryAttributes(selectedCategories[0])
      .then((data) => {
        if (!cancelled) setCategoryAttributes(data.attribute_groups);
      })
      .catch(() => {
        if (!cancelled) setCategoryAttributes([]);
      });

    setSelectedFacets({});

    return () => {
      cancelled = true;
    };
  }, [selectedCategories]);

  // Herhangi bir filtre değişince backend'den ürünleri yeniden çek
  useEffect(() => {
    const facetsParam = Object.entries(selectedFacets)
      .map(([slug, values]) => `${slug}:${values.join("|")}`)
      .join(",");

    setLoading(true);

    getProductsByBrandFiltered(brandSlug, {
      category: selectedCategories.join(","),
      priceMin,
      priceMax,
      facets: facetsParam,
    })
      .then((result) => setProducts(result))
      .finally(() => setLoading(false));
  }, [brandSlug, selectedCategories, priceMin, priceMax, selectedFacets]);

  const filterableAttributes = categoryAttributes
    .flatMap((group) => group.attributes)
    .filter((attribute) => attribute.is_filterable && attribute.options.length > 0);

  return (
    <div className="flex gap-8">
      <aside className="w-64 flex-none">
        <div className="mb-6">
          <h3 className="mb-3 text-sm font-bold text-gray-900">Kategori</h3>
          <div className="flex flex-col gap-2">
            {categories.map((category) => (
              <label
                key={category.slug}
                className="flex items-center gap-2 text-sm text-gray-700"
              >
                <input
                  type="checkbox"
                  className="rounded border-gray-300"
                  checked={selectedCategories.includes(category.slug)}
                  onChange={() => toggleCategory(category.slug)}
                />
                {category.name} ({category.count})
              </label>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="mb-3 text-sm font-bold text-gray-900">Fiyat Aralığı</h3>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm"
            />
            <span className="text-gray-400">-</span>
            <input
              type="number"
              placeholder="Max"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm"
            />
          </div>
        </div>

        {selectedCategories.length === 1 &&
          filterableAttributes.map((attribute) => (
            <div key={attribute.slug} className="mb-6">
              <h3 className="mb-3 text-sm font-bold text-gray-900">
                {attribute.name}
              </h3>
              <div className="flex max-h-48 flex-col gap-2 overflow-y-auto pr-1">
                {attribute.options.map((option) => (
                  <label
                    key={option.id}
                    className="flex items-center gap-2 text-sm text-gray-700"
                  >
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                      checked={(selectedFacets[attribute.slug] ?? []).includes(
                        option.value
                      )}
                      onChange={() => toggleFacetValue(attribute.slug, option.value)}
                    />
                    {option.value}
                  </label>
                ))}
              </div>
            </div>
          ))}
      </aside>

      <div className="flex-1">
        {loading && <p className="text-sm text-gray-500">Yükleniyor...</p>}

        {!loading && products.length === 0 && (
          <p className="text-sm text-gray-500">Hiçbir ürün eşleşmedi.</p>
        )}

        <div className="flex flex-wrap gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}