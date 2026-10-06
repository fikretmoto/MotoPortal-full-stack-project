import type { Metadata } from "next";
import {
  Audiowide,
  Geist,
  Geist_Mono,
  Montserrat,
  Archivo,
} from "next/font/google";

import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

const audiowide = Audiowide({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-audiowide",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const archivo = Archivo({
  weight: ["400", "600", "700", "900"],
  subsets: ["latin"],
  variable: "--font-archivo",
});



export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://motoportal.com.tr"
  ),
  title: {
    template: "%s | MotoPortal",
    default: "MotoPortal",
  },
  description: "Motor tutkunlarının dijital durağı",
  verification: {
    google: "jbr5m5E_8ykbpAxddBx1IPdrR1d6nYojYJMiJ0lNAJY",
  },
  openGraph: {
    siteName: "MotoPortal",
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
 return (
    <html lang="tr">
      <body
        className={`
          ${geistSans.variable}
          ${geistMono.variable}
          ${audiowide.variable}
          ${montserrat.variable}
          ${archivo.variable}
        `}
      >
        {children}
      </body>
    </html>
  );
}