"use client";

import { useMemo, useState } from "react";

import type { ProductAttribute } from "@/services/catalog";

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

  const [activeGroupSlug, setActiveGroupSlug] = useState(
    groups[0]?.slug ?? ""
  );

  if (groups.length === 0) {
    return null;
  }

  const activeGroup =
    groups.find(
      (group) => group.slug === activeGroupSlug
    ) ?? groups[0];

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

      {/* GRUP BUTONLARI */}
      <div className="mt-6 flex flex-wrap gap-3">
        {groups.map((group) => {
          const isActive =
            group.slug === activeGroup.slug;

          return (
            <button
              key={group.slug}
              type="button"
              onClick={() =>
                setActiveGroupSlug(group.slug)
              }
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                isActive
                  ? "border-gray-900 bg-gray-900 text-white"
                  : "border-gray-200 bg-white text-gray-700 hover:border-gray-400"
              }`}
            >
              {group.name}
            </button>
          );
        })}
      </div>

      {/* SEÇİLİ GRUBUN ÖZELLİKLERİ */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {activeGroup.name}
          </h3>
        </div>

        <div>
          {activeGroup.attributes.map(
            (attribute) => (
              <div
                key={attribute.id}
                className="grid grid-cols-2 gap-6 border-b border-gray-100 px-6 py-4 last:border-b-0"
              >
                <span className="text-sm text-gray-500">
                  {attribute.name}
                </span>

                <span className="text-right font-medium text-gray-900">
                  {attribute.value}
                  {attribute.unit
                    ? ` ${attribute.unit}`
                    : ""}
                </span>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}