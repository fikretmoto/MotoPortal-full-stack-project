import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(request: Request) {
  const { email, password } = await request.json();

  const djangoResponse = await fetch(`${API_URL}/token/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!djangoResponse.ok) {
    return NextResponse.json(
      { detail: "E-posta veya şifre hatalı." },
      { status: 401 }
    );
  }

  const { access, refresh } = await djangoResponse.json();

  // Rol bazlı yönlendirme için (login/page.tsx) kullanıcının rolünü
  // de dönüyoruz — JWT payload'ında role claim'i yok (SimpleJWT
  // varsayılanı), bu yüzden ayrı bir /auth/me/ isteği gerekiyor.
  let role: string | null = null;

  try {
    const meResponse = await fetch(`${API_URL}/auth/me/`, {
      headers: { Authorization: `Bearer ${access}` },
    });

    if (meResponse.ok) {
      const me = await meResponse.json();
      role = me.role ?? null;
    }
  } catch {
    role = null;
  }

  const response = NextResponse.json({ success: true, role });

  response.cookies.set("access_token", access, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 15, // 15 dakika — Django'daki ACCESS_TOKEN_LIFETIME ile aynı
  });

  response.cookies.set("refresh_token", refresh, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 gün — Django'daki REFRESH_TOKEN_LIFETIME ile aynı
  });

  return response;
}