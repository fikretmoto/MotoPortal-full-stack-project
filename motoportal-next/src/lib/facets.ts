// Backend'in ProductFilter.filter_facets ile ayni format:
// "attribute-slug:deger1|deger2,baska-attribute:deger3"
// Hem Ekipman kategori sidebar'i hem marka sayfasi bu formati
// kullaniyor -- tek yerde parse/stringify ki ikisi sapmasin.

export type FacetSelections = Record<string, string[]>;

export function parseFacets(raw: string | null | undefined): FacetSelections {
  const result: FacetSelections = {};

  if (!raw) {
    return result;
  }

  for (const group of raw.split(",")) {
    const [attributeSlug, valuesPart] = group.split(":");
    if (!attributeSlug || !valuesPart) {
      continue;
    }

    result[attributeSlug] = valuesPart.split("|").filter(Boolean);
  }

  return result;
}

export function stringifyFacets(facets: FacetSelections): string {
  return Object.entries(facets)
    .filter(([, values]) => values.length > 0)
    .map(([attributeSlug, values]) => `${attributeSlug}:${values.join("|")}`)
    .join(",");
}
