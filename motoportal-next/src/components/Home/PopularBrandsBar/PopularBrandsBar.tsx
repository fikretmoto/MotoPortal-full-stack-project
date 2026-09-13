"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

const motorcycleBrands = [
  { name: "Honda", slug: "honda", logo: "/brands/honda.svg", offer: "%15 indirim", maxH: "max-h-10" },
  { name: "Yamaha", slug: "yamaha", logo: "/brands/yamaha.svg", offer: "Seçili ürünlerde %20" },
  { name: "Suzuki", slug: "suzuki", logo: "/brands/suzuki.svg", offer: "%10 indirim" },
  { name: "TVS", slug: "tvs", logo: "/brands/tvs.svg", offer: "%25'e varan" },
  { name: "CFMOTO", slug: "cfmoto", logo: "/brands/cfmoto.png", offer: "Seçili modellerde %12" },
  { name: "SYM", slug: "sym", logo: "/brands/sym.png", offer: "%18'e varan", maxH: "max-h-12" },
  { name: "Kymco", slug: "kymco", logo: "/brands/kymco.svg", offer: "%15 indirim" },
  { name: "Hero", slug: "hero", logo: "/brands/hero.svg", offer: "Seçili ürünlerde %20" },
  { name: "QJ Motor", slug: "qj-motor", logo: "/brands/qj.svg", offer: "%30'a varan" },
  { name: "Zontes", slug: "zontes", logo: "/brands/zontes.svg", offer: "%22'ye varan" },
  { name: "Kuba", slug: "kuba", logo: "/brands/kuba.svg", offer: "%10 indirim" },
  { name: "RKS", slug: "rks", logo: "/brands/rks.svg", offer: "Seçili modellerde %15" },
  { name: "Mondial", slug: "mondial", logo: "/brands/mondial.svg", offer: "%20'ye varan" },
  { name: "Yuki", slug: "yuki", logo: "/brands/yuki.svg", offer: "%12 indirim" },
  { name: "Arora", slug: "arora", logo: "/brands/arora.svg", offer: "%18'e varan" },
  { name: "Benda", slug: "benda", logo: "/brands/benda.svg", offer: "Seçili modellerde %25" },
  { name: "Peugeot", slug: "peugeot", logo: "/brands/peugeot.svg", offer: "%15 indirim" },
  { name: "Regal Raptor", slug: "regal-raptor", logo: "/brands/regal-raptor.svg", offer: "%20'ye varan" },
  { name: "Voge", slug: "voge", logo: "/brands/voge.svg", offer: "Seçili modellerde %18" },
  { name: "Taro", slug: "taro", logo: "/brands/taro.svg", offer: "%14 indirim" },
  { name: "Volta", slug: "volta", logo: "/brands/volta.svg", offer: "Elektriklide %25" },
];

const bicycleBrands = [
  { name: "Bisan", slug: "bisan", offer: "%20'ye varan" },
  { name: "Carraro", slug: "carraro", offer: "Seçili modellerde %15" },
  { name: "Salcano", slug: "salcano", offer: "%18 indirim" },
  { name: "Kron", slug: "kron", offer: "%12 indirim" },
  { name: "Corelli", slug: "corelli", offer: "%25'e varan" },
  { name: "Ümit", slug: "umit", offer: "%10 indirim" },
  { name: "Mosso", slug: "mosso", offer: "Seçili modellerde %20" },
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
                  href={`/marka/${brand.slug}`}
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
                  href={`/marka/${brand.slug}`}
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