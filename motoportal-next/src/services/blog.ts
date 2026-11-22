import { cache } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type BlogPost = {
  id: number;
  title: string;
  slug: string;
  summary: string;
  cover_image: string | null;
  published_at: string | null;
};

export type BlogComment = {
  id: number;
  author_name: string;
  body: string;
  created_at: string;
};

export type BlogPostDetail = BlogPost & {
  content: string;
  comments: BlogComment[];
};

// Liste endpoint'i sayfalı değil (backend'de pagination_class = None),
// düz dizi dönüyor. Hata durumunda sayfa çökmesin diye boş liste.
export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const response = await fetch(`${API_URL}/blog/`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return [];
    }

    return response.json();
  } catch {
    return [];
  }
}

// React cache() ile sarmalı: generateMetadata ve sayfa gövdesi aynı
// slug için çağırdığında gerçek fetch tek bir kez yapılır (no-store
// fetch Next.js tarafından memoize edilmediği için).
export const getBlogPostBySlug = cache(
  async (slug: string): Promise<BlogPostDetail | null> => {
    try {
      const response = await fetch(
        `${API_URL}/blog/${encodeURIComponent(slug)}/`,
        {
          cache: "no-store",
        }
      );

      if (!response.ok) {
        return null;
      }

      return response.json();
    } catch {
      return null;
    }
  }
);
