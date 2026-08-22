"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { CategoryAttribute } from "@/services/catalog";

export type AttributeValue = string | number | boolean | string[];

type AttributeFieldProps = {
  attribute: CategoryAttribute;
  value: AttributeValue | undefined;
  onChange: (slug: string, value: AttributeValue) => void;
};

export function AttributeField({ attribute, value, onChange }: AttributeFieldProps) {
  const fieldId = `attribute-${attribute.slug}`;

  if (attribute.data_type === "multi_select") {
    const selectedValues = Array.isArray(value) ? value : [];

    function toggleOption(optionValue: string) {
      const isSelected = selectedValues.includes(optionValue);
      const nextValues = isSelected
        ? selectedValues.filter((item) => item !== optionValue)
        : [...selectedValues, optionValue];

      onChange(attribute.slug, nextValues);
    }

    return (
      <div className="space-y-2">
        <Label>{attribute.name}</Label>
        <div className="flex flex-wrap gap-4">
          {attribute.options.map((option) => (
            <label key={option.id} className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={selectedValues.includes(option.value)}
                onCheckedChange={() => toggleOption(option.value)}
              />
              {option.value}
            </label>
          ))}
        </div>
      </div>
    );
  }

  if (attribute.data_type === "single_select") {
    return (
      <div className="space-y-2">
        <Label htmlFor={fieldId}>{attribute.name}</Label>
        <Select
          value={typeof value === "string" ? value : undefined}
          onValueChange={(newValue) => onChange(attribute.slug, newValue)}
        >
          <SelectTrigger id={fieldId} className="w-full">
            <SelectValue placeholder="Seçin" />
          </SelectTrigger>
          <SelectContent>
            {attribute.options.map((option) => (
              <SelectItem key={option.id} value={option.value}>
                {option.value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  if (attribute.data_type === "boolean") {
    return (
      <label htmlFor={fieldId} className="flex items-center gap-2 text-sm">
        <Checkbox
          id={fieldId}
          checked={value === true}
          onCheckedChange={(checked) => onChange(attribute.slug, checked === true)}
        />
        {attribute.name}
      </label>
    );
  }

  if (attribute.data_type === "integer" || attribute.data_type === "decimal") {
    return (
      <div className="space-y-2">
        <Label htmlFor={fieldId}>{attribute.name}</Label>
        <div className="flex items-center gap-2">
          <Input
            id={fieldId}
            type="number"
            step={attribute.data_type === "decimal" ? "any" : "1"}
            value={typeof value === "number" || typeof value === "string" ? value : ""}
            onChange={(e) => onChange(attribute.slug, e.target.value)}
          />
          {attribute.unit && <span className="text-sm text-gray-500">{attribute.unit}</span>}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={fieldId}>{attribute.name}</Label>
      <Input
        id={fieldId}
        type="text"
        value={typeof value === "string" ? value : ""}
        onChange={(e) => onChange(attribute.slug, e.target.value)}
      />
    </div>
  );
}