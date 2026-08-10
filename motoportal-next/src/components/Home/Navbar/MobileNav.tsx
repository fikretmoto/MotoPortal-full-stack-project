"use client";

import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";
import { useState } from "react";

import {
  categoryMenuSections,
  mainMenuItems,
  mobileNavContent,
} from "@/constant/constant";

const MobileNav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openSections, setOpenSections] = useState<string[]>([]);

  const toggleMenu = () => {
    setIsMenuOpen((previousState) => !previousState);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setOpenSections([]);
  };

  const toggleSection = (sectionTitle: string) => {
    setOpenSections((previousState) =>
      previousState.includes(sectionTitle)
        ? previousState.filter((title) => title !== sectionTitle)
        : [...previousState, sectionTitle],
    );
  };

  return (
    <div className="border-b border-neutral-200 md:hidden">
      <div className="mx-auto max-w-6xl px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation-panel"
            onClick={toggleMenu}
            className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-neutral-900"
          >
            <Menu className="h-4 w-4" />
            <span>{mobileNavContent.label}</span>
          </button>

          {isMenuOpen && (
            <button
              type="button"
              onClick={closeMenu}
              className="inline-flex items-center gap-2 text-sm font-medium text-neutral-700"
            >
              <X className="h-4 w-4" />
              <span>Kapat</span>
            </button>
          )}
        </div>

        {isMenuOpen && (
          <div
            id="mobile-navigation-panel"
            className="mt-5 space-y-6 rounded-2xl border border-neutral-200 bg-white p-4"
          >
            <nav
              aria-label="Mobile main navigation"
              className="flex flex-col gap-3"
            >
              {mainMenuItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={closeMenu}
                  className="text-sm font-medium text-neutral-800"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="space-y-3">
              {categoryMenuSections.map((section) => {
                const isSectionOpen = openSections.includes(section.title);

                return (
                  <div
                    key={section.title}
                    className="rounded-2xl border border-neutral-200"
                  >
                    <button
                      type="button"
                      onClick={() => toggleSection(section.title)}
                      className="flex w-full items-center justify-between px-4 py-3 text-left"
                    >
                      <span className="text-sm font-semibold text-neutral-900">
                        {section.title}
                      </span>

                      <ChevronDown
                        className={`h-4 w-4 text-neutral-500 transition ${
                          isSectionOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isSectionOpen && (
                      <div className="border-t border-neutral-200 px-4 py-3">
                        <div className="flex flex-col gap-3">
                          {section.items.map((item) => (
                            <Link
                              key={item.label}
                              href={item.href}
                              onClick={closeMenu}
                              className="text-sm text-neutral-700"
                            >
                              {item.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileNav;
