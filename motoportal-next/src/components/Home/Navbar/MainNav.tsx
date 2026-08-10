import Link from "next/link";
import { Search } from "lucide-react";

import { mainMenuItems, mainNavContent } from "@/constant/constant";

const MainNav = () => {
  return (
    <nav
      aria-label="Main navigation"
      className="hidden border-b border-neutral-200 md:block"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-[auto_1fr_auto] items-center gap-8 px-6 py-5">
        <Link
          href="/"
          className="text-xl font-semibold tracking-tight text-neutral-950"
        >
          {mainNavContent.brandName}
        </Link>

        <div className="flex items-center justify-center gap-8">
          {mainMenuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-neutral-700 transition hover:text-neutral-950"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <button
          type="button"
          aria-label={mainNavContent.searchLabel}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 text-neutral-700 transition hover:border-neutral-300 hover:text-neutral-950"
        >
          <Search className="h-4 w-4" />
        </button>
      </div>
    </nav>
  );
};

export default MainNav;
