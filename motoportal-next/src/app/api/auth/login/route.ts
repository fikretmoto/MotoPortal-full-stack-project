import { NextResponse } from "next/server";
import { fetchRoleForAccessToken, setAuthCookies } from "@/services/auth";

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
  const role = await fetchRoleForAccessToken(access);

  const response = NextResponse.json({ success: true, role });
  setAuthCookies(response, access, refresh);

  return response;
}
