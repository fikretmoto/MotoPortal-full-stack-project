"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const motorcycleBrands = [
  { name: "Honda", logo: "/brands/honda.svg", href: "#brands", offer: "%15 indirim",   maxH: "max-h-10"},
  { name: "Yamaha", logo: "/brands/yamaha.svg", href: "#brands", offer: "Seçili ürünlerde %20" },
  { name: "Suzuki", logo: "/brands/suzuki.svg", href: "#brands", offer: "%10 indirim" },
  { name: "TVS", logo: "/brands/tvs.svg", href: "#brands", offer: "%25'e varan" },
  { name: "CFMOTO", logo: "/brands/cfmoto.png", href: "#brands", offer: "Seçili modellerde %12" },
  { name: "SYM", logo: "/brands/sym.png", href: "#brands", offer: "%18'e varan", maxH: "max-h-12" },
  { name: "Kymco", logo: "/brands/kymco.svg", href: "#brands", offer: "%15 indirim" },
  { name: "Hero", logo: "/brands/hero.svg", href: "#brands", offer: "Seçili ürünlerde %20" },
  { name: "QJ Motor", logo: "/brands/qj.svg", href: "#brands", offer: "%30'a varan" },
  { name: "Zontes", logo: "/brands/zontes.svg", href: "#brands", offer: "%22'ye varan" },
  { name: "Kuba", logo: "/brands/kuba.svg", href: "#brands", offer: "%10 indirim" },
  { name: "RKS", logo: "/brands/rks.svg", href: "#brands", offer: "Seçili modellerde %15" },
  { name: "Mondial", logo: "/brands/mondial.svg", href: "#brands", offer: "%20'ye varan" },
  { name: "Yuki", logo: "/brands/yuki.svg", href: "#brands", offer: "%12 indirim" },
  { name: "Arora", logo: "/brands/arora.svg", href: "#brands", offer: "%18'e varan" },
  { name: "Benda", logo: "/brands/benda.svg", href: "#brands", offer: "Seçili modellerde %25" },
  { name: "Peugeot", logo: "/brands/peugeot.svg", href: "#brands", offer: "%15 indirim" },
  { name: "Regal Raptor", logo: "/brands/regal-raptor.svg", href: "#brands", offer: "%20'ye varan" },
  { name: "Voge", logo: "/brands/voge.svg", href: "#brands", offer: "Seçili modellerde %18" },
  { name: "Taro", logo: "/brands/taro.svg", href: "#brands", offer: "%14 indirim" },
  { name: "Volta", logo: "/brands/volta.svg", href: "#brands", offer: "Elektriklide %25" },
];

const bicycleBrands = [
  { name: "Bisan", href: "#brands", offer: "%20'ye varan" },
  { name: "Carraro", href: "#brands", offer: "Seçili modellerde %15" },
  { name: "Salcano", href: "#brands", offer: "%18 indirim" },
  { name: "Kron", href: "#brands", offer: "%12 indirim" },
  { name: "Corelli", href: "#brands", offer: "%25'e varan" },
  { name: "Ümit", href: "#brands", offer: "%10 indirim" },
  { name: "Mosso", href: "#brands", offer: "Seçili modellerde %20" },
];

const PER_VIEW = 5;

const ArrowButton = ({
  direction,
  onClick,
  disabled,
}: {
  direction: "prev" | "next";
  onClick: () => void;
  disabled: boolean;
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    aria-label={direction === "prev" ? "Önceki markalar" : "Sonraki markalar"}
    className={`absolute top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-black/15 text-black/60 transition hover:border-black/50 hover:text-black disabled:opacity-25 disabled:hover:border-black/15 disabled:hover:text-black/60 ${
      direction === "prev" ? "left-0" : "right-0"
    }`}
  >
    {direction === "prev" ? (
      <ChevronLeft className="h-4 w-4" />
    ) : (
      <ChevronRight className="h-4 w-4" />
    )}
  </button>
);

const PopularBrandsBar = () => {
  const [motoIndex, setMotoIndex] = useState(0);
  const [bikeIndex, setBikeIndex] = useState(0);

  const motoMax = Math.max(0, motorcycleBrands.length - PER_VIEW);
  const bikeMax = Math.max(0, bicycleBrands.length - PER_VIEW);

  return (
    <div className="border-b border-black/10 bg-white">
      <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-8">

        {/* MOTOSİKLET MARKALARI — logolu */}
        <section className="border-b border-black/10 py-8">
          <h2 className="mb-6 text-center text-[13px] font-extrabold uppercase tracking-[0.06em] text-black">
            Öne Çıkan Motosiklet Markaları
          </h2>

          <div className="relative px-12 sm:px-16">
            <ArrowButton
              direction="prev"
              onClick={() => setMotoIndex((i) => Math.max(0, i - 1))}
              disabled={motoIndex === 0}
            />
            <ArrowButton
              direction="next"
              onClick={() => setMotoIndex((i) => Math.min(motoMax, i + 1))}
              disabled={motoIndex === motoMax}
            />

            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${motoIndex * (100 / PER_VIEW)}%)` }}
              >
                {motorcycleBrands.map((brand) => (
                  <div
                    key={brand.name}
                    className="w-1/5 shrink-0 border-r border-black/10 px-4 last:border-r-0"
                  >
                    <Link
                      href={brand.href}
                      aria-label={brand.name}
                      className="group flex flex-col items-center gap-2.5"
                    >
                      <span className="flex h-9 w-full items-center justify-center">
                        <Image
                          src={brand.logo}
                          alt={brand.name}
                          width={140}
                          height={36}
                         className={`h-auto ${brand.maxH ?? "max-h-7"} w-auto max-w-full object-contain opacity-85 transition group-hover:opacity-100`}
                        />
                      </span>
                      <span className="text-center text-[13px] font-semibold text-black/55 transition group-hover:text-black/80">
                        {brand.offer}
                      </span>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* BİSİKLET MARKALARI — yazılı (logolar sonra) */}
        <section className="py-8">
          <h2 className="mb-6 text-center text-[13px] font-extrabold uppercase tracking-[0.06em] text-black">
            Öne Çıkan Bisiklet Markaları
          </h2>

          <div className="relative px-12 sm:px-16">
            <ArrowButton
              direction="prev"
              onClick={() => setBikeIndex((i) => Math.max(0, i - 1))}
              disabled={bikeIndex === 0}
            />
            <ArrowButton
              direction="next"
              onClick={() => setBikeIndex((i) => Math.min(bikeMax, i + 1))}
              disabled={bikeIndex === bikeMax}
            />

            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${bikeIndex * (100 / PER_VIEW)}%)` }}
              >
                {bicycleBrands.map((brand) => (
                  <div
                    key={brand.name}
                    className="w-1/5 shrink-0 border-r border-black/10 px-4 last:border-r-0"
                  >
                    <Link
                      href={brand.href}
                      className="group flex flex-col items-center gap-2.5"
                    >
                      <span className="flex h-9 items-center text-[21px] font-extrabold tracking-[-0.02em] text-black">
                        {brand.name}
                      </span>
                      <span className="text-center text-[13px] font-semibold text-black/55 transition group-hover:text-black/80">
                        {brand.offer}
                      </span>
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
