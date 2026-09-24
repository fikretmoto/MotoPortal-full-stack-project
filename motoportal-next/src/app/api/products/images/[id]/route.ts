import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function DELETE(request: Request, { params }: RouteParams) {
  const { id } = await params;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    return NextResponse.json(
      { detail: "Oturum açmanız gerekiyor." },
      { status: 401 }
    );
  }

  const djangoResponse = await fetch(`${API_URL}/products/images/${id}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (djangoResponse.status === 204) {
    return new NextResponse(null, { status: 204 });
  }

  const data = await djangoResponse.json();

  return NextResponse.json(data, { status: djangoResponse.status });
}
