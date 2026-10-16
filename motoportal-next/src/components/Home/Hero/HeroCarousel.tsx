"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import type { HeroSlide } from "@/constant/heroSlides";

type Props = {
  slides: HeroSlide[];
  /** Ortalanmış başlık alanı */
  header: ReactNode;
};

export default function HeroCarousel({ slides, header }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [pages, setPages] = useState(slides.length);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(slides.length > 1);

  // Bir kartın genişliği + aradaki boşluk
  const getStep = useCallback(() => {
    const el = trackRef.current;
    if (!el) return 1;
    const card = el.firstElementChild as HTMLElement | null;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    return card ? card.offsetWidth + gap : el.clientWidth;
  }, []);

  const update = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const step = getStep();
    const visible = Math.max(1, Math.round(el.clientWidth / step));
    setPages(Math.max(1, slides.length - visible + 1));
    setActive(Math.round(el.scrollLeft / step));
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, [getStep, slides.length]);

  useEffect(() => {
    update();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  const goTo = (index: number) => {
    trackRef.current?.scrollTo({ left: index * getStep(), behavior: "smooth" });
  };

  // Köşeleri hafif yuvarlatılmış kare ok; üzerine gelince turuncu
  const arrowClass =
    "flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-white text-foreground shadow-sm transition hover:border-primary hover:bg-primary hover:text-primary-foreground disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-line disabled:hover:bg-white disabled:hover:text-foreground";

  return (
    <div>
      {/* Başlık (ortada) + oklar (sağ üstte) */}
      <div className="relative mb-7 md:mb-8">
        <div className="text-center">{header}</div>
        <div className="absolute bottom-0 right-0 hidden gap-2 lg:flex">
          <button
            type="button"
            aria-label="Önceki"
            onClick={() => goTo(active - 1)}
            disabled={!canPrev}
            className={arrowClass}
          >
            ←
          </button>
          <button
            type="button"
            aria-label="Sonraki"
            onClick={() => goTo(active + 1)}
            disabled={!canNext}
            className={arrowClass}
          >
            →
          </button>
        </div>
      </div>

      {/* İç kutu: kartlar + noktalar */}
      <div className="rounded-3xl border border-[#f0e2d7] bg-white/75 p-3 md:p-5">
        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {slides.map((s) => (
            <Link
              key={s.id}
              href={s.href}
              className="group relative aspect-[4/5] shrink-0 basis-[88%] snap-start overflow-hidden rounded-2xl bg-muted md:aspect-[16/10] md:basis-[calc(50%-10px)]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={s.image}
                alt={s.title}
                draggable={false}
                onError={(e) => (e.currentTarget.style.display = "none")}
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
              {/* Alttan koyu geçiş: yazı okunsun */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-5 text-white md:p-6">
                {s.badge && (
                  <span className="w-fit rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider backdrop-blur-sm">
                    {s.badge}
                  </span>
                )}
                <h3 className="text-xl font-extrabold leading-tight md:text-2xl">{s.title}</h3>
                <p className="line-clamp-2 max-w-[92%] text-sm leading-relaxed text-white/85">
                  {s.highlight}
                </p>
                <span className="mt-1 inline-flex w-fit items-center gap-2 text-sm font-semibold">
                  Ürünü İncele
                  <span aria-hidden className="transition group-hover:translate-x-1">→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Noktalar */}
        {pages > 1 && (
          <div className="mt-4 flex justify-center gap-2 md:mt-5">
            {Array.from({ length: pages }).map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`${i + 1}. karta git`}
                onClick={() => goTo(i)}
                className={`h-[7px] rounded-full transition-all ${
                  i === active ? "w-[22px] bg-foreground" : "w-[7px] bg-line hover:bg-fg-subtle"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}