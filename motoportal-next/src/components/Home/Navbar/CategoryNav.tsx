"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { featuredPromo } from "@/constant/constant";
import type { CategoryNode } from "@/services/catalog";

type CategoryNavProps = {
  categoryTree: CategoryNode[];
};

const PromoMotorcycleArt = () => {
  return (
    <svg
      viewBox="0 0 460 280"
      aria-hidden="true"
      className="h-full w-full"
      fill="none"
    >
      <defs>
        <linearGradient id="bikeBody" x1="72" y1="54" x2="355" y2="218">
          <stop offset="0" stopColor="#fff" stopOpacity="0.9" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.5" />
        </linearGradient>
      </defs>
      <path
        d="M145 205L191 145H257L289 113H333L309 152L328 205H299L278 171H208L174 205H145Z"
        fill="url(#bikeBody)"
      />
      <circle cx="134" cy="214" r="40" stroke="#fff" strokeOpacity="0.6" strokeWidth="8" fill="none" />
      <circle cx="324" cy="214" r="48" stroke="#fff" strokeOpacity="0.6" strokeWidth="8" fill="none" />
    </svg>
  );
};

const ROOT_ORDER = ["tasitlar", "ekipman", "aksesuar", "bakim-ve-temizlik", "yedek-parca"];

const CategoryNav = ({ categoryTree }: CategoryNavProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeRootSlug, setActiveRootSlug] = useState(ROOT_ORDER[0]);

  const sortedRoots = [...categoryTree].sort(
    (a, b) => ROOT_ORDER.indexOf(a.slug) - ROOT_ORDER.indexOf(b.slug)
  );

  const activeRoot =
    sortedRoots.find((root) => root.slug === activeRootSlug) ?? sortedRoots[0] ?? null;

  return (
    <div
      className="relative z-40 hidden bg-[oklch(22%_0.02_50)] lg:block"
      onMouseLeave={() => setIsMenuOpen(false)}
    >
      <div className="mx-auto max-w-[1152px] px-8">
        <nav
          aria-label="Category navigation"
          className="flex min-h-[52px] items-center gap-7 text-[13px] font-bold uppercase tracking-[0.04em]"
        >
          <Link
            href="/"
            className="border-b-[3px] border-transparent py-4 text-[oklch(88%_0.01_60)] transition hover:text-white"
          >
            Ana Sayfa
          </Link>

          <div
            onMouseEnter={() => setIsMenuOpen(true)}
            onFocus={() => setIsMenuOpen(true)}
          >
            <button
              type="button"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className={`flex items-center gap-1 border-b-[3px] py-4 transition ${
                isMenuOpen
                  ? "border-[oklch(62%_0.19_35)] text-white"
                  : "border-transparent text-[oklch(88%_0.01_60)] hover:text-white"
              }`}
              aria-expanded={isMenuOpen}
            >
              <span>Kategoriler</span>
              <ChevronDown
                className={`h-4 w-4 transition ${isMenuOpen ? "rotate-180" : ""}`}
              />
            </button>
          </div>

          <Link
            href="#blog"
            className="border-b-[3px] border-transparent py-4 text-[oklch(88%_0.01_60)] transition hover:text-white"
          >
            Blog
          </Link>
        </nav>
      </div>

      {isMenuOpen ? (
        <div className="absolute left-0 right-0 border-b border-[oklch(90%_0.006_70)] bg-white shadow-[0_8px_16px_-8px_rgba(0,0,0,0.15)]">
          <div className="mx-auto flex max-w-[1152px] overflow-hidden">
            {/* SOL: dikey kök kategori listesi */}
            <div className="w-[220px] shrink-0 border-r border-[oklch(90%_0.006_70)] bg-[oklch(97%_0.006_70)] py-2">
              {sortedRoots.map((root) => {
                const isActive = root.slug === activeRootSlug;

                return (
                  <button
                    key={root.slug}
                    type="button"
                    onMouseEnter={() => setActiveRootSlug(root.slug)}
                    className={`flex w-full items-center justify-between px-4 py-3 text-left text-[14px] font-bold transition ${
                      isActive
                        ? "bg-[oklch(62%_0.19_35)] text-white"
                        : "text-[oklch(35%_0.01_60)] hover:bg-white"
                    }`}
                  >
                    <span>{root.name}</span>
                    <ChevronDown className="h-4 w-4 -rotate-90" />
                  </button>
                );
              })}
            </div>

            {/* SAĞ: aktif kökün alt kategorileri */}
            <div className="grid flex-1 grid-cols-4 gap-8 p-7">
              {activeRoot?.children.map((section) => (
                <section key={section.slug}>
                  <Link
                    href={`/kategori/${section.slug}`}
                    className="inline-block border-b-[3px] border-[oklch(62%_0.19_35)] pb-2 text-[13px] font-black uppercase tracking-[0.02em] text-[oklch(20%_0.01_60)] hover:text-[oklch(62%_0.19_35)]"
                  >
                    {section.name}
                  </Link>

                  {section.children.length > 0 ? (
                    <div className="mt-3 flex flex-col gap-2">
                      {section.children.map((leaf) => (
                        <Link
                          key={leaf.slug}
                          href={`/kategori/${leaf.slug}`}
                          className="text-[13px] font-semibold text-[oklch(45%_0.02_60)] transition hover:text-[oklch(20%_0.01_60)]"
                        >
                          {leaf.name}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </section>
              ))}

              <aside className="col-span-1 flex flex-col justify-between rounded-md bg-[oklch(62%_0.19_35)] p-5">
                <div>
                  <p className="text-base font-black text-white">
                    {featuredPromo.eyebrow}
                  </p>
                  <p className="mt-1.5 text-[13px] font-semibold text-[oklch(95%_0.02_35)]">
                    {featuredPromo.description}
                  </p>
                </div>
                <div className="relative mt-4 h-16 opacity-70">
                  <PromoMotorcycleArt />
                </div>
                <Link
                  href={featuredPromo.ctaHref}
                  className="mt-3 text-[13px] font-extrabold uppercase text-white"
                >
                  {featuredPromo.ctaLabel} →
                </Link>
              </aside>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default CategoryNav;