"use client";

import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";
import { useState } from "react";

import {
  headerActions,
  mainMenuItems,
  mobileMenuSections,
  topBarContent,
} from "@/constant/constant";

type MobileNavProps = {
  showNav: boolean;
  toggleNav: () => void;
  closeNav: () => void;
};

const MobileNav = ({
  showNav,
  toggleNav,
  closeNav,
}: MobileNavProps) => {
  const [openSections, setOpenSections] = useState<string[]>([]);

  const toggleSection = (sectionTitle: string) => {
    setOpenSections((previousState) =>
      previousState.includes(sectionTitle)
        ? previousState.filter((title) => title !== sectionTitle)
        : [...previousState, sectionTitle],
    );
  };

 const closeMenu = () => {
  closeNav();
  setOpenSections([]);
};
  return (
    <div className="border-b border-white/10 bg-[#050505] lg:hidden">
      <div className="mx-auto max-w-[1560px] px-4 py-4 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            aria-expanded={showNav}
            aria-controls="mobile-navigation-panel"
            onClick={toggleNav}
            className="inline-flex items-center gap-2 rounded-full border border-white/12 px-4 py-2 text-sm font-semibold uppercase tracking-[0.14em] text-white"
          >
            <Menu className="h-4 w-4" />
            Menü
          </button>

          <div className="text-right">
            <p className="text-sm font-black uppercase tracking-tight text-white">
              MotoPortal
            </p>
            <p className="text-xs text-white/55">
              {topBarContent.brandSuffix}
            </p>
          </div>
        </div>

        {showNav ? (
          <div
            id="mobile-navigation-panel"
            className="mt-4 overflow-hidden rounded-[1.8rem] border border-white/10 bg-[#101012] text-white shadow-[0_18px_50px_rgba(0,0,0,0.35)]"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
              <div>
                <p className="text-base font-semibold">Kategoriler</p>
                <p className="text-sm text-white/60">
                  Alt kategorilere hızlı erişim
                </p>
              </div>

              <button
                type="button"
                onClick={closeMenu}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/12 text-white/82 transition hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>


<div className="border-b border-white/10 px-4 py-4">
  <div className="flex gap-3">
    {mainMenuItems
      .filter((item) => !item.isMegaTrigger)
      .map((item) => (
        <Link
          key={item.label}
          href={item.href}
          onClick={closeMenu}
          className="rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-white/85 transition hover:bg-white/5 hover:text-white"
        >
          {item.label}
        </Link>
      ))}
  </div>
</div>
            <div className="border-b border-white/10 px-4 py-4">
              <div className="grid grid-cols-3 gap-3">
                {headerActions.map((action) => (
                  <Link
                    key={action.label}
                    href={action.href}
                    onClick={closeMenu}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-3 text-center text-xs font-medium text-white/82"
                  >
                    {action.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="max-h-[72vh] overflow-y-auto px-3 py-3">
              <div className="space-y-3">
                {mobileMenuSections.map((section) => {
                  const isOpen = openSections.includes(section.title);

                  return (
                    <div
                      key={section.title}
                      className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]"
                    >
                      <button
                        type="button"
                        onClick={() => toggleSection(section.title)}
                        className="flex w-full items-center justify-between px-4 py-4 text-left"
                      >
                        <span className="text-sm font-semibold uppercase tracking-[0.08em] text-white">
                          {section.title}
                        </span>
                        <ChevronDown
                          className={`h-4 w-4 text-white/68 transition ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {isOpen ? (
                        <div className="border-t border-white/10 px-4 py-3">
                          <div className="space-y-2">
                            {section.items.map((item) => (
                              <Link
                                key={item.label}
                                href={item.href}
                                onClick={closeMenu}
                                className="flex items-center justify-between rounded-xl px-3 py-3 text-sm text-white/86 transition hover:bg-white/6 hover:text-white"
                              >
                                <span>{item.label}</span>
                                {item.badge ? (
                                  <span className="rounded-md bg-[#e10600] px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white">
                                    {item.badge}
                                  </span>
                                ) : null}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default MobileNav;
