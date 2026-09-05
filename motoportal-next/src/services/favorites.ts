"use server";

import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type ToggleFavoriteResult = {
  success: boolean;
  is_favorited?: boolean;
  requiresAuth?: boolean;
  error?: string;
};

export async function toggleFavorite(
  slug: string
): Promise<ToggleFavoriteResult> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    return {
      success: false,
      requiresAuth: true,
      error: "Favorilemek için giriş yapmalısın.",
    };
  }

  const response = await fetch(`${API_URL}/products/${slug}/favorite/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    return {
      success: false,
      error: "Favori işlemi başarısız oldu.",
    };
  }

  const data: { is_favorited: boolean } = await response.json();

  return {
    success: true,
    is_favorited: data.is_favorited,
  };
}