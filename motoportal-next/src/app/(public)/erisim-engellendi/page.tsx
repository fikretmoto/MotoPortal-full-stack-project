import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function AccessDeniedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-2xl font-bold text-foreground">
        Erişim Yetkin Yok
      </h1>
      <p className="max-w-sm text-sm text-fg-muted">
        Bu sayfa sadece bayi/yönetici hesapları içindir. Hesabınla ilgili
        bir sorun olduğunu düşünüyorsan bizimle iletişime geç.
      </p>
      <Link
        href="/"
        className="rounded bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover"
      >
        Ana Sayfaya Dön
      </Link>
    </div>
  );
}
