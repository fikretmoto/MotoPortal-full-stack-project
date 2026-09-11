import Link from "next/link";
import { notFound } from "next/navigation";
import { getBrands, getCategories, getBrandsByCategory, getCategoryAttributes } from "@/services/catalog";
import type { AttributeGroupWithAttributes, Brand, Category } from "@/services/catalog";
import VehicleSearchBox from "@/components/product/VehicleSearchBox";
import CategoryFilterSidebar from "@/components/product/CategoryFilterSidebar";


const VEHICLE_ROOT_SLUGS = ["tasitlar"];

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
  const brands = await getBrands();
  const category = categories.find((c) => c.slug === slug);

  if (!category) {
    notFound();
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
      const categoryAttributes = await getCategoryAttributes(slug);
      attributeGroups = categoryAttributes.attribute_groups;
    } catch {
      attributeGroups = [];
    }

    categoryBrands = await getBrandsByCategory(slug);
  }

  
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


   {isVehicle && (
    <VehicleSearchBox childCategories={ownChildren} brands={brands} />
  )}

       <div className="flex gap-8">
        {(sidebarItems.length > 0 || !isVehicle) && (
  <aside className={isVehicle ? "w-48 flex-none" : "w-72 flex-none"}>
    {sidebarItems.length > 0 && (
      <>
        <Link
          href={`/kategori/${sidebarHeaderCategory.slug}`}
          className="mb-3 block text-sm font-bold uppercase text-gray-900 hover:text-blue-700"
        >
          {sidebarHeaderCategory.name}
        </Link>
        <nav className="flex flex-col gap-2">
          {sidebarItems.map((item) => (
            <Link
              key={item.id}
              href={`/kategori/${item.slug}`}
              className={
                item.id === category.id
                  ? "text-sm font-bold text-blue-700"
                  : "text-sm text-gray-700 hover:text-blue-700"
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
  </aside>
)}

        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}