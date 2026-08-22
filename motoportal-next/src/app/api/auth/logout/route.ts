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

  const response = NextResponse.redirect(new URL("/login", request.url));

  response.cookies.delete("access_token");
  response.cookies.delete("refresh_token");

  return response;
}