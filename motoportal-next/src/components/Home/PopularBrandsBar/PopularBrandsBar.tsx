"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const brands = [
  { name: "Honda", logo: "/brands/honda.svg", href: "#brands" },
  { name: "Yamaha", logo: "/brands/yamaha.svg", href: "#brands" },
  { name: "Suzuki", logo: "/brands/suzuki.svg", href: "#brands" },
  { name: "TVS", logo: "/brands/tvs.svg", href: "#brands" },
  { name: "CFMOTO", logo: "/brands/cfmoto.svg", href: "#brands" },
  { name: "SYM", logo: "/brands/sym.svg", href: "#brands" },
  { name: "Kymco", logo: "/brands/kymco.svg", href: "#brands" },
  { name: "Hero", logo: "/brands/hero.svg", href: "#brands" },
  { name: "QJ Motor", logo: "/brands/qj.svg", href: "#brands" },
  { name: "Zontes", logo: "/brands/zontes.svg", href: "#brands" },
  { name: "Kuba", logo: "/brands/kuba.svg", href: "#brands" },
  { name: "RKS", logo: "/brands/rks.svg", href: "#brands" },
  { name: "Mondial", logo: "/brands/mondial.svg", href: "#brands" },
  { name: "Yuki", logo: "/brands/yuki.svg", href: "#brands" },
  { name: "Arora", logo: "/brands/arora.svg", href: "#brands" },
  { name: "Benda", logo: "/brands/benda.svg", href: "#brands" },
  { name: "Peugeot", logo: "/brands/peugeot.svg", href: "#brands" },
  { name: "Regal Raptor", logo: "/brands/regal-raptor.svg", href: "#brands" },
  { name: "Voge", logo: "/brands/voge.svg", href: "#brands" },
  { name: "Taro", logo: "/brands/taro.svg", href: "#brands" },
  { name: "Volta", logo: "/brands/volta.svg", href: "#brands" },
];

const bicycleBrands = [
  { name: "Bisan", href: "#brands" },
  { name: "Carraro", href: "#brands" },
  { name: "Salcano", href: "#brands" },
  { name: "Kron", href: "#brands" },
  { name: "Corelli", href: "#brands" },
  { name: "Ümit", href: "#brands" },
  { name: "Mosso", href: "#brands" },
];

const PER_VIEW = 5;

const PopularBrandsBar = () => {
  const [index, setIndex] = useState(0);
  const maxIndex = Math.max(0, brands.length - PER_VIEW);

  const goPrev = () => setIndex((i) => Math.max(0, i - 1));
  const goNext = () => setIndex((i) => Math.min(maxIndex, i + 1));

  const [bikeIndex, setBikeIndex] = useState(0);
  const bikeMaxIndex = Math.max(0, bicycleBrands.length - PER_VIEW);

  const bikePrev = () => setBikeIndex((i) => Math.max(0, i - 1));
  const bikeNext = () => setBikeIndex((i) => Math.min(bikeMaxIndex, i + 1));

  return (
    <div className="border-y border-white/10 bg-[#09090b]">
      <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-8">

        {/* POPÜLER MOTOSİKLET MARKALARI */}
        <section className="border-b border-white/10 py-5">
          <h2 className="mb-4 text-center text-[11px] font-bold uppercase tracking-[0.1em] text-white xl:text-[12px]">
            Popüler Motosiklet Markaları
          </h2>

          <div className="relative px-12 sm:px-14">
            <button
              type="button"
              onClick={goPrev}
              disabled={index === 0}
              aria-label="Önceki markalar"
              className="absolute left-0 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 text-white/70 transition hover:border-white/40 hover:text-white disabled:opacity-25 disabled:hover:border-white/15 disabled:hover:text-white/70"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={goNext}
              disabled={index === maxIndex}
              aria-label="Sonraki markalar"
              className="absolute right-0 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 text-white/70 transition hover:border-white/40 hover:text-white disabled:opacity-25 disabled:hover:border-white/15 disabled:hover:text-white/70"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${index * (100 / PER_VIEW)}%)` }}
              >
                {brands.map((brand) => (
                  <div
                    key={brand.name}
                    className="w-1/5 shrink-0 border-r border-white/10 px-3 last:border-r-0"
                  >
                    <Link
                      href={brand.href}
                      aria-label={brand.name}
                      className="group flex h-12 min-w-0 items-center justify-center"
                    >
                      <Image
                        src={brand.logo}
                        alt={brand.name}
                        width={120}
                        height={32}
                        className="h-auto max-h-6 w-auto max-w-full object-contain brightness-0 invert opacity-90 transition group-hover:opacity-100"
                      />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* POPÜLER BİSİKLET MARKALARI */}
        <section className="py-5">
          <h2 className="mb-4 text-center text-[11px] font-bold uppercase tracking-[0.1em] text-white xl:text-[12px]">
            Popüler Bisiklet Markaları
          </h2>

          <div className="relative px-12 sm:px-14">
            <button
              type="button"
              onClick={bikePrev}
              disabled={bikeIndex === 0}
              aria-label="Önceki bisiklet markaları"
              className="absolute left-0 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 text-white/70 transition hover:border-white/40 hover:text-white disabled:opacity-25 disabled:hover:border-white/15 disabled:hover:text-white/70"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={bikeNext}
              disabled={bikeIndex === bikeMaxIndex}
              aria-label="Sonraki bisiklet markaları"
              className="absolute right-0 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 text-white/70 transition hover:border-white/40 hover:text-white disabled:opacity-25 disabled:hover:border-white/15 disabled:hover:text-white/70"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{
                  transform: `translateX(-${bikeIndex * (100 / PER_VIEW)}%)`,
                }}
              >
                {bicycleBrands.map((brand) => (
                  <div
                    key={brand.name}
                    className="w-1/5 shrink-0 border-r border-white/10 px-3 last:border-r-0"
                  >
                    <Link
                      href={brand.href}
                      className="flex h-12 items-center justify-center text-sm font-semibold text-white/80 transition hover:text-white"
                    >
                      {brand.name}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default PopularBrandsBar;
