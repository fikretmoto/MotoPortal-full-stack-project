"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BrandSelector } from "./BrandSelector";
import { slugify } from "@/lib/utils";
import type { Brand } from "@/services/catalog";

export type BasicProductValues = {
  name: string;
  slug: string;
  brandSlug: string | null;
  productCode: string;
  shortDescription: string;
  description: string;
};

type BasicProductFieldsProps = {
  brands: Brand[];
  values: BasicProductValues;
  onChange: (values: BasicProductValues) => void;
};

export function BasicProductFields({ brands, values, onChange }: BasicProductFieldsProps) {
  function handleNameChange(name: string) {
    onChange({ ...values, name, slug: slugify(name) });
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Ürün Adı</Label>
        <Input
          id="name"
          value={values.name}
          onChange={(e) => handleNameChange(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">Slug</Label>
        <Input
          id="slug"
          value={values.slug}
          onChange={(e) => onChange({ ...values, slug: e.target.value })}
        />
      </div>

      <BrandSelector
        brands={brands}
        value={values.brandSlug}
        onChange={(brandSlug) => onChange({ ...values, brandSlug })}
      />

      <div className="space-y-2">
        <Label htmlFor="productCode">Ürün Kodu</Label>
        <Input
          id="productCode"
          value={values.productCode}
          onChange={(e) => onChange({ ...values, productCode: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="shortDescription">Kısa Açıklama</Label>
        <Input
          id="shortDescription"
          value={values.shortDescription}
          onChange={(e) => onChange({ ...values, shortDescription: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Açıklama</Label>
        <Textarea
          id="description"
          value={values.description}
          onChange={(e) => onChange({ ...values, description: e.target.value })}
          rows={5}
        />
      </div>
    </div>
  );
}