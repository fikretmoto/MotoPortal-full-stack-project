import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    return NextResponse.json(
      { detail: "Oturum açmanız gerekiyor." },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const brand = searchParams.get("brand");

  const djangoUrl = brand
    ? `${API_URL}/vehicle-models/?brand=${encodeURIComponent(brand)}`
    : `${API_URL}/vehicle-models/`;

  const djangoResponse = await fetch(djangoUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  const data = await djangoResponse.json();

  return NextResponse.json(data, { status: djangoResponse.status });
}
