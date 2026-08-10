import Link from "next/link";

import { mainMenuItems } from "@/constant/constant";

const MainNav = () => {
  return (
    <nav
      aria-label="Main navigation"
      className="hidden border-b border-neutral-200 md:block"
    >
      <div className="mx-auto flex max-w-6xl items-center gap-6 px-6 py-4">
        {mainMenuItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="text-sm font-medium text-neutral-800 transition hover:text-neutral-950"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default MainNav;
