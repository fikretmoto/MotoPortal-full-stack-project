"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getProductsByBrand } from "@/services/catalog";
import type { Category, Brand } from "@/services/catalog";
import { parseFacets } from "@/lib/facets";
import { getCategoryHref } from "@/lib/category-path";

const YEARS = Array.from({ length: 2027 - 2005 + 1 }, (_, i) => 2027 - i);
const YEAR_ATTRIBUTE_SLUG = "model-yili";

type ModelOption = {
  slug: string;
  name: string;
};

type VehicleSearchBoxProps = {
  childCategories: Category[];
  brands: Brand[];
  allCategories: Category[];
  currentCategorySlug: string;
};

export default function VehicleSearchBox({
  childCategories,
  brands,
  allCategories,
  currentCategorySlug,
}: VehicleSearchBoxProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialBrand = searchParams.get("brand") ?? "";
  const initialYear =
    parseFacets(searchParams.get("facets"))[YEAR_ATTRIBUTE_SLUG]?.[0] ?? "";

  const [selectedTip, setSelectedTip] = useState<string>(currentCategorySlug);
  const [selectedYear, setSelectedYear] = useState<string>(initialYear);
  const [selectedBrand, setSelectedBrand] = useState<string>(initialBrand);
  const [selectedModelSlug, setSelectedModelSlug] = useState<string>("");
  const [modelOptions, setModelOptions] = useState<ModelOption[]>([]);
  const [loadingModels, setLoadingModels] = useState(false);

  async function loadModels(brandSlug: string) {
    setModelOptions([]);
    setSelectedModelSlug("");
    setLoadingModels(true);

    const products = await getProductsByBrand(brandSlug);
    const seen = new Set<string>();
    const options: ModelOption[] = [];

    for (const product of products) {
      if (seen.has(product.name)) continue;
      seen.add(product.name);
      options.push({ slug: product.slug, name: product.name });
    }

    setModelOptions(options);
    setLoadingModels(false);
  }

  // Sayfa yenilendiğinde URL'den gelen marka seçimi varsa (?brand=),
  // model listesini de otomatik doldur -- sadece marka seçimi değil,
  // dropdown'un kendisi de boş kalmasın.
  useEffect(() => {
    if (initialBrand) {
      loadModels(initialBrand);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleBrandChange(brandSlug: string) {
    setSelectedBrand(brandSlug);
    await loadModels(brandSlug);
  }

  function handleSearch() {
    // Model seçiliyse (bir model, tam olarak tek bir ürüne karşılık
    // geliyor) doğrudan o ürünün sayfasına git -- kategori filtresine
    // gerek yok.
    if (selectedModelSlug) {
      router.push(`/products/${selectedModelSlug}`);
      return;
    }

    const targetSlug = selectedTip || currentCategorySlug;
    const query = new URLSearchParams();

    if (selectedBrand) {
      query.set("brand", selectedBrand);
    }
    if (selectedYear) {
      query.set("facets", `${YEAR_ATTRIBUTE_SLUG}:${selectedYear}`);
    }

    const queryString = query.toString();
    const targetHref = getCategoryHref(targetSlug, allCategories);
    router.push(`${targetHref}${queryString ? `?${queryString}` : ""}`);
  }

  return (
    <div className="mb-8 flex flex-wrap items-end gap-3 rounded-xl border border-line bg-card p-4">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-fg-muted">Tip</label>
        <Select value={selectedTip} onValueChange={setSelectedTip}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Seçiniz" />
          </SelectTrigger>
          <SelectContent>
            {childCategories.map((category) => (
              <SelectItem key={category.id} value={category.slug}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-fg-muted">Yıl</label>
        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Seçiniz" />
          </SelectTrigger>
          <SelectContent>
            {YEARS.map((year) => (
              <SelectItem key={year} value={String(year)}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-fg-muted">Marka</label>
        <Select value={selectedBrand} onValueChange={handleBrandChange}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Seçiniz" />
          </SelectTrigger>
          <SelectContent position="popper">
            {brands.map((brand) => (
              <SelectItem key={brand.id} value={brand.slug}>
                {brand.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-fg-muted">Model</label>
        <Select
          value={selectedModelSlug}
          onValueChange={setSelectedModelSlug}
          disabled={!selectedBrand || modelOptions.length === 0}
        >
          <SelectTrigger className="w-40">
            <SelectValue
              placeholder={
                !selectedBrand
                  ? "Önce marka seçin"
                  : loadingModels
                  ? "Yükleniyor..."
                  : "Seçiniz"
              }
            />
          </SelectTrigger>
          <SelectContent>
            {modelOptions.map((option) => (
              <SelectItem key={option.slug} value={option.slug}>
                {option.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <button
        type="button"
        onClick={handleSearch}
        className="rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover"
      >
        Ara
      </button>
    </div>
  );
}
