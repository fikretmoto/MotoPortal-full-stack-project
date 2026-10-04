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
  const ts = () => new Date().toISOString();

  const isDashboard = pathname.startsWith("/dashboard");
  const isHesabim = pathname.startsWith("/hesabim");

  if (!isDashboard && !isHesabim) {
    return NextResponse.next();
  }

  console.log(`[MW-DEBUG ${ts()}] pathname=${pathname} | middleware tetiklendi`);

  let accessToken = request.cookies.get("access_token")?.value;
  console.log(
    `[MW-DEBUG ${ts()}] pathname=${pathname} | access_token var mı=${!!accessToken}` +
      (accessToken ? ` | son8=...${accessToken.slice(-8)}` : "")
  );

  // access_token cookie'si yoksa (süresi dolup silindiyse), refresh_token
  // ile arka planda sessizce yeni bir access_token almayı dene — sayfa
  // gezinmesinde artık login'e atmak yerine kullanıcıyı içeride tutar.
  let refreshedAccess: string | null = null;
  let refreshedRefresh: string | undefined;

    if (!accessToken) {
    const refreshToken = request.cookies.get("refresh_token")?.value;
    console.log(
      `[MW-DEBUG ${ts()}] pathname=${pathname} | refresh_token var mı=${!!refreshToken}`
    );
    if (refreshToken) {
      console.log(`[MW-DEBUG ${ts()}] pathname=${pathname} | refresh deneniyor`);
      const result = await tryRefresh(refreshToken);
      console.log(
        `[MW-DEBUG ${ts()}] pathname=${pathname} | refresh sonucu=${
          result ? "BAŞARILI" : "BAŞARISIZ/null"
        }`
      );
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
    console.log(
      `[MW-DEBUG ${ts()}] pathname=${pathname} | SONUÇ: login'e yönlendiriliyor (access_token yok/refresh başarısız)`
    );
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

    console.log(
      `[MW-DEBUG ${ts()}] pathname=${pathname} | /auth/me/ HTTP status=${meResponse.status}`
    );

    if (!meResponse.ok) {
      console.log(
        `[MW-DEBUG ${ts()}] pathname=${pathname} | SONUÇ: login'e yönlendiriliyor (/auth/me/ başarısız)`
      );
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const user = await meResponse.json();

    if (isDashboard && !DASHBOARD_ALLOWED_ROLES.includes(user.role)) {
      console.log(
        `[MW-DEBUG ${ts()}] pathname=${pathname} | SONUÇ: erisim-engellendi'ye yönlendiriliyor (role=${user.role})`
      );
      return NextResponse.redirect(
        new URL("/erisim-engellendi", request.url)
      );
    }

    if (isHesabim && !HESABIM_ALLOWED_ROLES.includes(user.role)) {
      console.log(
        `[MW-DEBUG ${ts()}] pathname=${pathname} | SONUÇ: dashboard'a yönlendiriliyor (customer değil)`
      );
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  } catch (err) {
    // Backend'e ulaşılamazsa burada sert biçimde engellemiyoruz —
    // dashboard/layout.tsx ve hesabim/layout.tsx aynı kontrolü kendi
    // taraflarında zaten bağımsız olarak tekrar yapacak.
    console.log(
      `[MW-DEBUG ${ts()}] pathname=${pathname} | SONUÇ: EXCEPTION yakalandı, devam ediliyor (fail-open): ${err}`
    );
    return NextResponse.next();
  }

  console.log(
    `[MW-DEBUG ${ts()}] pathname=${pathname} | SONUÇ: devam ediyor (erişim izni verildi)` +
      (refreshedAccess ? " | token yenilendi" : "")
  );

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