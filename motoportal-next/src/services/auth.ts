import { cookies } from "next/headers";
import type { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type CurrentUser = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  phone: string;
  avatar: string | null;
  role: string;
  email_verified: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    return null;
  }

  const response = await fetch(`${API_URL}/auth/me/`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
}

// login/route.ts ve verify-email/route.ts ortak kullanıyor: JWT
// çifti geldikten sonra httpOnly cookie'lere yazma mantığı aynı,
// tek yerde tutuluyor.
export function setAuthCookies(
  response: NextResponse,
  access: string,
  refresh: string
) {
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
}

// Taze bir access token'dan role bilgisini okumak için (JWT
// payload'ında role claim'i yok, SimpleJWT varsayılanı).
export async function fetchRoleForAccessToken(
  access: string
): Promise<string | null> {
  try {
    const response = await fetch(`${API_URL}/auth/me/`, {
      headers: { Authorization: `Bearer ${access}` },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.role ?? null;
  } catch {
    return null;
  }
}

// Aynı refresh_token için aynı anda birden fazla istek gelirse, AĞ
// isteğini (tek bir /token/refresh/ çağrısı) paylaşsınlar — ama
// cookie'yi her çağıran kendi cookieStore'una kendisi yazacak, bu
// yüzden sonuç burada sadece {access, refresh} olarak paylaşılıyor,
// cookie yazma işlemi paylaşılmıyor. refresh_token değerine göre
// anahtarlanıyor, böylece farklı kullanıcıların eşzamanlı istekleri
// birbirine karışmıyor.
const refreshPromises = new Map<
  string,
  Promise<{ access: string; refresh?: string } | null>
>();

async function performRefresh(
  refreshToken: string,
  callerTag: string = "unknown"
): Promise<{ access: string; refresh?: string } | null> {
  const ts = () => new Date().toISOString();
  let promise = refreshPromises.get(refreshToken);

  if (!promise) {
    console.log(
      `[AUTH-DEBUG ${ts()}] caller=${callerTag} | /token/refresh/ isteği ATILIYOR (yeni)`
    );
    promise = (async () => {
      try {
        const response = await fetch(`${API_URL}/token/refresh/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh: refreshToken }),
        });

        console.log(
          `[AUTH-DEBUG ${ts()}] caller=${callerTag} | /token/refresh/ HTTP status=${response.status}`
        );

        if (!response.ok) {
          return null;
        }

        const data = await response.json();
        return { access: data.access, refresh: data.refresh };
      } catch (err) {
        console.log(
          `[AUTH-DEBUG ${ts()}] caller=${callerTag} | /token/refresh/ EXCEPTION: ${err}`
        );
        return null;
      } finally {
        refreshPromises.delete(refreshToken);
      }
    })();

    refreshPromises.set(refreshToken, promise);
  } else {
    console.log(
      `[AUTH-DEBUG ${ts()}] caller=${callerTag} | mevcut /token/refresh/ promise'ine KATILDI (ağ isteği atmadı)`
    );
  }

  return promise;
}

export async function getValidAccessToken(
  cookieStore: Awaited<ReturnType<typeof cookies>>,
  callerTag: string = "unknown"
): Promise<string | null> {
  const ts = () => new Date().toISOString();
  console.log(
    `[AUTH-DEBUG ${ts()}] getValidAccessToken çağrıldı | caller=${callerTag}`
  );

  const existing = cookieStore.get("access_token")?.value;
  console.log(
    `[AUTH-DEBUG ${ts()}] caller=${callerTag} | access_token var mı=${!!existing}` +
      (existing ? ` | son8=...${existing.slice(-8)}` : "")
  );

  if (existing) {
    console.log(
      `[AUTH-DEBUG ${ts()}] caller=${callerTag} | SONUÇ: mevcut access_token döndürüldü, refresh yok`
    );
    return existing;
  }

  const refreshToken = cookieStore.get("refresh_token")?.value;
  console.log(
    `[AUTH-DEBUG ${ts()}] caller=${callerTag} | refresh_token var mı=${!!refreshToken}`
  );

  if (!refreshToken) {
    console.log(
      `[AUTH-DEBUG ${ts()}] caller=${callerTag} | SONUÇ: null (refresh_token da yok)`
    );
    return null;
  }

  const alreadyInFlight = refreshPromises.has(refreshToken);
  console.log(
    `[AUTH-DEBUG ${ts()}] caller=${callerTag} | refresh ${
      alreadyInFlight ? "paylaşılan promise'e katılıyor" : "YENİ başlatılıyor"
    } (Map boyutu önce=${refreshPromises.size})`
  );

  const result = await performRefresh(refreshToken, callerTag);

  console.log(
    `[AUTH-DEBUG ${ts()}] caller=${callerTag} | performRefresh sonucu=${
      result ? "BAŞARILI" : "BAŞARISIZ/null"
    }` + (result ? ` | yeni access son8=...${result.access.slice(-8)}` : "")
  );

  if (!result) {
    console.log(
      `[AUTH-DEBUG ${ts()}] caller=${callerTag} | SONUÇ: null (refresh başarısız)`
    );
    return null;
  }

  // Her çağıran, aldığı sonucu KENDİ cookieStore'una yazıyor — bu
  // sayede aynı anda gelen her isteğin kendi tarayıcı yanıtı da
  // güncel cookie'leri taşıyor, sadece ilki değil.
  cookieStore.set("access_token", result.access, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 15,
  });

  if (result.refresh) {
    cookieStore.set("refresh_token", result.refresh, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  console.log(
    `[AUTH-DEBUG ${ts()}] caller=${callerTag} | SONUÇ: yeni access_token döndürüldü (son8=...${result.access.slice(-8)})`
  );

  return result.access;
}