import Link from "next/link";
import {Phone, Navigation } from "lucide-react";

const IletisimHero = () => {
  return (
    <section className="bg-secondary px-[24px] pt-[64px] pb-[72px] text-elevated">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-[16px]">
        <nav
          aria-label="Sayfa yolu"
          className="text-[14px] text-[oklch(78%_0.01_60)]"
        >
          <Link
            href="/"
            className="text-[oklch(78%_0.01_60)] no-underline"
          >
            Ana Sayfa
          </Link>{" "}
          / İletişim
        </nav>

        <h1 className="m-0 max-w-[760px] font-[family-name:var(--font-barlow-condensed)] text-[56px] leading-[1.02] font-bold tracking-[0.5px]">
          Aradığınız motosikleti bulalım, size ulaştıralım.
        </h1>

        <p className="m-0 max-w-[640px] text-[18px] leading-[1.55] text-[oklch(85%_0.01_60)]">
        Sitemizdeki her ürün mağazamızda stokta olmayabilir. Mağazamıza uğrayın ya da bizi arayın; ilgilendiğiniz ürün için ana distribütör firmayla iletişime geçip tedariği sağlayalım ve ürünü size ulaştıralım.
        </p>

        <div className="mt-[12px] flex flex-wrap gap-[12px]">
          <a
            href="https://wa.me/905534512259"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[48px] items-center gap-[10px] rounded-[10px] bg-[#D9531E] px-[22px] text-[16px] font-semibold text-white no-underline"
          >
            <svg
  aria-hidden="true"
  width="20"
  height="20"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  strokeWidth="2"
  strokeLinecap="round"
  strokeLinejoin="round"
>
  <path d="M3 21l1.6-4.8A8.5 8.5 0 1 1 7.8 19.4z" />
  <path d="M9 10.5c.4 1.6 2 3.2 3.6 3.6l1.2-1.2 2 1-.6 1.6c-3.4.2-7.4-3.8-7.2-7.2l1.6-.6 1 2z" />
</svg>
            WhatsApp&apos;tan yazın
          </a>

          <a
            href="tel:+905534512259"
            className="inline-flex min-h-[48px] items-center gap-[10px] rounded-[10px] border-[1.5px] border-[oklch(55%_0.01_60)] bg-transparent px-[22px] text-[16px] font-semibold text-elevated no-underline"
          >
            <Phone size={20} aria-hidden="true" />
            0553 451 22 59
          </a>

          <a
            href="https://www.google.com/maps/dir/?api=1&destination=38.45468,27.19427"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[48px] items-center gap-[10px] rounded-[10px] border-[1.5px] border-[oklch(55%_0.01_60)] bg-transparent px-[22px] text-[16px] font-semibold text-elevated no-underline"
          >
            <Navigation size={20} aria-hidden="true" />
            Yol tarifi al
          </a>
        </div>
      </div>
    </section>
  );
};

export default IletisimHero;
