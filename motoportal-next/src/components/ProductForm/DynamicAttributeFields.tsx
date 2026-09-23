"use client";

import { AttributeField, type AttributeValue } from "./AttributeField";
import type { AttributeGroupWithAttributes } from "@/services/catalog";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

type DynamicAttributeFieldsProps = {
  attributeGroups: AttributeGroupWithAttributes[];
  values: Record<string, AttributeValue>;
  onChange: (slug: string, value: AttributeValue) => void;
};

export function DynamicAttributeFields({ attributeGroups, values, onChange }: DynamicAttributeFieldsProps) {
  return (
    <Accordion
      type="multiple"
      defaultValue={attributeGroups.map((group) => group.slug)}
      className="rounded-lg border border-line px-4"
    >
      {attributeGroups.map((group) => (
        <AccordionItem key={group.slug} value={group.slug}>
          <AccordionTrigger className="text-sm font-semibold text-foreground">
            {group.name}
            <span className="ml-2 text-xs font-normal text-fg-subtle">
              ({group.attributes.length})
            </span>
          </AccordionTrigger>

          <AccordionContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {group.attributes.map((attribute) => (
                <AttributeField
                  key={attribute.id}
                  attribute={attribute}
                  value={values[attribute.slug]}
                  onChange={onChange}
                />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}