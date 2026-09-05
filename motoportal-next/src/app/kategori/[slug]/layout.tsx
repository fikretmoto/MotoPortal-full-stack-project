import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategories } from "@/services/catalog";
import type { Category } from "@/services/catalog";

type Props = {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
};

function getAncestorTrail(
  category: Category,
  all: Category[]
): Category[] {
  const trail: Category[] = [category];
  let current = category;

  while (current.parent !== null) {
    const parent = all.find((c) => c.id === current.parent);
    if (!parent) break;
    trail.unshift(parent);
    current = parent;
  }

  return trail;
}

export default async function CategorySlugLayout({
  params,
  children,
}: Props) {
  const { slug } = await params;
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === slug);

  if (!category) {
    notFound();
  }

  const trail = getAncestorTrail(category, categories);
  const childCategories = categories.filter(
    (c) => c.parent === category.id
  );

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <nav className="mb-4 text-sm text-gray-500">
        <span>Anasayfa</span>
        {trail.map((ancestor) => (
          <span key={ancestor.id}>
            {" / "}
            <Link
              href={`/kategori/${ancestor.slug}`}
              className="hover:text-blue-700"
            >
              {ancestor.name}
            </Link>
          </span>
        ))}
      </nav>

      <div className="flex gap-8">
        {childCategories.length > 0 && (
          <aside className="w-48 flex-none">
            <h2 className="mb-3 text-sm font-bold uppercase text-gray-900">
              {category.name}
            </h2>
            <nav className="flex flex-col gap-2">
              {childCategories.map((child) => (
                <Link
                  key={child.id}
                  href={`/kategori/${child.slug}`}
                  className="text-sm text-gray-700 hover:text-blue-700"
                >
                  {child.name}
                </Link>
              ))}
            </nav>
          </aside>
        )}

        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}