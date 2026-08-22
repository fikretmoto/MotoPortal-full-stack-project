"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import type { Category } from "@/services/catalog";

type CategorySelectorProps = {
  categories: Category[];
  value: string | null;
  onChange: (slug: string) => void;
};

export function CategorySelector({
  categories,
  value,
  onChange,
}: CategorySelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="category">Kategori</Label>
      <Select value={value ?? undefined} onValueChange={onChange}>
        <SelectTrigger id="category" className="w-full">
          <SelectValue placeholder="Bir kategori seçin" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.slug}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}