"use server";

import { cookies } from "next/headers";
import { getValidAccessToken } from "./auth";
import type { SubmitReviewResult } from "./reviews";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// reviews.ts'deki submitReview ile aynı dönüş yapısı:
// { success, requiresAuth?, error? }
export type SubmitBlogCommentResult = SubmitReviewResult;

const AUTH_REQUIRED_MESSAGE = "Yorum yapmak için giriş yapmalısın.";
const GENERIC_ERROR_MESSAGE = "Yorum gönderilemedi. Lütfen tekrar deneyin.";

// DRF doğrulama hatalarından (örn. { body: ["Bu alan boş olamaz."] }
// veya { detail: "..." }) ilk okunabilir mesajı çıkarır.
function extractErrorMessage(data: unknown): string | null {
  if (!data || typeof data !== "object") {
    return null;
  }

  const record = data as Record<string, unknown>;

  if (typeof record.detail === "string") {
    return record.detail;
  }

  for (const value of Object.values(record)) {
    if (typeof value === "string") {
      return value;
    }
    if (Array.isArray(value) && typeof value[0] === "string") {
      return value[0];
    }
  }

  return null;
}

export async function submitBlogComment(
  slug: string,
  body: string
): Promise<SubmitBlogCommentResult> {
  const trimmedBody = body.trim();

  if (!trimmedBody) {
    return { success: false, error: "Yorum boş olamaz." };
  }

  const cookieStore = await cookies();
  const accessToken = await getValidAccessToken(cookieStore, "blog/comments");

  if (!accessToken) {
    return {
      success: false,
      requiresAuth: true,
      error: AUTH_REQUIRED_MESSAGE,
    };
  }

  let response: Response;
  try {
    response = await fetch(
      `${API_URL}/blog/${encodeURIComponent(slug)}/comments/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ body: trimmedBody }),
      }
    );
  } catch {
    return { success: false, error: GENERIC_ERROR_MESSAGE };
  }

  if (response.ok) {
    return { success: true };
  }

  if (response.status === 401) {
    return {
      success: false,
      requiresAuth: true,
      error: AUTH_REQUIRED_MESSAGE,
    };
  }

  if (response.status === 403) {
    return {
      success: false,
      error: "Bu işlem için yetkin yok.",
    };
  }

  if (response.status === 404) {
    return {
      success: false,
      error: "Yazı bulunamadı.",
    };
  }

  // Django JSON yerine HTML hata sayfası dönebilir -- metni okuyup
  // JSON olarak parse etmeyi deniyoruz, olmazsa genel mesaj.
  const text = await response.text();

  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    console.error(
      "Blog yorum: Django JSON olmayan yanıt döndü:",
      response.status,
      text.slice(0, 500)
    );
    return { success: false, error: GENERIC_ERROR_MESSAGE };
  }

  if (response.status === 400) {
    return {
      success: false,
      error: extractErrorMessage(data) ?? "Yorum geçersiz. Lütfen kontrol et.",
    };
  }

  return {
    success: false,
    error: extractErrorMessage(data) ?? GENERIC_ERROR_MESSAGE,
  };
}
