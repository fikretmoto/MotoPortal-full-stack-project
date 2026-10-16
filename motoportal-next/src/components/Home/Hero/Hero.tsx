import HeroCarousel from "./HeroCarousel";
import { heroSlides } from "@/constant/heroSlides";

const Hero = () => {
  return (
    <section id="hero" className="mx-auto max-w-6xl px-4 pb-10 pt-10 md:pt-14 lg:px-6">
      <HeroCarousel
        slides={heroSlides}
        header={
          <>
            <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3.5 py-1.5 text-[12.5px] font-bold text-primary md:text-sm">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
                aria-hidden
              >
                <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" />
                <circle cx="12" cy="9.5" r="2.5" />
              </svg>
              İzmir · Özkanlar · Mansuroğlu Mahallesi
            </span>

            <h1 className="text-[30px] font-black leading-[1.02] tracking-tight text-foreground md:text-5xl">
              Yeni bir ses…
              <br />
              <span className="text-primary">MotoPortal</span>
            </h1>

            <p className="mt-3 max-w-[520px] text-sm leading-relaxed text-fg-subtle md:text-base">
              Motosiklet, scooter, ekipman ve aksesuarda öne çıkanlar; bizim seçtiklerimiz.
            </p>
          </>
        }
      />
    </section>
  );
};

export default Hero;