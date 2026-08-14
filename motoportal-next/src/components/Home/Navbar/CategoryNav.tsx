"use client";

import Link from "next/link";
import {
  Bike,
  BikeIcon,
  ChevronDown,
  Settings,
  ShieldAlert,
  SquareM,
  Zap,
} from "lucide-react";
import { useState } from "react";

import {
  featuredPromo,
  mainMenuItems,
  megaMenuSections,
  megaMenuSupplementaryLinks,
  popularBrandStripItems,
} from "@/constant/constant";

const iconMap = {
  bike: Bike,
  scooter: SquareM,
  zap: Zap,
  buggy: ShieldAlert,
  bicycle: BikeIcon,
  settings: Settings,
} as const;

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
          <stop offset="0" stopColor="#ff554f" />
          <stop offset="0.45" stopColor="#ff1d14" />
          <stop offset="1" stopColor="#8f0909" />
        </linearGradient>
        <linearGradient id="bikeDark" x1="116" y1="42" x2="332" y2="244">
          <stop offset="0" stopColor="#2a2d35" />
          <stop offset="1" stopColor="#0c0d10" />
        </linearGradient>
        <radialGradient id="bikeGlow" cx="0" cy="0" r="1" gradientTransform="translate(279 135) rotate(124.538) scale(148.541 189.377)">
          <stop stopColor="#ff2a20" stopOpacity="0.45" />
          <stop offset="1" stopColor="#ff2a20" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="286" cy="156" rx="136" ry="94" fill="url(#bikeGlow)" />

      <circle cx="134" cy="214" r="48" fill="#090a0c" stroke="#8a0b0b" strokeWidth="10" />
      <circle cx="134" cy="214" r="25" fill="#1d1f24" stroke="#d7d7d8" strokeWidth="4" />

      <circle cx="324" cy="214" r="56" fill="#090a0c" stroke="#8a0b0b" strokeWidth="12" />
      <circle cx="324" cy="214" r="28" fill="#1d1f24" stroke="#d7d7d8" strokeWidth="4" />

      <path
        d="M145 205L191 145H257L289 113H333L309 152L328 205H299L278 171H208L174 205H145Z"
        fill="url(#bikeBody)"
      />
      <path
        d="M191 145L240 104H324L289 145H191Z"
        fill="url(#bikeDark)"
      />
      <path
        d="M210 103H296L319 81H246L210 103Z"
        fill="url(#bikeBody)"
      />
      <path
        d="M240 84L274 52H335L307 84H240Z"
        fill="#13151a"
      />
      <path
        d="M303 89H333L353 122H323L303 89Z"
        fill="#20232b"
      />
      <path
        d="M200 146L173 116H140L165 155L200 146Z"
        fill="#20232b"
      />
      <path
        d="M172 116L192 95L210 103L191 145L172 116Z"
        fill="#111319"
      />
      <path
        d="M287 114L307 83L353 83L334 114H287Z"
        fill="#2c313b"
      />
      <path
        d="M213 166H277L292 196H199L213 166Z"
        fill="#101216"
      />
      <path
        d="M336 117H354L366 132H345L336 117Z"
        fill="#ff3a30"
      />
      <path
        d="M154 111L116 87"
        stroke="#8f939b"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path
        d="M333 86L359 56"
        stroke="#8f939b"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path
        d="M203 145L179 205"
        stroke="#8f939b"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M292 145L316 205"
        stroke="#8f939b"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M324 158L353 121"
        stroke="#aeb3bb"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M95 214H67"
        stroke="#aeb3bb"
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
  );
};

const CategoryNav = () => {
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);

  return (
    <div
      className="relative z-40 hidden border-b border-white/10 bg-[#0c0c0f] lg:block"
      onMouseLeave={() => setIsMegaMenuOpen(false)}
    >
      <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-8">
        <nav
          aria-label="Category navigation"
          className="flex min-h-[58px] items-center justify-between gap-1"
        >
          {mainMenuItems.map((item) => {
            const isMegaTrigger = Boolean(item.isMegaTrigger);
            const isActive = item.isCurrent && isMegaMenuOpen;

            return (
              <div key={item.label} className="relative">
                <Link
                  href={item.href}
                  onMouseEnter={() => {
                    if (isMegaTrigger) {
                      setIsMegaMenuOpen(true);
                    } else {
                      setIsMegaMenuOpen(false);
                    }
                  }}
                  onFocus={() => {
                    if (isMegaTrigger) {
                      setIsMegaMenuOpen(true);
                    }
                  }}
                  onClick={(event) => {
                    if (isMegaTrigger) {
                      event.preventDefault();
                      setIsMegaMenuOpen((previousState) => !previousState);
                    }
                  }}
                  className={`inline-flex h-[58px] min-w-0 items-center justify-center gap-1 whitespace-nowrap px-1 text-[10px] font-semibold tracking-tight transition xl:px-3 xl:text-[13px] 2xl:px-4 2xl:text-[15px] ${
                    isActive
                      ? "bg-[#e10600] text-white"
                      : "text-white/88 hover:bg-white/6 hover:text-white"
                  }`}
                  aria-expanded={isMegaTrigger ? isMegaMenuOpen : undefined}
                >
                  <span>{item.label}</span>
                  {item.hasCaret ? (
                    <ChevronDown
                      className={`h-4 w-4 transition ${
                        isActive ? "rotate-180" : ""
                      }`}
                    />
                  ) : null}
                </Link>
              </div>
            );
          })}
        </nav>
      </div>

      {isMegaMenuOpen ? (
        <div className="border-t border-white/10 bg-[linear-gradient(180deg,#121215_0%,#0a0a0c_100%)]">
          <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-[repeat(6,minmax(0,1fr))_320px] overflow-hidden border-x border-b border-white/10 shadow-[0_24px_60px_rgba(0,0,0,0.34)]">
              {megaMenuSections.map((section, index) => {
                const Icon = iconMap[section.icon];
                const sectionClassName =
                  index < megaMenuSections.length - 1
                    ? "border-r border-white/10 px-4 py-4 xl:px-5"
                    : "px-4 py-4 xl:px-5";

                return (
                  <section key={section.title} className={sectionClassName}>
                    <div className="flex items-center gap-2.5">
                      <Icon className="h-4 w-4 text-[#ff2a20]" />
                      <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-white">
                        {section.title}
                      </h3>
                    </div>

                    <div className="mt-4 space-y-2.5">
                      {section.items.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          className="flex items-center gap-2 text-[14px] leading-6 text-white/84 transition hover:text-white"
                        >
                          <span>{item.label}</span>
                          {item.badge ? (
                            <span className="rounded-md bg-[#e10600] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] text-white">
                              {item.badge}
                            </span>
                          ) : null}
                        </Link>
                      ))}
                    </div>

                    {section.icon === "settings" ? (
                      <div className="mt-5 border-t border-white/10 pt-4">
                        <div className="space-y-2.5">
                          {megaMenuSupplementaryLinks.map((item) => (
                            <Link
                              key={item.label}
                              href={item.href}
                              className="flex items-center gap-2 text-[14px] leading-6 text-white/84 transition hover:text-white"
                            >
                              <span>{item.label}</span>
                              {item.badge ? (
                                <span className="rounded-md bg-[#e10600] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] text-white">
                                  {item.badge}
                                </span>
                              ) : null}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </section>
                );
              })}

              <aside className="border-l border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(225,6,0,0.35),transparent_38%),linear-gradient(160deg,#2a090d_0%,#15080b_45%,#09090b_100%)] p-4 xl:p-5">
                <div className="relative h-full min-h-[278px] overflow-hidden rounded-[1.75rem] border border-[#5a1919] bg-[radial-gradient(circle_at_top_left,rgba(255,70,60,0.25),transparent_34%),linear-gradient(160deg,#321014_0%,#16090b_52%,#0a0a0c_100%)] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                  <div className="relative z-10 max-w-[9.8rem]">
                    <p className="text-[1.7rem] font-black leading-none tracking-tight text-white">
                      {featuredPromo.eyebrow}
                    </p>
                    <p className="mt-1 text-[2rem] font-black leading-none tracking-tight text-[#ff2a20]">
                      {featuredPromo.title}
                    </p>
                    <p className="mt-4 text-sm leading-6 text-white/78">
                      {featuredPromo.description}
                    </p>
                  </div>

                  <div className="pointer-events-none absolute inset-y-2 right-[-10px] w-[74%]">
                    <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,54,42,0.28),transparent_64%)] blur-2xl" />
                    <PromoMotorcycleArt />
                  </div>

                  <div className="absolute bottom-5 left-5 z-10">
                    <Link
                      href={featuredPromo.ctaHref}
                      className="inline-flex items-center justify-center rounded-xl bg-[#e10600] px-4 py-3 text-sm font-black tracking-tight text-white transition hover:bg-[#c90500]"
                    >
                      {featuredPromo.ctaLabel}
                    </Link>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      ) : null}

      <div className="border-t border-white/10 bg-[#0d0d10]">
        <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 py-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-white/74 xl:text-[13px]">
            <span className="text-white">Popüler Markalar</span>
            {popularBrandStripItems.map((brand) => (
              <Link
                key={brand.label}
                href={brand.href}
                className="transition hover:text-white"
              >
                {brand.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryNav;
