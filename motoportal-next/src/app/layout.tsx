import type { Metadata } from "next";
import {
  Audiowide,
  Geist,
  Geist_Mono,
  Montserrat,
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



export const metadata: Metadata = {
  title: {
    template: "%s | MotoPortal",
    default: "MotoPortal",
  },
  description: "Motor tutkunlarının dijital durağı",
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
        `}
      >
        {children}
      </body>
    </html>
  );
}