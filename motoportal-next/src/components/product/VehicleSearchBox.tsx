"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getProductsByBrand } from "@/services/catalog";
import type { Category, Brand } from "@/services/catalog";

const YEARS = Array.from({ length: 2027 - 2005 + 1 }, (_, i) => 2027 - i);

type VehicleSearchBoxProps = {
  childCategories: Category[];
  brands: Brand[];
};

export default function VehicleSearchBox({
  childCategories,
  brands,
}: VehicleSearchBoxProps) {
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [modelOptions, setModelOptions] = useState<string[]>([]);
  const [loadingModels, setLoadingModels] = useState(false);

  async function handleBrandChange(brandSlug: string) {
    setSelectedBrand(brandSlug);
    setModelOptions([]);
    setLoadingModels(true);

    const products = await getProductsByBrand(brandSlug);
    const uniqueNames = Array.from(
      new Set(products.map((p) => p.name))
    );

    setModelOptions(uniqueNames);
    setLoadingModels(false);
  }

  return (
    <div className="mb-8 flex flex-wrap items-end gap-3 rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-600">Tip</label>
        <Select>
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
        <label className="text-xs font-medium text-gray-600">Yıl</label>
        <Select>
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
        <label className="text-xs font-medium text-gray-600">Marka</label>
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
        <label className="text-xs font-medium text-gray-600">Model</label>
        <Select disabled={!selectedBrand || modelOptions.length === 0}>
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
            {modelOptions.map((name) => (
              <SelectItem key={name} value={name}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <button
        type="button"
        className="rounded-lg bg-gray-900 px-6 py-2 text-sm font-semibold text-white"
      >
        Ara
      </button>
    </div>
  );
}