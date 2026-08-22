"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CategorySelector } from "./CategorySelector";
import { DynamicAttributeFields } from "./DynamicAttributeFields";
import { BasicProductFields, type BasicProductValues } from "./BasicProductFields";
import { PricingFields, type PricingValues } from "./PricingFields";
import type { AttributeValue } from "./AttributeField";
import { Button } from "@/components/ui/button";
import {
  getCategoryAttributes,
  type Brand,
  type Category,
  type CategoryAttributesResponse,
} from "@/services/catalog";

type ProductFormProps = {
  categories: Category[];
  brands: Brand[];
};

const EMPTY_BASIC_VALUES: BasicProductValues = {
  name: "",
  slug: "",
  brandSlug: null,
  productCode: "",
  shortDescription: "",
  description: "",
};

const EMPTY_PRICING_VALUES: PricingValues = {
  price: "",
  discountPrice: "",
  stockStatus: "in_stock",
};

export function ProductForm({ categories, brands }: ProductFormProps) {
  const router = useRouter();

  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(null);
  const [categoryAttributes, setCategoryAttributes] = useState<CategoryAttributesResponse | null>(null);
  const [isLoadingAttributes, setIsLoadingAttributes] = useState(false);
  const [attributeValues, setAttributeValues] = useState<Record<string, AttributeValue>>({});

  const [basicValues, setBasicValues] = useState<BasicProductValues>(EMPTY_BASIC_VALUES);
  const [pricingValues, setPricingValues] = useState<PricingValues>(EMPTY_PRICING_VALUES);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedCategorySlug) {
      setCategoryAttributes(null);
      setAttributeValues({});
      return;
    }

    let isCancelled = false;
    setIsLoadingAttributes(true);

    getCategoryAttributes(selectedCategorySlug)
      .then((data) => {
        if (!isCancelled) {
          setCategoryAttributes(data);
          setAttributeValues({});
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setIsLoadingAttributes(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [selectedCategorySlug]);

  function handleAttributeChange(slug: string, value: AttributeValue) {
    setAttributeValues((previous) => ({
      ...previous,
      [slug]: value,
    }));
  }

  const selectedCategoryId = categories.find(
    (category) => category.slug === selectedCategorySlug
  )?.id;

  const selectedBrandId = brands.find(
    (brand) => brand.slug === basicValues.brandSlug
  )?.id;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);

    if (!selectedCategoryId || !selectedBrandId) {
      setSubmitError("Kategori ve marka seçimi zorunludur.");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      name: basicValues.name,
      slug: basicValues.slug,
      category: selectedCategoryId,
      brand: selectedBrandId,
      product_code: basicValues.productCode,
      short_description: basicValues.shortDescription,
      description: basicValues.description,
      price: pricingValues.price,
      discount_price: pricingValues.discountPrice || null,
      stock_status: pricingValues.stockStatus,
      attributes: attributeValues,
    };

    try {
      const response = await fetch("/api/products/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setSubmitError(JSON.stringify(errorData));
        return;
      }

      const created = await response.json();
      router.push(`/dashboard/products/${created.slug}/edit`);
      router.refresh();
    } catch {
      setSubmitError("Bir hata oluştu, lütfen tekrar deneyin.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
      <CategorySelector
        categories={categories}
        value={selectedCategorySlug}
        onChange={setSelectedCategorySlug}
      />

      <BasicProductFields
        brands={brands}
        values={basicValues}
        onChange={setBasicValues}
      />

      <PricingFields values={pricingValues} onChange={setPricingValues} />

      {isLoadingAttributes && <p>Özellikler yükleniyor...</p>}

      {categoryAttributes && (
        <DynamicAttributeFields
          attributeGroups={categoryAttributes.attribute_groups}
          values={attributeValues}
          onChange={handleAttributeChange}
        />
      )}

      {submitError && (
        <p className="text-sm text-red-600 whitespace-pre-wrap">{submitError}</p>
      )}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Kaydediliyor..." : "Ürünü Kaydet"}
      </Button>
    </form>
  );
}