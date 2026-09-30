import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function getSafeNextPath(rawNext: FormDataEntryValue | null): string | null {
  if (typeof rawNext !== "string" || rawNext.length === 0) {
    return null;
  }

  // Açık yönlendirmeyi (open redirect) önlemek için sadece site-içi,
  // göreli bir path kabul ediyoruz — "//evil.com" gibi protokole
  // göreli URL'ler reddedilir.
  if (!rawNext.startsWith("/") || rawNext.startsWith("//")) {
    return null;
  }

  return rawNext;
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refresh_token")?.value;
  const accessToken = cookieStore.get("access_token")?.value;

  let nextPath: string | null = null;
  try {
    const formData = await request.formData();
    nextPath = getSafeNextPath(formData.get("next"));
  } catch {
    // Body form-data değilse (örn. boş istek) next'siz devam ediyoruz.
  }

  if (refreshToken) {
    try {
      // LogoutAPIView IsAuthenticated gerektiriyor (blacklist işlemini
      // request.user üzerinden değil ama yetkilendirme için yapıyor) —
      // Authorization header'sız istek 401 alır ve refresh token asla
      // blacklist'e girmez.
      await fetch(`${API_URL}/auth/logout/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });
    } catch {
      // Django'ya ulaşılamasa bile devam ediyoruz.
    }
  }

  // status: 303 -- varsayılan 307, orijinal metodu (POST) korur ve
  // tarayıcı /login'e de POST ile gider (405 Method Not Allowed).
  // 303 tarayıcıyı takip eden istekte her zaman GET'e zorlar.
  const loginUrl = new URL("/login", request.url);
  if (nextPath) {
    loginUrl.searchParams.set("next", nextPath);
  }

  const response = NextResponse.redirect(loginUrl, { status: 303 });

  response.cookies.delete("access_token");
  response.cookies.delete("refresh_token");

  return response;
}