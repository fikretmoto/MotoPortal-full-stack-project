import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { getBrands, getCategories, getBrandsByCategory, getCategoryAttributes } from "@/services/catalog";
import type { AttributeGroupWithAttributes, Brand, Category } from "@/services/catalog";
import { getCategorySegments, getCategoryHref } from "@/lib/category-path";
import VehicleSearchBox from "@/components/product/VehicleSearchBox";
import CategorySidebarContent from "@/components/product/CategorySidebarContent";
import MobileCategoryFilterDrawer from "@/components/product/MobileCategoryFilterDrawer";

const VEHICLE_ROOT_SLUGS = ["tasitlar"];

type Props = {
  params: Promise<{ slug: string[] }>;
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
  const { slug: segments } = await params;
  const leafSlug = segments[segments.length - 1];
  const categories = await getCategories();
  const brands = await getBrands();
  const category = categories.find((c) => c.slug === leafSlug);

  if (!category) {
    notFound();
  }

  // URL'deki yol, kategorinin gerçek yoluyla birebir aynı mı?
  // Değilse (ör. /kategori/yanlis-ust/dag-bisikleti) 404 veriyoruz,
  // böylece aynı içerik birden fazla URL'de yayınlanmaz.
  const expectedSegments = getCategorySegments(leafSlug, categories);
  // Yol kategorinin gerçek yoluyla eşleşmiyorsa (ör. eski /kategori/dag-bisikleti)
  // doğru adrese kalıcı yönlendirme yapıyoruz.
  if (expectedSegments.join("/") !== segments.join("/")) {
    permanentRedirect(getCategoryHref(leafSlug, categories));
  }

  const trail = getAncestorTrail(category, categories);

  const ownChildren = categories.filter(
    (c) => c.parent === category.id
  );
  const siblingCategories = categories.filter(
    (c) => c.parent === category.parent
  );

  const sidebarItems = ownChildren.length > 0 ? ownChildren : siblingCategories;
  const sidebarHeaderCategory = trail[0];

  const isVehicle = VEHICLE_ROOT_SLUGS.includes(trail[0].slug);

  let attributeGroups: AttributeGroupWithAttributes[] = [];
  let categoryBrands: Brand[] = [];
  if (!isVehicle) {
    try {
      const categoryAttributes = await getCategoryAttributes(leafSlug);
      attributeGroups = categoryAttributes.attribute_groups;
    } catch {
      attributeGroups = [];
    }

    categoryBrands = await getBrandsByCategory(leafSlug);
  }

  return (
    <div className="mx-auto max-w-6xl px-1.5 py-10 lg:px-6">
      <nav className="mb-4 text-sm text-fg-muted">
        <Link href="/" className="hover:text-primary">
          Anasayfa
        </Link>
        {trail.map((ancestor) => (
          <span key={ancestor.id}>
            {" / "}
            <Link
              href={getCategoryHref(ancestor.slug, categories)}
              className="hover:text-primary"
            >
              {ancestor.name}
            </Link>
          </span>
        ))}
      </nav>

      {isVehicle && (
        <VehicleSearchBox
          childCategories={ownChildren}
          brands={brands}
          allCategories={categories}
          currentCategorySlug={leafSlug}
        />
      )}

      {(sidebarItems.length > 0 || !isVehicle) && (
        <MobileCategoryFilterDrawer
          sidebarItems={sidebarItems}
          allCategories={categories}
          sidebarHeaderCategory={sidebarHeaderCategory}
          activeCategoryId={category.id}
          isVehicle={isVehicle}
          attributeGroups={attributeGroups}
          categoryBrands={categoryBrands}
        />
      )}

      <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
        {(sidebarItems.length > 0 || !isVehicle) && (
          <aside className={`hidden lg:block ${isVehicle ? "w-48 flex-none" : "w-72 flex-none"}`}>
            <CategorySidebarContent
              sidebarItems={sidebarItems}
              allCategories={categories}
              sidebarHeaderCategory={sidebarHeaderCategory}
              activeCategoryId={category.id}
              isVehicle={isVehicle}
              attributeGroups={attributeGroups}
              categoryBrands={categoryBrands}
            />
          </aside>
        )}

        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}