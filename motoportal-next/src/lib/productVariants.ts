import type { ProductVariant } from "@/services/catalog";

export type VariantAxisField =
  | "color"
  | "size"
  | "trim"
  | "capacity"
  | "wheel_size"
  | "material"
  | "bundle";

export const VARIANT_AXIS_FIELDS: VariantAxisField[] = [
  "color",
  "size",
  "trim",
  "capacity",
  "wheel_size",
  "material",
  "bundle",
];

export const VARIANT_AXIS_LABELS: Record<VariantAxisField, string> = {
  color: "Renk",
  size: "Beden",
  trim: "Donanım",
  capacity: "Kapasite",
  wheel_size: "Jant",
  material: "Malzeme",
  bundle: "Paket",
};

export type AxisSelection = Partial<Record<VariantAxisField, string>>;

/**
 * is_active=false olan variant'ları tamamen listeden çıkarır —
 * eksen tespiti, değer listeleri, resolve ve availability
 * hesaplarının hiçbirinde bu variant'lar dikkate alınmasın diye.
 */
export function getActiveVariants(
  variants: ProductVariant[]
): ProductVariant[] {
  return variants.filter((variant) => variant.is_active);
}

/** Hangi eksenlerin (field) bu ürün için en az bir dolu değeri var. */
export function getActiveAxes(
  variants: ProductVariant[]
): VariantAxisField[] {
  return VARIANT_AXIS_FIELDS.filter((field) =>
    variants.some((variant) => variant[field])
  );
}

/** Bir eksendeki benzersiz değerler, ilk görüldükleri sırayla. */
export function getAxisValues(
  variants: ProductVariant[],
  axis: VariantAxisField
): string[] {
  const seen = new Set<string>();
  const values: string[] = [];

  for (const variant of variants) {
    const value = variant[axis];
    if (value && !seen.has(value)) {
      seen.add(value);
      values.push(value);
    }
  }

  return values;
}

/** Seçimin TAMAMINA uyan tek variant'ı bulur. */
export function resolveVariant(
  variants: ProductVariant[],
  selection: AxisSelection
): ProductVariant | null {
  return (
    variants.find((variant) =>
      (Object.keys(selection) as VariantAxisField[]).every(
        (axis) => !selection[axis] || variant[axis] === selection[axis]
      )
    ) ?? null
  );
}

/**
 * Bir eksen değerinin tıklanabilir olup olmadığını, DİĞER seçili
 * eksenlere göre canlı hesaplar. Hem "hiçbir variant eşleşmiyor"
 * hem "eşleşen variant stokta yok" durumlarını aynı (soluk/
 * tıklanamaz) görünüme indirger.
 */
export function isAxisValueAvailable(
  variants: ProductVariant[],
  axis: VariantAxisField,
  value: string,
  selection: AxisSelection
): boolean {
  return variants.some(
    (variant) =>
      variant[axis] === value &&
      variant.is_in_stock &&
      (Object.keys(selection) as VariantAxisField[])
        .filter((otherAxis) => otherAxis !== axis)
        .every(
          (otherAxis) =>
            !selection[otherAxis] || variant[otherAxis] === selection[otherAxis]
        )
  );
}

/** İlk yükleme: is_default variant'ın (yoksa ilk variant'ın) değerleri. */
export function getDefaultSelection(
  variants: ProductVariant[]
): AxisSelection {
  const defaultVariant =
    variants.find((variant) => variant.is_default) ?? variants[0] ?? null;

  if (!defaultVariant) {
    return {};
  }

  const selection: AxisSelection = {};

  for (const axis of VARIANT_AXIS_FIELDS) {
    const value = defaultVariant[axis];
    if (value) {
      selection[axis] = value;
    }
  }

  return selection;
}
