import Link from "next/link";
import { Menu } from "lucide-react";

import {
  categoryMenuSections,
  mainMenuItems,
  mobileNavContent,
} from "@/constant/constant";

const MobileNav = () => {
  return (
    <div className="border-b border-neutral-200 md:hidden">
      <div className="mx-auto max-w-6xl px-6 py-4">
        <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-neutral-900">
          <Menu className="h-4 w-4" />
          <span>{mobileNavContent.label}</span>
        </div>

        <nav aria-label="Mobile main navigation" className="mt-4 flex flex-col gap-3">
          {mainMenuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-neutral-800"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-6 space-y-5">
          {categoryMenuSections.map((section) => (
            <div key={section.title}>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
                {section.title}
              </p>

              <div className="mt-2 flex flex-wrap gap-3">
                {section.items.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="text-sm text-neutral-700"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobileNav;
