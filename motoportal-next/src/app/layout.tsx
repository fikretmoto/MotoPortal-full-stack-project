import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Audiowide,
  Montserrat,
} from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const audiowide = Audiowide({
  variable: "--font-audiowide",
  subsets: ["latin"],
  weight: "400",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});


export const metadata: Metadata = {
  title: "MotoPortal",
  description: "Motor tutkunlarının dijital durağı",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
   <html
  lang="tr"
  className={`${geistSans.variable} ${geistMono.variable} ${audiowide.variable} ${montserrat.variable} h-full antialiased`}
>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}