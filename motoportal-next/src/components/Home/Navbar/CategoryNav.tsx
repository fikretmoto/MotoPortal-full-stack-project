import Link from "next/link";

import { categoryMenuSections } from "@/constant/constant";

const CategoryNav = () => {
  return (
    <nav
      aria-label="Category navigation"
      className="hidden border-b border-neutral-200 md:block"
    >
      <div className="mx-auto flex max-w-6xl flex-wrap gap-8 px-6 py-4">
        {categoryMenuSections.map((section) => (
          <div key={section.title} className="min-w-40">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
              {section.title}
            </p>

            <div className="mt-3 flex flex-col gap-2">
              {section.items.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-sm text-neutral-700 transition hover:text-neutral-950"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </nav>
  );
};

export default CategoryNav;
