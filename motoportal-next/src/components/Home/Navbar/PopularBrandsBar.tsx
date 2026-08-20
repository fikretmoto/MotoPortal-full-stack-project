"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const brands = [
  { name: "Honda", logo: "/brands/honda.svg", href: "#brands" },
  { name: "Yamaha", logo: "/brands/yamaha.svg", href: "#brands" },
  { name: "Suzuki", logo: "/brands/suzuki.svg", href: "#brands" },
  { name: "TVS", logo: "/brands/tvs.svg", href: "#brands" },
  { name: "Kuba", logo: "/brands/kuba.svg", href: "#brands" },
  { name: "RKS", logo: "/brands/rks.svg", href: "#brands" },
  { name: "Mondial", logo: "/brands/mondial.svg", href: "#brands" },
  { name: "CFMOTO", logo: "/brands/cfmoto.svg", href: "#brands" },
  { name: "SYM", logo: "/brands/sym.svg", href: "#brands" },
  { name: "Kymco", logo: "/brands/kymco.svg", href: "#brands" },
  { name: "Yuki", logo: "/brands/yuki.svg", href: "#brands" },
  { name: "Arora", logo: "/brands/arora.svg", href: "#brands" },
  { name: "Benda", logo: "/brands/benda.svg", href: "#brands" },
  { name: "Peugeot", logo: "/brands/peugeot.svg", href: "#brands" },
  { name: "Regal Raptor", logo: "/brands/regal-raptor.svg", href: "#brands" },
  { name: "Voge", logo: "/brands/voge.svg", href: "#brands" },
  { name: "Taro", logo: "/brands/taro.svg", href: "#brands" },
  { name: "Volta", logo: "/brands/volta.svg", href: "#brands" },
  { name: "Hero", logo: "/brands/hero.svg", href: "#brands" },
  { name: "QJ Motor", logo: "/brands/qj.svg", href: "#brands" },
  { name: "Zontes", logo: "/brands/zontes.svg", href: "#brands" },
];

const popularMotorcycleBrandNames = [
  "Honda",
  "Yamaha",
  "Suzuki",
  "TVS",
  "SYM",
  "Kymco",
  "CFMOTO",
  "Hero",
  "QJ Motor",
  "Zontes",
];

const popularBicycleBrands = ["Bisan", "Carraro", "Salcano"];

const popularMotorcycleBrands = brands.filter((brand) =>
  popularMotorcycleBrandNames.includes(brand.name),
);

const otherMotorcycleBrands = brands.filter(
  (brand) => !popularMotorcycleBrandNames.includes(brand.name),
);

const BrandLogo = ({
  brand,
}: {
  brand: (typeof brands)[number];
}) => {
  return (
    <Link
      href={brand.href}
      aria-label={brand.name}
      className="group flex h-10 min-w-0 items-center justify-center"
    >
      <Image
        src={brand.logo}
        alt={brand.name}
        width={120}
        height={32}
        className="h-auto max-h-6 w-auto max-w-full object-contain brightness-0 invert opacity-90 transition group-hover:opacity-100"
      />
    </Link>
  );
};

const PopularBrandsBar = () => {
  const [isMotorcycleExpanded, setIsMotorcycleExpanded] = useState(false);
  const [isBicycleExpanded, setIsBicycleExpanded] = useState(false);

  return (
    <div className="border-y border-white/10 bg-[#09090b]">
      <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-8">

        {/* POPÜLER MOTOSİKLET MARKALARI */}
        <section className="border-b border-white/10 py-4">
          <h2 className="mb-4 text-[11px] font-bold uppercase tracking-[0.1em] text-white xl:text-[12px]">
            Popüler Motosiklet Markaları
          </h2>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(72px,96px))] items-center justify-center gap-x-3 gap-y-3 sm:grid-cols-[repeat(auto-fit,minmax(82px,100px))] lg:grid-cols-5 lg:justify-stretch lg:gap-x-4">
            {popularMotorcycleBrands.map((brand) => (
              <BrandLogo key={brand.name} brand={brand} />
            ))}
          </div>

          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={() =>
                setIsMotorcycleExpanded((previousState) => !previousState)
              }
              aria-expanded={isMotorcycleExpanded}
              className="inline-flex w-fit items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.04em] text-white/70 transition hover:border-white/25 hover:text-white"
            >
              Tüm Markalar

              <ChevronDown
                className={`h-4 w-4 transition ${
                  isMotorcycleExpanded ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

          {isMotorcycleExpanded ? (
            <div className="mt-4 grid grid-cols-[repeat(auto-fit,minmax(72px,96px))] items-center justify-center gap-x-3 gap-y-3 border-t border-white/10 pt-4 sm:grid-cols-[repeat(auto-fit,minmax(82px,100px))] lg:grid-cols-6 lg:justify-stretch lg:gap-x-4">
              {otherMotorcycleBrands.map((brand) => (
                <BrandLogo key={brand.name} brand={brand} />
              ))}
            </div>
          ) : null}
        </section>

        {/* POPÜLER BİSİKLET MARKALARI */}
        <section className="py-4">
          <h2 className="mb-4 text-[11px] font-bold uppercase tracking-[0.1em] text-white xl:text-[12px]">
            Popüler Bisiklet Markaları
          </h2>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(88px,110px))] items-center justify-center gap-3 sm:justify-start">
            {popularBicycleBrands.map((brand) => (
              <Link
                key={brand}
                href="#brands"
                className="flex items-center justify-center rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-white/25 hover:bg-white/[0.03] hover:text-white"
              >
                {brand}
              </Link>
            ))}
          </div>

          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={() =>
                setIsBicycleExpanded((previousState) => !previousState)
              }
              aria-expanded={isBicycleExpanded}
              className="inline-flex w-fit items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.04em] text-white/70 transition hover:border-white/25 hover:text-white"
            >
              Tüm Markalar

              <ChevronDown
                className={`h-4 w-4 transition ${
                  isBicycleExpanded ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

          {isBicycleExpanded ? (
            <div className="mt-4 border-t border-white/10 pt-4 text-sm text-white/55">
              Diğer bisiklet markaları buraya eklenecek.
            </div>
          ) : null}
        </section>

      </div>
    </div>
  );
};

export default PopularBrandsBar;