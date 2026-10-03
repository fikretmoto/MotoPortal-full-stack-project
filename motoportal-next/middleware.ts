import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Backend'deki CanManageProducts permission'ıyla aynı rol listesi
// (apps/catalog/permissions.py). JWT access_token'ın payload'ında
// role claim'i yok (SimpleJWT varsayılanı), bu yüzden burada
// /auth/me/'ye ayrı bir istek atılıyor — dashboard/layout.tsx ve
// hesabim/layout.tsx'teki (getCurrentUser() ile aynı endpoint)
// kontrolle birlikte iki bağımsız savunma katmanı oluşturuyor.
const DASHBOARD_ALLOWED_ROLES = ["super_admin", "admin", "editor", "dealer"];

// /hesabim, dealer/admin panelinden tamamen ayrı bir müşteri alanı —
// sadece customer rolüne açık, diğer roller /dashboard'a düşer.
const HESABIM_ALLOWED_ROLES = ["customer"];

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function tryRefresh(
  refreshToken: string
): Promise<{ access: string; refresh?: string } | null> {
  try {
    const response = await fetch(`${API_URL}/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return { access: data.access, refresh: data.refresh };
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isDashboard = pathname.startsWith("/dashboard");
  const isHesabim = pathname.startsWith("/hesabim");

  if (!isDashboard && !isHesabim) {
    return NextResponse.next();
  }

  let accessToken = request.cookies.get("access_token")?.value;

  // access_token cookie'si yoksa (süresi dolup silindiyse), refresh_token
  // ile arka planda sessizce yeni bir access_token almayı dene — sayfa
  // gezinmesinde artık login'e atmak yerine kullanıcıyı içeride tutar.
  let refreshedAccess: string | null = null;
  let refreshedRefresh: string | undefined;

    if (!accessToken) {
    const refreshToken = request.cookies.get("refresh_token")?.value;
    if (refreshToken) {
      const result = await tryRefresh(refreshToken);
      if (result) {
        accessToken = result.access;
        refreshedAccess = result.access;
        refreshedRefresh = result.refresh;
        // Aynı istek içinde sayfa render edilirken (Server Component'lar)
        // taze token'ı görebilsin diye, request'in kendi cookie'sini de
        // güncelliyoruz — sadece tarayıcıya geri yazmak yetmiyor.
        request.cookies.set("access_token", result.access);
      }
    }
  }

  if (!accessToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const meResponse = await fetch(`${API_URL}/auth/me/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!meResponse.ok) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const user = await meResponse.json();

    if (isDashboard && !DASHBOARD_ALLOWED_ROLES.includes(user.role)) {
      return NextResponse.redirect(
        new URL("/erisim-engellendi", request.url)
      );
    }

    if (isHesabim && !HESABIM_ALLOWED_ROLES.includes(user.role)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  } catch {
    // Backend'e ulaşılamazsa burada sert biçimde engellemiyoruz —
    // dashboard/layout.tsx ve hesabim/layout.tsx aynı kontrolü kendi
    // taraflarında zaten bağımsız olarak tekrar yapacak.
    return NextResponse.next();
  }

    const response = NextResponse.next({ request });

  // Refresh başarılı olduysa, yeni token'ları tarayıcıya geri yaz —
  // böylece sonraki istekler de taze access_token'ı kullanır.
  if (refreshedAccess) {
    response.cookies.set("access_token", refreshedAccess, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 15,
    });

    if (refreshedRefresh) {
      response.cookies.set("refresh_token", refreshedRefresh, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
      });
    }
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/hesabim/:path*"],
};