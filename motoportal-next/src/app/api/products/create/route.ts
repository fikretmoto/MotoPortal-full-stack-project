import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

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

  const data = await djangoResponse.json();

  return NextResponse.json(data, { status: djangoResponse.status });
}