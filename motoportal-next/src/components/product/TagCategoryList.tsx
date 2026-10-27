import Link from "next/link";
import type { Category } from "@/services/catalog";
import { getCategoryHref } from "@/lib/category-path";

type Props = {
  categories: Category[];
};

export default function TagCategoryList({ categories }: Props) {
  return (
    <>
      <h2 className="mb-3 text-sm font-bold uppercase text-foreground">
        Tüm Kategoriler
      </h2>
      <nav className="flex flex-col gap-2">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={getCategoryHref(category.slug, categories)}
            className="text-sm text-fg-muted hover:text-primary"
          >
            {category.name}
          </Link>
        ))}
      </nav>
    </>
  );
}