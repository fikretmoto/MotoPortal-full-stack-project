"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const explicitNextPath = searchParams.get("next");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || "Giriş başarısız.");
        return;
      }

      // ?next= parametresi varsa (örn. middleware'den yönlendirilmiş
      // korumalı bir sayfa, ya da header'dan next ile gelinen bir sayfa)
      // her zaman ona öncelik ver. Yoksa: müşteri anasayfada kalır
      // (Amazon/Trendyol'daki gibi — /hesabim'e sadece bilinçli tıklarsa
      // gider), diğer roller kendi iş arayüzü olan /dashboard'a gider.
      const defaultPath = data.role === "customer" ? "/" : "/dashboard";
      router.push(explicitNextPath || defaultPath);
      router.refresh();
    } catch {
      setError("Bir hata oluştu, lütfen tekrar deneyin.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 rounded-lg border border-line bg-card p-6 shadow-sm"
      >
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

        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-sm font-medium">
              Şifre
            </label>
            <Link
              href="/sifre-unuttum"
              className="text-xs font-medium text-primary hover:underline"
            >
              Şifremi unuttum
            </Link>
          </div>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
          {isSubmitting ? "Giriş yapılıyor..." : "Giriş Yap"}
        </button>

        <p className="text-center text-sm text-fg-muted">
          Hesabın yok mu?{" "}
          <Link href="/register" className="font-medium text-primary hover:underline">
            Kayıt Ol
          </Link>
        </p>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}