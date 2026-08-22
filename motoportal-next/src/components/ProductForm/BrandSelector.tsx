"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import type { Brand } from "@/services/catalog";

type BrandSelectorProps = {
  brands: Brand[];
  value: string | null;
  onChange: (slug: string) => void;
};

export function BrandSelector({ brands, value, onChange }: BrandSelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="brand">Marka</Label>
      <Select value={value ?? undefined} onValueChange={onChange}>
        <SelectTrigger id="brand" className="w-full">
          <SelectValue placeholder="Bir marka seçin" />
        </SelectTrigger>
        <SelectContent>
          {brands.map((brand) => (
            <SelectItem key={brand.id} value={brand.slug}>
              {brand.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}