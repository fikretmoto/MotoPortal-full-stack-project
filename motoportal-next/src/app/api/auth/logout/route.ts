import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (refreshToken) {
    try {
      await fetch(`${API_URL}/auth/logout/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: refreshToken }),
      });
    } catch {
      // Django'ya ulaşılamasa bile devam ediyoruz.
    }
  }

  // status: 303 -- varsayılan 307, orijinal metodu (POST) korur ve
  // tarayıcı /login'e de POST ile gider (405 Method Not Allowed).
  // 303 tarayıcıyı takip eden istekte her zaman GET'e zorlar.
  const response = NextResponse.redirect(
    new URL("/login", request.url),
    { status: 303 }
  );

  response.cookies.delete("access_token");
  response.cookies.delete("refresh_token");

  return response;
}