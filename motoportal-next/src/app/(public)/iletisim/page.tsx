import type { Metadata } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";
import IletisimHero from "@/components/iletisim/IletisimHero";
import IletisimInfoCards from "@/components/iletisim/IletisimInfoCards";
import IletisimMap from "@/components/iletisim/IletisimMap";
import IletisimBrandStrip from "@/components/iletisim/IletisimBrandStrip";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-barlow",
});

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-barlow-condensed",
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.motoportal.com.tr";

export const metadata: Metadata = {
  title: "İletişim",
  description:
    "MotoPortal İzmir Bayraklı showroom adresi, telefon, WhatsApp ve çalışma saatleri. Bize ulaşın, motosikletinizi birlikte seçelim.",
  alternates: {
    canonical: "/iletisim",
  },
  openGraph: {
    title: "İletişim",
    description:
      "MotoPortal İzmir Bayraklı showroom adresi, telefon, WhatsApp ve çalışma saatleri.",
    url: "/iletisim",
    type: "website",
  },
};

export default function IletisimPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MotorcycleDealer",
    name: "MotoPortal",
    image: `${SITE_URL}/motoportal-mp-logo.png`,
    logo: `${SITE_URL}/motoportal-mp-logo.png`,
    url: SITE_URL,
    telephone: "+905534512259",
    email: "info@motoportal.com.tr",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Mansuroğlu Mah., Dumlupınar Cad. 265, 1. Sokak No:1/A",
      addressLocality: "Bayraklı",
      addressRegion: "İzmir",
      postalCode: "35535",
      addressCountry: "TR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 38.45468,
      longitude: 27.19427,
    },
    sameAs: ["https://www.instagram.com/motoportaltr"],
  };

  return (
    <div
      className={`${barlow.variable} ${barlowCondensed.variable} bg-elevated font-[family-name:var(--font-barlow)] text-foreground`}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <IletisimHero />

      <section className="px-[24px] pt-[56px] pb-[24px]">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-stretch gap-[24px]">
          <IletisimInfoCards />
          <IletisimMap />
        </div>
      </section>

      <IletisimBrandStrip />
    </div>
  );
}
