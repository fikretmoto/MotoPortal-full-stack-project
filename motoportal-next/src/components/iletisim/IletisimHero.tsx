import Link from "next/link";
import { MessageCircle, Phone, Navigation } from "lucide-react";

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
          Showroom&apos;umuza gelin, motosikletinizi birlikte seçelim.
        </h1>

        <p className="m-0 max-w-[640px] text-[18px] leading-[1.55] text-[oklch(85%_0.01_60)]">
          İzmir Bayraklı&apos;daki MotoPortal mağazasında motosiklet, scooter,
          ATV ve ekipmanları yerinde görebilir, test sürüşü ve taksit
          seçenekleri için bize ulaşabilirsiniz.
        </p>

        <div className="mt-[12px] flex flex-wrap gap-[12px]">
          <a
            href="https://wa.me/905534512259"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[48px] items-center gap-[10px] rounded-[10px] bg-[#D9531E] px-[22px] text-[16px] font-semibold text-white no-underline"
          >
            <MessageCircle size={20} aria-hidden="true" />
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
