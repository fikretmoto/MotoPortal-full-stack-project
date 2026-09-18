"use server";

import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type SubmitReviewResult = {
  success: boolean;
  requiresAuth?: boolean;
  error?: string;
};

export async function submitReview(
  slug: string,
  productId: number,
  rating: number,
  comment: string
): Promise<SubmitReviewResult> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    return {
      success: false,
      requiresAuth: true,
      error: "Yorum yapmak için giriş yapmalısın.",
    };
  }

  const response = await fetch(`${API_URL}/products/${slug}/reviews/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      product: productId,
      rating,
      comment,
    }),
  });

  if (response.ok) {
    return { success: true };
  }

  if (response.status === 401) {
    return {
      success: false,
      requiresAuth: true,
      error: "Yorum yapmak için giriş yapmalısın.",
    };
  }

  if (response.status === 403) {
    return {
      success: false,
      error: "Bu işlem için müşteri hesabı gerekiyor.",
    };
  }

  return {
    success: false,
    error: "Yorum gönderilemedi. Lütfen tekrar deneyin.",
  };
}
