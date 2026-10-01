"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function flattenErrors(data: unknown): string[] {
  if (!data || typeof data !== "object") {
    return ["Şifre sıfırlama başarısız."];
  }

  const messages: string[] = [];

  for (const value of Object.values(data as Record<string, unknown>)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        if (typeof item === "string") {
          messages.push(item);
        }
      }
    } else if (typeof value === "string") {
      messages.push(value);
    }
  }

  return messages.length > 0 ? messages : ["Şifre sıfırlama başarısız."];
}

function SifreSifirlaForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const uid = searchParams.get("uid");
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!uid || !token) {
    return (
      <div className="w-full max-w-sm space-y-4 rounded-lg border border-line bg-card p-6 shadow-sm">
        <h1 className="text-lg font-bold text-foreground">
          Geçersiz Bağlantı
        </h1>
        <p className="text-sm text-fg-muted">
          Bu şifre sıfırlama bağlantısı eksik veya geçersiz. Yeni bir
          bağlantı isteyebilirsin.
        </p>
        <Link
          href="/sifre-unuttum"
          className="block text-center text-sm font-medium text-primary hover:underline"
        >
          Şifremi Unuttum sayfasına git
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors([]);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/password-reset-confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid,
          token,
          new_password: newPassword,
          new_password_confirm: newPasswordConfirm,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors(flattenErrors(data));
        return;
      }

      setIsSuccess(true);
      setTimeout(() => router.push("/login"), 2000);
    } catch {
      setErrors(["Bir hata oluştu, lütfen tekrar deneyin."]);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSuccess) {
    return (
      <div className="w-full max-w-sm space-y-4 rounded-lg border border-line bg-card p-6 shadow-sm">
        <h1 className="text-lg font-bold text-foreground">
          Şifren Değiştirildi
        </h1>
        <p className="text-sm text-fg-muted">
          Giriş sayfasına yönlendiriliyorsun...
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm space-y-4 rounded-lg border border-line bg-card p-6 shadow-sm"
    >
      <h1 className="text-lg font-bold text-foreground">Yeni Şifre Belirle</h1>

      <div>
        <label htmlFor="new_password" className="block text-sm font-medium">
          Yeni Şifre
        </label>
        <input
          id="new_password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          className="mt-1 w-full rounded border border-line bg-card px-3 py-2 text-foreground"
        />
      </div>

      <div>
        <label
          htmlFor="new_password_confirm"
          className="block text-sm font-medium"
        >
          Yeni Şifre (Tekrar)
        </label>
        <input
          id="new_password_confirm"
          type="password"
          value={newPasswordConfirm}
          onChange={(e) => setNewPasswordConfirm(e.target.value)}
          required
          className="mt-1 w-full rounded border border-line bg-card px-3 py-2 text-foreground"
        />
      </div>

      {errors.length > 0 && (
        <div role="alert" className="space-y-1">
          {errors.map((message) => (
            <p key={message} className="text-sm text-danger">
              {message}
            </p>
          ))}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded bg-primary px-4 py-2 text-primary-foreground transition hover:bg-primary-hover disabled:opacity-50"
      >
        {isSubmitting ? "Kaydediliyor..." : "Şifreyi Değiştir"}
      </button>
    </form>
  );
}

export default function SifreSifirlaPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Suspense fallback={null}>
        <SifreSifirlaForm />
      </Suspense>
    </div>
  );
}
