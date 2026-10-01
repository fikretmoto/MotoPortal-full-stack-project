"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

const RESEND_COOLDOWN_SECONDS = 60;

function flattenErrors(data: unknown): string[] {
  if (!data || typeof data !== "object") {
    return ["Kayıt başarısız."];
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

  return messages.length > 0 ? messages : ["Kayıt başarısız."];
}

function VerifyEmailStep({ email }: { email: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const explicitNextPath = searchParams.get("next");

  const [code, setCode] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  useEffect(() => {
    if (resendCooldown <= 0) {
      return;
    }

    const timer = setTimeout(() => setResendCooldown((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setErrors([]);
    setIsVerifying(true);

    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors(flattenErrors(data));
        return;
      }

      // login/page.tsx ile aynı mantık: next varsa öncelikli, yoksa
      // müşteri anasayfada kalır, diğer roller /dashboard'a gider.
      const defaultPath = data.role === "customer" ? "/" : "/dashboard";
      router.push(explicitNextPath || defaultPath);
      router.refresh();
    } catch {
      setErrors(["Bir hata oluştu, lütfen tekrar deneyin."]);
    } finally {
      setIsVerifying(false);
    }
  }

  async function handleResend() {
    setResendMessage(null);
    setIsResending(true);

    try {
      await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      setResendMessage("Yeni bir kod gönderildi.");
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
    } catch {
      setResendMessage("Kod gönderilemedi, lütfen tekrar deneyin.");
    } finally {
      setIsResending(false);
    }
  }

  return (
    <form
      onSubmit={handleVerify}
      className="w-full max-w-sm space-y-4 rounded-lg border border-line bg-card p-6 shadow-sm"
    >
      <div>
        <h1 className="text-lg font-bold text-foreground">
          E-postanı Doğrula
        </h1>
        <p className="mt-1 text-sm text-fg-muted">
          <strong>{email}</strong> adresine gönderdiğimiz 6 haneli kodu gir.
        </p>
      </div>

      <div>
        <label htmlFor="code" className="block text-sm font-medium">
          Doğrulama Kodu
        </label>
        <input
          id="code"
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
          required
          className="mt-1 w-full rounded border border-line bg-card px-3 py-2 text-center text-lg tracking-[0.5em] text-foreground"
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
        disabled={isVerifying || code.length !== 6}
        className="w-full rounded bg-primary px-4 py-2 text-primary-foreground transition hover:bg-primary-hover disabled:opacity-50"
      >
        {isVerifying ? "Doğrulanıyor..." : "Doğrula"}
      </button>

      <div className="text-center text-sm text-fg-muted">
        {resendMessage && <p className="mb-1">{resendMessage}</p>}
        <button
          type="button"
          onClick={handleResend}
          disabled={isResending || resendCooldown > 0}
          className="font-medium text-primary hover:underline disabled:cursor-not-allowed disabled:text-fg-subtle disabled:no-underline"
        >
          {resendCooldown > 0
            ? `Kodu tekrar gönder (${resendCooldown}sn)`
            : "Kodu tekrar gönder"}
        </button>
      </div>
    </form>
  );
}

function RegisterForm() {
  const [step, setStep] = useState<"register" | "verify">("register");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors([]);
    setIsSubmitting(true);

    try {
      const registerResponse = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          password_confirm: passwordConfirm,
          first_name: firstName,
          last_name: lastName,
          phone,
        }),
      });

      const registerData = await registerResponse.json();

      if (!registerResponse.ok) {
        setErrors(flattenErrors(registerData));
        return;
      }

      // Kayıt başarılı ama hesap henüz aktif değil (is_active=False) —
      // email'e gönderilen kodu doğrulamadan login yapılamaz. Otomatik
      // login yerine aynı sayfada kod girme adımına geçiyoruz.
      setStep("verify");
    } catch {
      setErrors(["Bir hata oluştu, lütfen tekrar deneyin."]);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (step === "verify") {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <VerifyEmailStep email={email} />
      </div>
    );
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
          <label htmlFor="first_name" className="block text-sm font-medium">
            Ad
          </label>
          <input
            id="first_name"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="mt-1 w-full rounded border border-line bg-card px-3 py-2 text-foreground"
          />
        </div>

        <div>
          <label htmlFor="last_name" className="block text-sm font-medium">
            Soyad
          </label>
          <input
            id="last_name"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="mt-1 w-full rounded border border-line bg-card px-3 py-2 text-foreground"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium">
            Telefon
          </label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1 w-full rounded border border-line bg-card px-3 py-2 text-foreground"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium">
            Şifre
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 w-full rounded border border-line bg-card px-3 py-2 text-foreground"
          />
        </div>

        <div>
          <label htmlFor="password_confirm" className="block text-sm font-medium">
            Şifre (Tekrar)
          </label>
          <input
            id="password_confirm"
            type="password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
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
          {isSubmitting ? "Kayıt olunuyor..." : "Kayıt Ol"}
        </button>

        <p className="text-center text-sm text-fg-muted">
          Zaten hesabın var mı?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Giriş Yap
          </Link>
        </p>
      </form>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterForm />
    </Suspense>
  );
}
