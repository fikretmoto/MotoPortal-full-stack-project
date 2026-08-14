import Image from "next/image";
import Link from "next/link";

const TopBar = () => {
  return (
    <div className="border-b border-white/10 bg-[#050505]">
      <div className="mx-auto flex max-w-[1560px] justify-center px-4 py-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          aria-label="MotoPortal ana sayfa"
          className="flex items-center gap-5"
        >
          {/* MP LOGO */}
          <div className="relative h-[86px] w-[86px] shrink-0 sm:h-[96px] sm:w-[96px] lg:h-[108px] lg:w-[108px]">
            <Image
              src="/motoportal-mp-logo.png"
              alt="MotoPortal MP Logo"
              fill
              priority
              sizes="108px"
              className="object-contain"
            />
          </div>

          {/* BRAND AREA */}
          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              {/* MOTOPORTAL */}
              <div className="font-motoportal flex items-baseline whitespace-nowrap text-[34px] leading-none tracking-[-0.04em] sm:text-[44px] lg:text-[56px]">
                <span className="text-white">MOTO</span>
                <span className="text-[#0062C8]">PORTAL</span>
              </div>

              {/* TAGLINE */}
              <div className="mt-2 flex items-center gap-3">
                <span className="h-[3px] w-16 bg-[#0062C8]" />

                <span className="font-motoportal-tagline whitespace-nowrap text-[9px] font-medium uppercase tracking-[0.28em] text-white/90 sm:text-[10px] lg:text-[11px]">
                  Motor Tutkunlarının Dijital Durağı
                </span>

                <span className="h-[3px] w-16 bg-[#0062C8]" />
              </div>
            </div>

            {/* RIGHT STRIPES */}
            <div
              className="hidden items-center gap-[7px] md:flex"
              aria-hidden="true"
            >
              <span className="block h-[84px] w-[10px] skew-x-[-24deg] bg-[#1f1f1f]" />
              <span className="block h-[84px] w-[10px] skew-x-[-24deg] bg-[#0062C8]" />
              <span className="block h-[84px] w-[10px] skew-x-[-24deg] bg-[#1f1f1f]" />
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default TopBar;