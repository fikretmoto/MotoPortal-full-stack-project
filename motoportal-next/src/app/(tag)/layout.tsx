import Link from "next/link";
import { getCategories } from "@/services/catalog";
import TagPillNav from "@/components/product/TagPillNav";

export default async function TagLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await getCategories();

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-6 pt-10">
        <TagPillNav />
      </div>

      <div className="mx-auto flex max-w-6xl gap-8 px-6 py-10">
        <aside className="w-48 flex-none">
          <h2 className="mb-3 text-sm font-bold uppercase text-foreground">
            Tüm Kategoriler
          </h2>
                    <nav className="flex flex-col gap-2">
            {categories
              .filter((category) => category.parent === null)
              .map((category) => (
                <Link
                  key={category.id}
                  href={`/kategori/${category.slug}`}
                  className="text-sm text-fg-muted hover:text-primary"
                >
                  {category.name}
                </Link>
              ))}
          </nav>
        </aside>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}