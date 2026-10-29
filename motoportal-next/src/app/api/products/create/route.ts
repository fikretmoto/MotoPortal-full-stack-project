import { getValidAccessToken } from "@/services/auth";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const accessToken = await getValidAccessToken(cookieStore, "products/create");

  if (!accessToken) {
    return NextResponse.json(
      { detail: "Oturum açmanız gerekiyor." },
      { status: 401 }
    );
  }

  const body = await request.json();

  const djangoResponse = await fetch(`${API_URL}/products/create/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(body),
  });

  // Django JSON yerine HTML hata sayfası dönerse çökmek yerine
  // gövdeyi metin olarak okuyup anlaşılır bir hata döndürüyoruz.
  const text = await djangoResponse.text();

  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    console.error(
      "Django JSON olmayan yanıt döndü:",
      djangoResponse.status,
      text.slice(0, 500)
    );
    return NextResponse.json(
      {
        detail: `Sunucu hatası (${djangoResponse.status}). Django terminalindeki hata satırına bakın.`,
      },
      { status: djangoResponse.status >= 400 ? djangoResponse.status : 502 }
    );
  }

  return NextResponse.json(data, { status: djangoResponse.status });
}