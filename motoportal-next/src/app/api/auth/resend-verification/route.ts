import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(request: Request) {
  const body = await request.json();

  const djangoResponse = await fetch(`${API_URL}/auth/resend-verification/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await djangoResponse.json();

  return NextResponse.json(data, { status: djangoResponse.status });
}
