"use client";

import { useMemo } from "react";
import type { ProductVariant } from "@/services/catalog";
import {
  VARIANT_AXIS_LABELS,
  getActiveAxes,
  getAxisValues,
  isAxisValueAvailable,
  type AxisSelection,
  type VariantAxisField,
} from "@/lib/productVariants";
import VariantColorPill from "./VariantColorPill";

type ProductVariantSelectorProps = {
  /** Zaten is_active=true olanlara filtrelenmiş variant listesi. */
  variants: ProductVariant[];
  selection: AxisSelection;
  onSelect: (axis: VariantAxisField, value: string) => void;
};

export default function ProductVariantSelector({
  variants,
  selection,
  onSelect,
}: ProductVariantSelectorProps) {
  const axisRows = useMemo(() => {
    const activeAxes = getActiveAxes(variants);

    return activeAxes.map((axis) => ({
      axis,
      values: getAxisValues(variants, axis).map((value) => ({
        value,
        isAvailable: isAxisValueAvailable(variants, axis, value, selection),
      })),
    }));
  }, [variants, selection]);

  if (variants.length === 0 || axisRows.length === 0) {
    return null;
  }

  return (
    <div className="mt-10 flex flex-col gap-5">
      {axisRows.map(({ axis, values }) => (
        <div key={axis}>
          <h3 className="text-sm font-semibold text-foreground">
            {VARIANT_AXIS_LABELS[axis]}
            {selection[axis] && (
              <span className="ml-2 font-normal text-fg-muted">
                {selection[axis]}
              </span>
            )}
          </h3>

          <div className="mt-2 flex flex-wrap gap-2">
            {values.map(({ value, isAvailable }) => {
              const isSelected = selection[axis] === value;

              if (axis === "color") {
                return (
                  <VariantColorPill
                    key={value}
                    colorName={value}
                    isSelected={isSelected}
                    isAvailable={isAvailable}
                    onSelect={() => onSelect(axis, value)}
                  />
                );
              }

              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => onSelect(axis, value)}
                  disabled={!isAvailable}
                  className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-line bg-card text-foreground hover:border-fg-subtle"
                  } ${!isAvailable ? "cursor-not-allowed opacity-40" : ""}`}
                >
                  {value}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
