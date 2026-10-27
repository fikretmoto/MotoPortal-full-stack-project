type CategoryLike = {
  slug: string;
  parent_slug?: string | null;
};

// Kategorinin URL segmentlerini döndürür.
// Kök kategori URL'den çıkarılır (seçenek B):
// "Taşıtlar → Motosiklet → Adventure" → ["motosiklet", "adventure"]
// Kök kategorinin kendisi ise tek segment olarak kalır: ["aksesuar"]
export function getCategorySegments(
  slug: string,
  categories: CategoryLike[]
): string[] {
  const bySlug = new Map(categories.map((c) => [c.slug, c]));
  const chain: string[] = [];

  let current = bySlug.get(slug);
  while (current) {
    chain.unshift(current.slug);
    current = current.parent_slug
      ? bySlug.get(current.parent_slug)
      : undefined;
  }

  return chain.length > 1 ? chain.slice(1) : chain;
}

export function getCategoryHref(
  slug: string,
  categories: CategoryLike[]
): string {
  return `/kategori/${getCategorySegments(slug, categories).join("/")}`;
}