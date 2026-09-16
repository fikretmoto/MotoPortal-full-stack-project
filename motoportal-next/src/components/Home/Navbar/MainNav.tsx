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
    <>
      {/* MOBİL — sadece arama, ikonlar yok */}
      <div className="border-b border-[oklch(90%_0.006_70)] bg-white px-4 py-3 sm:px-6 lg:hidden">
        <form
          role="search"
          className="flex items-center overflow-hidden rounded-xl border-2 border-[oklch(20%_0.01_60)] bg-white"
        >
          <input
            type="search"
            placeholder={topBarContent.searchPlaceholder}
            className="h-11 min-w-0 flex-1 bg-white px-4 text-sm text-[oklch(20%_0.01_60)] outline-none placeholder:text-[oklch(55%_0.01_60)]"
          />
          <button
            type="button"
            aria-label={topBarContent.searchButtonLabel}
            className="inline-flex h-11 w-12 items-center justify-center bg-[oklch(62%_0.19_35)] text-white transition hover:bg-[oklch(56%_0.19_35)]"
          >
            <Search className="h-4 w-4" />
          </button>
        </form>
      </div>

      {/* MASAÜSTÜ — arama + Favorilerim/Karşılaştır/Giriş Yap */}
      <div className="hidden border-b border-[oklch(90%_0.006_70)] bg-white lg:block">
        <div className="mx-auto grid max-w-[1560px] grid-cols-[1fr_minmax(420px,680px)_1fr] items-center gap-6 px-4 py-5 sm:px-6 lg:px-8">
          <div aria-hidden="true" />

          <form
            role="search"
            className="flex items-center overflow-hidden rounded-xl border-2 border-[oklch(20%_0.01_60)] bg-white"
          >
            <input
              type="search"
              placeholder={topBarContent.searchPlaceholder}
              className="h-13 min-w-0 flex-1 bg-white px-5 text-base text-[oklch(20%_0.01_60)] outline-none placeholder:text-[oklch(55%_0.01_60)]"
            />
            <button
              type="button"
              aria-label={topBarContent.searchButtonLabel}
              className="inline-flex h-13 w-14 items-center justify-center bg-[oklch(62%_0.19_35)] text-white transition hover:bg-[oklch(56%_0.19_35)]"
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
                  className="group flex min-w-[74px] flex-col items-center gap-1 text-center text-[oklch(35%_0.01_60)] transition hover:text-[oklch(62%_0.19_35)]"
                >
                  <span className="relative inline-flex h-8 w-8 items-center justify-center">
                    <Icon className="h-5 w-5" />
                    {action.badge ? (
                      <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[oklch(62%_0.19_35)] px-1 text-[10px] font-bold text-white">
                        {action.badge}
                      </span>
                    ) : null}
                  </span>

                  <span className="text-sm font-medium tracking-tight text-[oklch(35%_0.01_60)] transition group-hover:text-[oklch(62%_0.19_35)]">
                    {action.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default MainNav;