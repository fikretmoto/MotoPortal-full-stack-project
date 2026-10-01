import { NextResponse } from "next/server";
import { fetchRoleForAccessToken, setAuthCookies } from "@/services/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(request: Request) {
  const { email, code } = await request.json();

  const djangoResponse = await fetch(`${API_URL}/auth/verify-email/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code }),
  });

  const data = await djangoResponse.json();

  if (!djangoResponse.ok) {
    return NextResponse.json(data, { status: djangoResponse.status });
  }

  const { access, refresh } = data;
  const role = await fetchRoleForAccessToken(access);

  const response = NextResponse.json({ success: true, role });
  setAuthCookies(response, access, refresh);

  return response;
}
