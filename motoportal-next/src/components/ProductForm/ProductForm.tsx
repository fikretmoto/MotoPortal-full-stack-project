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
import type { ProductEditData } from "@/services/products";

type ProductFormProps = {
  categories: Category[];
  brands: Brand[];
  initialData?: ProductEditData;
};

const EMPTY_BASIC_VALUES: BasicProductValues = {
  name: "",
  slug: "",
  brandSlug: null,
  productCode: "",
  shortDescription: "",
  description: "",
  instagramUrl: "",
  whatsappNumber: "",
};

const EMPTY_PRICING_VALUES: PricingValues = {
  price: "",
  discountPrice: "",
  stockStatus: "in_stock",
};

function buildInitialBasicValues(
  data: ProductEditData | undefined,
  brands: Brand[]
): BasicProductValues {
  if (!data) return EMPTY_BASIC_VALUES;

  return {
    name: data.name,
    slug: data.slug,
    brandSlug: brands.find((b) => b.id === data.brand)?.slug ?? null,
    productCode: data.product_code,
    shortDescription: data.short_description,
    description: data.description,
    instagramUrl: data.instagram_url ?? "",
    whatsappNumber: data.whatsapp_number ?? "",
  };
}

function buildInitialPricingValues(
  data: ProductEditData | undefined
): PricingValues {
  if (!data) return EMPTY_PRICING_VALUES;

  return {
    price: data.price,
    discountPrice: data.discount_price ?? "",
    stockStatus: data.stock_status,
  };
}

export function ProductForm({ categories, brands, initialData }: ProductFormProps) {
  const router = useRouter();
  const isEditMode = Boolean(initialData);

  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(
    () => categories.find((c) => c.id === initialData?.category)?.slug ?? null
  );
  const [categoryAttributes, setCategoryAttributes] = useState<CategoryAttributesResponse | null>(null);
  const [isLoadingAttributes, setIsLoadingAttributes] = useState(false);

  const [attributeValues, setAttributeValues] = useState<Record<string, AttributeValue>>(
    () => (initialData?.attributes as Record<string, AttributeValue>) ?? {}
  );

  const [basicValues, setBasicValues] = useState<BasicProductValues>(() =>
    buildInitialBasicValues(initialData, brands)
  );
  const [pricingValues, setPricingValues] = useState<PricingValues>(() =>
    buildInitialPricingValues(initialData)
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedCategorySlug) {
      setCategoryAttributes(null);
      return;
    }

    let isCancelled = false;
    setIsLoadingAttributes(true);

    getCategoryAttributes(selectedCategorySlug)
      .then((data) => {
        if (!isCancelled) {
          setCategoryAttributes(data);
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
    // Not: kategori formun ilk açılışında zaten initialData.attributes ile
    // doluyken tekrar sıfırlanmasın diye, attributeValues burada resetlenmiyor.
    // Kullanıcı gerçekten farklı bir kategori SEÇERSE, bu davranış create
    // modundaki gibi çalışsın istersen ayrıca ele alabiliriz.
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

  function sanitizeAttributeValue(value: AttributeValue): AttributeValue {
    if (Array.isArray(value)) {
      return value.filter((item) => item !== "");
    }
    return value;
  }

  function buildAttributesDiff(): Record<string, AttributeValue> {
    if (!isEditMode || !initialData) {
      const cleaned: Record<string, AttributeValue> = {};
      for (const [slug, value] of Object.entries(attributeValues)) {
        cleaned[slug] = sanitizeAttributeValue(value);
      }
      return cleaned;
    }

    const diff: Record<string, AttributeValue> = {};
    const initialAttributes = initialData.attributes;

    for (const [slug, rawValue] of Object.entries(attributeValues)) {
      const value = sanitizeAttributeValue(rawValue);
      const initialValue = initialAttributes[slug];
      const changed =
        JSON.stringify(value) !== JSON.stringify(initialValue);

      if (changed) {
        diff[slug] = value;
      }
    }

    return diff;
  }


  function buildBasicPayload() {
    if (!isEditMode || !initialData) {
      return {
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
        instagram_url: basicValues.instagramUrl || null,
        whatsapp_number: basicValues.whatsappNumber || null,
      };
    }

    const payload: Record<string, unknown> = {};

    if (basicValues.name !== initialData.name) payload.name = basicValues.name;
    if (basicValues.slug !== initialData.slug) payload.slug = basicValues.slug;
    if (selectedCategoryId !== initialData.category) payload.category = selectedCategoryId;
    if (selectedBrandId !== initialData.brand) payload.brand = selectedBrandId;
    if (basicValues.productCode !== initialData.product_code)
      payload.product_code = basicValues.productCode;
    if (basicValues.shortDescription !== initialData.short_description)
      payload.short_description = basicValues.shortDescription;
    if (basicValues.description !== initialData.description)
      payload.description = basicValues.description;
     if (basicValues.instagramUrl !== (initialData.instagram_url ?? ""))
      payload.instagram_url = basicValues.instagramUrl || null;
    if (basicValues.whatsappNumber !== (initialData.whatsapp_number ?? ""))
      payload.whatsapp_number = basicValues.whatsappNumber || null;
    if (pricingValues.price !== initialData.price) payload.price = pricingValues.price;
    if ((pricingValues.discountPrice || null) !== initialData.discount_price)
      payload.discount_price = pricingValues.discountPrice || null;
    if (pricingValues.stockStatus !== initialData.stock_status)
      payload.stock_status = pricingValues.stockStatus;

    return payload;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);

    if (!selectedCategoryId || !selectedBrandId) {
      setSubmitError("Kategori ve marka seçimi zorunludur.");
      return;
    }

    setIsSubmitting(true);

    const attributesDiff = buildAttributesDiff();
    const basicPayload = buildBasicPayload();

    const payload = {
      ...basicPayload,
      ...(Object.keys(attributesDiff).length > 0
        ? { attributes: attributesDiff }
        : {}),
    };

    try {
      const endpoint = isEditMode
        ? `/api/products/update/${initialData!.slug}`
        : "/api/products/create";

      const response = await fetch(endpoint, {
        method: isEditMode ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setSubmitError(JSON.stringify(errorData));
        return;
      }

      const saved = await response.json();
      router.push(`/dashboard/products/${saved.slug}/edit`);
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
        {isSubmitting
          ? "Kaydediliyor..."
          : isEditMode
          ? "Değişiklikleri Kaydet"
          : "Ürünü Kaydet"}
      </Button>
    </form>
  );
}