import Link from "next/link";
import { ChevronDown } from "lucide-react";

import { categoryMenuSections } from "@/constant/constant";

const CategoryNav = () => {
  return (
    <nav
      aria-label="Category navigation"
      className="hidden border-b border-neutral-200 md:block"
    >
      <div className="mx-auto flex max-w-6xl items-center gap-8 px-6 py-4">
        {categoryMenuSections.map((section) => (
          <div key={section.title} className="group relative">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-700 transition hover:text-neutral-950"
            >
              <span>{section.title}</span>
              <ChevronDown className="h-4 w-4 text-neutral-400" />
            </button>

            <div className="absolute left-0 top-full z-20 hidden pt-3 group-hover:block group-focus-within:block">
              <div className="min-w-52 rounded-2xl border border-neutral-200 bg-white p-3">
                <div className="flex flex-col gap-1">
                  {section.items.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="rounded-xl px-3 py-2 text-sm text-neutral-700 transition hover:bg-neutral-100 hover:text-neutral-950"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </nav>
  );
};

export default CategoryNav;
