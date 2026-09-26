import Link from "next/link";
import type { AttributeGroupWithAttributes, Brand, Category } from "@/services/catalog";
import CategoryFilterSidebar from "./CategoryFilterSidebar";

type Props = {
  sidebarItems: Category[];
  sidebarHeaderCategory: Category;
  activeCategoryId: number;
  isVehicle: boolean;
  attributeGroups: AttributeGroupWithAttributes[];
  categoryBrands: Brand[];
};

export default function CategorySidebarContent({
  sidebarItems,
  sidebarHeaderCategory,
  activeCategoryId,
  isVehicle,
  attributeGroups,
  categoryBrands,
}: Props) {
  return (
    <>
      {sidebarItems.length > 0 && (
        <>
          <Link
            href={`/kategori/${sidebarHeaderCategory.slug}`}
            className="mb-3 block text-sm font-bold uppercase text-foreground hover:text-primary"
          >
            {sidebarHeaderCategory.name}
          </Link>
          <nav className="flex flex-col gap-2">
            {sidebarItems.map((item) => (
              <Link
                key={item.id}
                href={`/kategori/${item.slug}`}
                className={
                  item.id === activeCategoryId
                    ? "text-sm font-bold text-primary"
                    : "text-sm text-fg-muted hover:text-primary"
                }
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </>
      )}

      {!isVehicle && (
        <CategoryFilterSidebar
          attributeGroups={attributeGroups}
          brands={categoryBrands}
        />
      )}
    </>
  );
}
