import type { Metadata } from "next";
import BlogPostCard from "@/components/blog/BlogPostCard";
import { getBlogPosts } from "@/services/blog";

const BLOG_DESCRIPTION =
  "Motosiklet ve bisiklet dünyasından haberler, model incelemeleri, bakım ipuçları ve sürüş rehberleri MotoPortal Blog'da.";

export const metadata: Metadata = {
  title: "Blog",
  description: BLOG_DESCRIPTION,
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Blog",
    description: BLOG_DESCRIPTION,
    url: "/blog",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog",
    description: BLOG_DESCRIPTION,
  },
};

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Blog
        </h1>
        <p className="mt-2 text-fg-muted">
          Motosiklet ve bisiklet üzerine incelemeler, ipuçları ve haberler.
        </p>
      </header>

      {posts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p className="py-16 text-center text-fg-muted">Henüz yazı yok.</p>
      )}
    </main>
  );
}
