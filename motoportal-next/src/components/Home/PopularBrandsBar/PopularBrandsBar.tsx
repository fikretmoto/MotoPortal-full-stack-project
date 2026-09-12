"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

const motorcycleBrands = [
  { name: "Honda", logo: "/brands/honda.svg", href: "#brands", offer: "%15 indirim", maxH: "max-h-10" },
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

const ArrowButton = ({
  direction,
  onClick,
}: {
  direction: "prev" | "next";
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={direction === "prev" ? "Önceki markalar" : "Sonraki markalar"}
    className={`absolute top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-black/15 bg-white text-black/60 transition hover:border-black/50 hover:text-black ${
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
  const motoRef = useRef<HTMLDivElement>(null);
  const bikeRef = useRef<HTMLDivElement>(null);

  const scroll = (ref: React.RefObject<HTMLDivElement | null>, dir: 1 | -1) => {
    ref.current?.scrollBy({ left: dir * ref.current.clientWidth, behavior: "smooth" });
  };

  return (
    <div className="border-b border-black/10 bg-white">
      <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-8">

        {/* MOTOSİKLET MARKALARI — logolu */}
        <section className="border-b border-black/10 py-8">
          <h2 className="mb-6 text-center text-[13px] font-extrabold uppercase tracking-[0.06em] text-black">
            Öne Çıkan Motosiklet Markaları
          </h2>

          <div className="relative px-10 sm:px-12">
            <ArrowButton direction="prev" onClick={() => scroll(motoRef, -1)} />
            <ArrowButton direction="next" onClick={() => scroll(motoRef, 1)} />

            <div
              ref={motoRef}
              className="grid grid-flow-col auto-cols-[33.333%] gap-x-3 overflow-x-auto scroll-smooth [&::-webkit-scrollbar]:hidden sm:gap-x-4 lg:auto-cols-[12.5%] lg:gap-x-6"
              style={{ scrollbarWidth: "none" }}
            >
              {motorcycleBrands.map((brand) => (
                <Link
                  key={brand.name}
                  href={brand.href}
                  aria-label={brand.name}
                  className="group flex flex-col items-center gap-2 sm:gap-2.5"
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
                  <span className="text-center text-[11px] font-semibold text-black/55 transition group-hover:text-black/80 sm:text-[13px]">
                    {brand.offer}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* BİSİKLET MARKALARI — yazılı (logolar sonra) */}
        <section className="py-8">
          <h2 className="mb-6 text-center text-[13px] font-extrabold uppercase tracking-[0.06em] text-black">
            Öne Çıkan Bisiklet Markaları
          </h2>

          <div className="relative px-10 sm:px-12">
            <ArrowButton direction="prev" onClick={() => scroll(bikeRef, -1)} />
            <ArrowButton direction="next" onClick={() => scroll(bikeRef, 1)} />

            <div
              ref={bikeRef}
              className="grid grid-flow-col auto-cols-[33.333%] gap-x-3 overflow-x-auto scroll-smooth [&::-webkit-scrollbar]:hidden sm:gap-x-4 lg:auto-cols-[12.5%] lg:gap-x-6"
              style={{ scrollbarWidth: "none" }}
            >
              {bicycleBrands.map((brand) => (
                <Link
                  key={brand.name}
                  href={brand.href}
                  className="group flex flex-col items-center gap-2 sm:gap-2.5"
                >
                  <span className="flex h-9 items-center text-[15px] font-extrabold tracking-[-0.02em] text-black sm:text-[21px]">
                    {brand.name}
                  </span>
                  <span className="text-center text-[11px] font-semibold text-black/55 transition group-hover:text-black/80 sm:text-[13px]">
                    {brand.offer}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default PopularBrandsBar;