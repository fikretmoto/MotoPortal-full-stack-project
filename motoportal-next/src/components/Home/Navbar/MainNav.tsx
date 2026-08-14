import Link from "next/link";
import {
  Heart,
  Scale,
  Search,
  UserRound,
} from "lucide-react";

import {
  headerActions,
  topBarContent,
} from "@/constant/constant";

const iconMap = {
  heart: Heart,
  scale: Scale,
  user: UserRound,
};

const MainNav = () => {
  return (
    <div className="hidden border-b border-white/10 bg-[#050505] lg:block">
      <div className="mx-auto grid max-w-[1560px] grid-cols-[1fr_minmax(420px,680px)_1fr] items-center gap-6 px-4 py-5 sm:px-6 lg:px-8">
        <div aria-hidden="true" />

        <form
          role="search"
          className="flex items-center overflow-hidden rounded-xl border border-white/10 bg-white shadow-[0_10px_24px_rgba(0,0,0,0.18)]"
        >
          <input
            type="search"
            placeholder={topBarContent.searchPlaceholder}
            className="h-13 min-w-0 flex-1 bg-white px-5 text-base text-neutral-900 outline-none placeholder:text-neutral-500"
          />
          <button
            type="button"
            aria-label={topBarContent.searchButtonLabel}
            className="inline-flex h-13 w-14 items-center justify-center bg-[#e10600] text-white transition hover:bg-[#c90500]"
          >
            <Search className="h-5 w-5" />
          </button>
        </form>

        <div className="flex items-center justify-end gap-7">
          {headerActions.map((action) => {
            const Icon = iconMap[action.icon];

            return (
              <Link
                key={action.label}
                href={action.href}
                className="group flex min-w-[74px] flex-col items-center gap-1 text-center text-white/88 transition hover:text-white"
              >
                <span className="relative inline-flex h-8 w-8 items-center justify-center">
                  <Icon className="h-5 w-5" />
                  {action.badge ? (
                    <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[#e10600] px-1 text-[10px] font-bold text-white">
                      {action.badge}
                    </span>
                  ) : null}
                </span>

                <span className="text-sm font-medium tracking-tight text-white/88 transition group-hover:text-white">
                  {action.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MainNav;
