import type { Metadata } from "next";

// sifre-sifirla/page.tsx bir Client Component ("use client") olduğu
// için metadata'yı orada export edemiyoruz -- bu ayrı layout.tsx
// bunun için var, page.tsx'e dokunulmadı.
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function SifreSifirlaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
