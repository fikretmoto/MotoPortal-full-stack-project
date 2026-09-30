import { getCategories } from "@/services/catalog";
import TagPillNav from "@/components/product/TagPillNav";
import TagCategoryList from "@/components/product/TagCategoryList";
import MobileTagCategoryDrawer from "@/components/product/MobileTagCategoryDrawer";

export default async function TagLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await getCategories();
  const topLevelCategories = categories.filter(
    (category) => category.parent === null
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-1.5 pt-10 lg:px-6">
        <TagPillNav />
      </div>

      <div className="mx-auto max-w-6xl px-1.5 py-10 lg:px-6">
        <MobileTagCategoryDrawer categories={topLevelCategories} />

        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
          <aside className="hidden w-48 flex-none lg:block">
            <TagCategoryList categories={topLevelCategories} />
          </aside>

          <main className="flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}