"use client";

import { AttributeField, type AttributeValue } from "./AttributeField";
import type { AttributeGroupWithAttributes } from "@/services/catalog";

type DynamicAttributeFieldsProps = {
  attributeGroups: AttributeGroupWithAttributes[];
  values: Record<string, AttributeValue>;
  onChange: (slug: string, value: AttributeValue) => void;
};

export function DynamicAttributeFields({ attributeGroups, values, onChange }: DynamicAttributeFieldsProps) {
  return (
    <div className="space-y-8">
      {attributeGroups.map((group) => (
        <div key={group.slug} className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-700 border-b pb-1">
            {group.name}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {group.attributes.map((attribute) => (
              <AttributeField
                key={attribute.id}
                attribute={attribute}
                value={values[attribute.slug]}
                onChange={onChange}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}