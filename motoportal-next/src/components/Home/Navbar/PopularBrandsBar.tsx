"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const brands = [
  {
    name: "Honda",
    logo: "/brands/honda.svg",
    href: "#brands",
    slotClass: "w-[70px] xl:w-[78px] 2xl:w-[84px]",
    imageClass: "max-h-[21px] xl:max-h-[22px]",
    topClassName: "mr-[-8px] xl:mr-[-10px]",
    panelSlotClass: "w-[102px] xl:w-[114px] 2xl:w-[120px]",
    panelImageClass: "max-h-[21px] xl:max-h-[22px]",
  },
  { name: "Yamaha", logo: "/brands/yamaha.svg", href: "#brands" },
  { name: "Suzuki", logo: "/brands/suzuki.svg", href: "#brands" },
  { name: "TVS", logo: "/brands/tvs.svg", href: "#brands" },
  { name: "Kuba", logo: "/brands/kuba.svg", href: "#brands" },
  { name: "RKS", logo: "/brands/rks.svg", href: "#brands" },
  { name: "Mondial", logo: "/brands/mondial.svg", href: "#brands" },
  { name: "CFMOTO", logo: "/brands/cfmoto.svg", href: "#brands" },
  {
    name: "SYM",
    logo: "/brands/sym.svg",
    href: "#brands",
    slotClass: "w-[72px] xl:w-[80px] 2xl:w-[86px]",
    imageClass: "max-h-[20px] xl:max-h-[21px]",
    topClassName: "mr-[-5px] xl:mr-[-6px]",
    panelSlotClass: "w-[98px] xl:w-[110px] 2xl:w-[116px]",
    panelImageClass: "max-h-[21px] xl:max-h-[22px]",
  },
  {
    name: "Kymco",
    logo: "/brands/kymco.svg",
    href: "#brands",
    slotClass: "w-[74px] xl:w-[84px] 2xl:w-[90px]",
    imageClass: "max-h-[19px] xl:max-h-[20px]",
    topClassName: "mr-[-5px] xl:mr-[-6px]",
    panelSlotClass: "w-[100px] xl:w-[112px] 2xl:w-[118px]",
    panelImageClass: "max-h-[21px] xl:max-h-[22px]",
  },
  {
    name: "Yuki",
    logo: "/brands/yuki.svg",
    href: "#brands",
    slotClass: "w-[76px] xl:w-[86px] 2xl:w-[92px]",
    topClassName: "mr-[-4px] xl:mr-[-5px]",
    panelSlotClass: "w-[108px] xl:w-[122px] 2xl:w-[128px]",
    panelImageClass: "max-h-[22px] xl:max-h-[23px]",
  },
  {
    name: "Arora",
    logo: "/brands/arora.svg",
    href: "#brands",
    panelSlotClass: "w-[108px] xl:w-[122px] 2xl:w-[128px]",
    panelImageClass: "max-h-[22px] xl:max-h-[23px]",
  },
  {
    name: "Benda",
    logo: "/brands/benda.svg",
    href: "#brands",
    slotClass: "w-[88px] xl:w-[98px] 2xl:w-[104px]",
    imageClass: "max-h-[18px] xl:max-h-[19px]",
    panelSlotClass: "w-[108px] xl:w-[122px] 2xl:w-[128px]",
    panelImageClass: "max-h-[22px] xl:max-h-[23px]",
  },
  {
    name: "Peugeot",
    logo: "/brands/peugeot.svg",
    href: "#brands",
    slotClass: "w-[96px] xl:w-[108px] 2xl:w-[114px]",
    imageClass: "max-h-[18px] xl:max-h-[19px]",
    panelSlotClass: "w-[108px] xl:w-[122px] 2xl:w-[128px]",
    panelImageClass: "max-h-[22px] xl:max-h-[23px]",
  },
  {
    name: "Regal Raptor",
    logo: "/brands/regal-raptor.svg",
    href: "#brands",
    panelSlotClass: "w-[108px] xl:w-[122px] 2xl:w-[128px]",
    panelImageClass: "max-h-[21px] xl:max-h-[22px]",
  },
  {
    name: "Voge",
    logo: "/brands/voge.svg",
    href: "#brands",
    slotClass: "w-[82px] xl:w-[92px] 2xl:w-[98px]",
    imageClass: "max-h-[21px] xl:max-h-[22px]",
    panelSlotClass: "w-[108px] xl:w-[122px] 2xl:w-[128px]",
    panelImageClass: "max-h-[22px] xl:max-h-[23px]",
  },
  {
    name: "Taro",
    logo: "/brands/taro.svg",
    href: "#brands",
    panelSlotClass: "w-[102px] xl:w-[114px] 2xl:w-[120px]",
    panelImageClass: "max-h-[22px] xl:max-h-[23px]",
  },
  {
    name: "Volta",
    logo: "/brands/volta.svg",
    href: "#brands",
    slotClass: "w-[90px] xl:w-[100px] 2xl:w-[106px]",
    imageClass: "max-h-[20px] xl:max-h-[21px]",
    panelSlotClass: "w-[106px] xl:w-[120px] 2xl:w-[126px]",
    panelImageClass: "max-h-[22px] xl:max-h-[23px]",
  },
];

const getCollapsedVisibilityClass = (index: number) => {
  if (index < 8) {
    return "flex";
  }

  if (index < 10) {
    return "hidden lg:flex";
  }

  if (index < 12) {
    return "hidden min-[1440px]:flex";
  }

  if (index < 14) {
    return "hidden 2xl:flex";
  }

  return "hidden";
};

const BrandLogo = ({
  brand,
  className,
  size = "default",
}: {
  brand: (typeof brands)[number];
  className?: string;
  size?: "default" | "expanded";
}) => {
  const slotClassName =
    size === "expanded"
      ? `flex h-[26px] w-[102px] items-center justify-center xl:h-[28px] xl:w-[114px] 2xl:w-[120px] ${
          brand.panelSlotClass ?? ""
        }`
      : `flex h-[22px] w-[82px] items-center justify-center xl:h-[24px] xl:w-[92px] 2xl:w-[98px] ${
          brand.slotClass ?? ""
        }`;

  const imageClassName =
    size === "expanded"
      ? `h-auto max-h-[20px] w-auto max-w-full object-contain brightness-0 invert opacity-90 transition group-hover:opacity-100 ${
          brand.panelImageClass ?? brand.imageClass ?? ""
        }`
      : `h-auto max-h-[18px] w-auto max-w-full object-contain brightness-0 invert opacity-85 transition group-hover:opacity-100 ${
          brand.imageClass ?? ""
        }`;

  const spacingClassName = size === "default" ? brand.topClassName ?? "" : "";

  return (
    <Link
      href={brand.href}
      aria-label={brand.name}
      className={`group items-center justify-center ${spacingClassName} ${
        className ?? ""
      }`}
    >
      <span className={slotClassName}>
        <Image
          src={brand.logo}
          alt={brand.name}
          width={120}
          height={32}
          className={imageClassName}
        />
      </span>
    </Link>
  );
};

const PopularBrandsBar = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border-y border-white/10 bg-[#09090b]">
      <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-[60px] items-center gap-2.5 py-2 lg:gap-3">
          <span className="shrink-0 text-[11px] font-bold uppercase tracking-[0.1em] text-white xl:text-[12px]">
            Popüler Markalar
          </span>

          <div className="flex flex-1 items-center justify-start gap-0.5 overflow-hidden xl:gap-1">
            {brands.map((brand, index) => (
              <BrandLogo
                key={brand.name}
                brand={brand}
                className={getCollapsedVisibilityClass(index)}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => setIsExpanded((previousState) => !previousState)}
            aria-expanded={isExpanded}
            aria-controls="popular-brands-panel"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-2 text-[10px] font-semibold uppercase tracking-[0.04em] text-white/70 transition hover:border-white/25 hover:text-white xl:px-3.5"
          >
            <span>Tüm Markalar</span>
            <ChevronDown
              className={`h-4 w-4 transition ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        {isExpanded ? (
          <div
            id="popular-brands-panel"
            className="border-t border-white/10 py-4"
          >
            <div className="flex flex-wrap items-center gap-x-3 gap-y-4 xl:gap-x-4">
              {brands.map((brand) => (
                <BrandLogo
                  key={brand.name}
                  brand={brand}
                  size="expanded"
                  className="flex rounded-lg border border-transparent px-1 py-1 transition hover:border-white/10 hover:bg-white/[0.02]"
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default PopularBrandsBar;
