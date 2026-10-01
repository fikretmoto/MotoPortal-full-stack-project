"use client";

import { useState } from "react";
import Link from "next/link";

export default function SifreUnuttumPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/password-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        setError("Bir hata oluştu, lütfen tekrar deneyin.");
        return;
      }

      // Backend, kayıtlı olsun olmasın aynı cevabı döner (kullanıcı
      // enumeration'ı önlemek için) — bu yüzden burada da her zaman
      // aynı "gönderildi" mesajını gösteriyoruz.
      setIsSubmitted(true);
    } catch {
      setError("Bir hata oluştu, lütfen tekrar deneyin.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-4 rounded-lg border border-line bg-card p-6 shadow-sm">
        <h1 className="text-lg font-bold text-foreground">Şifremi Unuttum</h1>

        {isSubmitted ? (
          <p className="text-sm text-fg-muted">
            E-posta adresin kayıtlıysa, şifreni sıfırlaman için bir bağlantı
            gönderildi. Gelen kutunu (ve spam klasörünü) kontrol et.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                E-posta
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 w-full rounded border border-line bg-card px-3 py-2 text-foreground"
              />
            </div>

            {error && (
              <p role="alert" className="text-sm text-danger">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded bg-primary px-4 py-2 text-primary-foreground transition hover:bg-primary-hover disabled:opacity-50"
            >
              {isSubmitting ? "Gönderiliyor..." : "Sıfırlama Bağlantısı Gönder"}
            </button>
          </form>
        )}

        <p className="text-center text-sm text-fg-muted">
          <Link href="/login" className="font-medium text-primary hover:underline">
            Giriş sayfasına dön
          </Link>
        </p>
      </div>
    </div>
  );
}
