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

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isDashboard = pathname.startsWith("/dashboard");
  const isHesabim = pathname.startsWith("/hesabim");

  if (!isDashboard && !isHesabim) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get("access_token")?.value;

  if (!accessToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const response = await fetch(`${API_URL}/auth/me/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const user = await response.json();

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

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/hesabim/:path*"],
};