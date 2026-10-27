import Link from "next/link";
import type { AttributeGroupWithAttributes, Brand, Category } from "@/services/catalog";
import { getCategoryHref } from "@/lib/category-path";
import CategoryFilterSidebar from "./CategoryFilterSidebar";

type Props = {
  sidebarItems: Category[];
  sidebarHeaderCategory: Category;
  // Tüm kategori listesi, tam yolların hesaplanabilmesi için
  allCategories: Category[];
  activeCategoryId: number;
  isVehicle: boolean;
  attributeGroups: AttributeGroupWithAttributes[];
  categoryBrands: Brand[];
};

export default function CategorySidebarContent({
  sidebarItems,
  sidebarHeaderCategory,
  allCategories,
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
            href={getCategoryHref(sidebarHeaderCategory.slug, allCategories)}
            className="mb-3 block text-sm font-bold uppercase text-foreground hover:text-primary"
          >
            {sidebarHeaderCategory.name}
          </Link>
          <nav className="flex flex-col gap-2">
            {sidebarItems.map((item) => (
              <Link
                key={item.id}
                href={getCategoryHref(item.slug, allCategories)}
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