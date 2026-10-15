import Link from "next/link";
import {
  Heart,
  Scale,
} from "lucide-react";

import {
  headerActions,
} from "@/constant/constant";
import type { CurrentUser } from "@/services/auth";
import UserMenu from "./UserMenu";
import NavSearchForm from "./NavSearchForm";

const iconMap = {
  heart: Heart,
  scale: Scale,
};

type MainNavProps = {
  user: CurrentUser | null;
};

const MainNav = ({ user }: MainNavProps) => {
  return (
    <>
      {/* MOBİL — sadece arama, ikonlar yok */}
      <div className="border-b border-[oklch(90%_0.006_70)] bg-white px-4 py-3 sm:px-6 lg:hidden">
        <NavSearchForm variant="mobile" />
      </div>

      {/* MASAÜSTÜ — arama + Favorilerim/Karşılaştır/Giriş Yap */}
      <div className="hidden border-b border-[oklch(90%_0.006_70)] bg-white lg:block">
        <div className="mx-auto grid max-w-[1560px] grid-cols-[1fr_minmax(420px,680px)_1fr] items-center gap-6 px-4 py-5 sm:px-6 lg:px-8">
          <div aria-hidden="true" />

          <NavSearchForm variant="desktop" />

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

            <UserMenu user={user} />
          </div>
        </div>
      </div>
    </>
  );
};

export default MainNav;