"use client";

import { useMemo } from "react";

import type { ProductAttribute } from "@/services/catalog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type ProductTechnicalTabsProps = {
  attributes: ProductAttribute[];
};

type AttributeGroup = {
  name: string;
  slug: string;
  attributes: ProductAttribute[];
};

export default function ProductTechnicalTabs({
  attributes,
}: ProductTechnicalTabsProps) {
  const groups = useMemo(() => {
    const groupedAttributes = new Map<string, AttributeGroup>();

    attributes
      .filter((attribute) => attribute.value?.trim())
      .forEach((attribute) => {
        const groupSlug = attribute.group_slug;
        const groupName = attribute.group;

        if (!groupedAttributes.has(groupSlug)) {
          groupedAttributes.set(groupSlug, {
            name: groupName,
            slug: groupSlug,
            attributes: [],
          });
        }

        groupedAttributes
          .get(groupSlug)
          ?.attributes.push(attribute);
      });

    return Array.from(groupedAttributes.values());
  }, [attributes]);

  if (groups.length === 0) {
    return null;
  }

  // Grupları iki koluna dağıt (sırayla: 1. sol, 2. sağ, 3. sol, 4. sağ...)
  const leftGroups = groups.filter((_, index) => index % 2 === 0);
  const rightGroups = groups.filter((_, index) => index % 2 === 1);

  const renderGroupAccordion = (groupList: AttributeGroup[]) => (
    <Accordion type="multiple" className="w-full">
      {groupList.map((group) => (
        <AccordionItem key={group.slug} value={group.slug}>
          <AccordionTrigger className="text-base font-semibold text-gray-900">
            {group.name}
          </AccordionTrigger>

          <AccordionContent>
            <div className="overflow-hidden rounded-xl border border-gray-200">
              {group.attributes.map((attribute) => (
                <div
                  key={attribute.id}
                  className="grid grid-cols-[160px_1fr] items-center gap-4 border-b border-gray-100 bg-white px-4 py-3 last:border-b-0"
                >
                  <span className="text-sm text-gray-500">
                    {attribute.name}
                  </span>

                  <span className="text-sm font-medium text-gray-900">
                    {attribute.value}
                    {attribute.unit ? ` ${attribute.unit}` : ""}
                  </span>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );

  return (
    <section className="mt-12">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
          Teknik Detaylar
        </p>

        <h2 className="mt-2 text-2xl font-bold text-gray-900">
          Teknik Özellikler
        </h2>
      </div>

      <div className="mt-6 grid gap-x-10 md:grid-cols-2">
        <div>{renderGroupAccordion(leftGroups)}</div>
        <div>{renderGroupAccordion(rightGroups)}</div>
      </div>
    </section>
  );
}