"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { AttributeGroupWithAttributes, Product } from "@/services/catalog";
import {
  getCategoryAttributes,
  getProductsByBrandPage,
} from "@/services/catalog";
import ProductCard from "./ProductCard";
import Pagination, {
  PRODUCT_GRID_ANCHOR_ID,
  PRODUCTS_PAGE_SIZE,
} from "./Pagination";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type Props = {
  brandSlug: string;
  allProducts: Product[];
  initialProducts: Product[];
  initialCount: number;
  initialPage: number;
};

export default function BrandProductsSection({
  brandSlug,
  allProducts,
  initialProducts,
  initialCount,
  initialPage,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(initialPage);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceMinInput, setPriceMinInput] = useState("");
  const [priceMaxInput, setPriceMaxInput] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [selectedFacets, setSelectedFacets] = useState<Record<string, string[]>>({});

  const [categoryAttributes, setCategoryAttributes] = useState<
    AttributeGroupWithAttributes[]
  >([]);

  // Markanın TÜM ürünlerinden (getProductsByBrand artık sayfalama
  // sınırına takılmadan hepsini getiriyor) kategori listesi + sayıları
  // çıkar -- ızgarada o an görünen sayfaya bağlı değil.
  const categories = useMemo(() => {
    const map = new Map<string, { slug: string; name: string; count: number }>();
    for (const product of allProducts) {
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
  }, [allProducts]);

  function goToPage(targetPage: number) {
    setPage(targetPage);

    const params = new URLSearchParams(searchParams.toString());
    if (targetPage > 1) {
      params.set("page", String(targetPage));
    } else {
      params.delete("page");
    }
    const queryString = params.toString();
    router.replace(
      `${pathname}${queryString ? `?${queryString}` : ""}`,
      { scroll: false }
    );

    document
      .getElementById(PRODUCT_GRID_ANCHOR_ID)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function toggleCategory(slug: string) {
    setPage(1);
    setSelectedCategories((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  }

  function toggleFacetValue(attributeSlug: string, value: string) {
    setPage(1);
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

  function applyPriceMin() {
    if (priceMinInput === priceMin) return;
    setPage(1);
    setPriceMin(priceMinInput);
  }

  function applyPriceMax() {
    if (priceMaxInput === priceMax) return;
    setPage(1);
    setPriceMax(priceMaxInput);
  }

  function handlePriceKeyDown(
    event: React.KeyboardEvent<HTMLInputElement>,
    apply: () => void
  ) {
    if (event.key === "Enter") {
      apply();
    }
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

  // Herhangi bir filtre ya da sayfa değişince backend'den ürünleri
  // yeniden çek. Fiyat artık backend'e gidiyor (Coalesce(discount_price,
  // price) ile) -- client-side süzme yok.
  useEffect(() => {
    const facetsParam = Object.entries(selectedFacets)
      .map(([slug, values]) => `${slug}:${values.join("|")}`)
      .join(",");

    setLoading(true);

    getProductsByBrandPage(brandSlug, {
      category: selectedCategories.join(","),
      price_min: priceMin || undefined,
      price_max: priceMax || undefined,
      facets: facetsParam || undefined,
      page,
    })
      .then((result) => {
        setProducts(result.results);
        setCount(result.count);
      })
      .finally(() => setLoading(false));
  }, [brandSlug, selectedCategories, priceMin, priceMax, selectedFacets, page]);

  const totalPages = Math.max(1, Math.ceil(count / PRODUCTS_PAGE_SIZE));

  const filterableAttributes = categoryAttributes
    .flatMap((group) => group.attributes)
    .filter((attribute) => attribute.is_filterable && attribute.options.length > 0);

  const activeFilterCount =
    selectedCategories.length +
    (priceMin ? 1 : 0) +
    (priceMax ? 1 : 0) +
    Object.values(selectedFacets).reduce((sum, values) => sum + values.length, 0);

  // Filtre içeriği: masaüstünde aside içinde, mobilde Sheet içinde AYNI içerik
  // ve AYNI state ile gösterilir.
  const filterPanel = (
    <>
      <div className="mb-6">
        <h3 className="mb-3 text-sm font-bold text-foreground">Kategori</h3>
        <div className="flex flex-col gap-2">
          {categories.map((category) => (
            <label
              key={category.slug}
              className="flex items-center gap-2 text-sm text-fg-muted"
            >
              <input
                type="checkbox"
                className="rounded border-line"
                checked={selectedCategories.includes(category.slug)}
                onChange={() => toggleCategory(category.slug)}
              />
              {category.name} ({category.count})
            </label>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="mb-3 text-sm font-bold text-foreground">Fiyat Aralığı</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={priceMinInput}
            onChange={(e) => setPriceMinInput(e.target.value)}
            onBlur={applyPriceMin}
            onKeyDown={(e) => handlePriceKeyDown(e, applyPriceMin)}
            className="w-full rounded-md border border-line px-2 py-1.5 text-sm"
          />
          <span className="text-fg-subtle">-</span>
          <input
            type="number"
            placeholder="Max"
            value={priceMaxInput}
            onChange={(e) => setPriceMaxInput(e.target.value)}
            onBlur={applyPriceMax}
            onKeyDown={(e) => handlePriceKeyDown(e, applyPriceMax)}
            className="w-full rounded-md border border-line px-2 py-1.5 text-sm"
          />
        </div>
      </div>

      {selectedCategories.length === 1 &&
        filterableAttributes.map((attribute) => (
          <div key={attribute.slug} className="mb-6">
            <h3 className="mb-3 text-sm font-bold text-foreground">
              {attribute.name}
            </h3>
            <div className="flex max-h-48 flex-col gap-2 overflow-y-auto pr-1">
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
                    onChange={() => toggleFacetValue(attribute.slug, option.value)}
                  />
                  {option.value}
                </label>
              ))}
            </div>
          </div>
        ))}
    </>
  );

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
      {/* Masaüstü: solda filtre */}
      <aside className="hidden w-72 flex-none lg:block">{filterPanel}</aside>

      <div className="flex-1">
        {/* Mobil: Filtrele butonu + alttan açılan panel */}
        <div className="sticky top-0 z-20 -mx-1.5 mb-3 bg-background px-1.5 py-2 lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <button
                type="button"
                className="w-full rounded-lg border border-line py-2 text-sm font-semibold text-foreground"
              >
                Filtrele{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
              </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Filtrele</SheetTitle>
              </SheetHeader>
              <div className="px-4 pb-6">{filterPanel}</div>
            </SheetContent>
          </Sheet>
        </div>

        {loading && <p className="text-sm text-fg-muted">Yükleniyor...</p>}

        {!loading && products.length === 0 && (
          <p className="text-sm text-fg-muted">Hiçbir ürün eşleşmedi.</p>
        )}

        <div
          id={PRODUCT_GRID_ANCHOR_ID}
          className="grid grid-cols-2 gap-1.5 lg:grid-cols-3"
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onNavigate={goToPage}
        />
      </div>
    </div>
  );
}
