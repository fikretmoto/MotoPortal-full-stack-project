import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

import BlogContent from "@/components/blog/BlogContent";
import BlogCommentsSection from "@/components/blog/BlogCommentsSection";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getBlogPostBySlug, type BlogPostDetail } from "@/services/blog";
import { stripHtml, truncateAtWord } from "@/lib/seo";

const DESCRIPTION_MAX_LENGTH = 160;

type BlogPostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function buildBlogDescription(post: BlogPostDetail): string {
  const source = post.summary?.trim()
    ? post.summary.trim()
    : stripHtml(post.content ?? "");

  if (source.length <= DESCRIPTION_MAX_LENGTH) {
    return source;
  }

  // "…" dahil toplam 160 karakteri aşmasın.
  return `${truncateAtWord(source, DESCRIPTION_MAX_LENGTH - 1)}…`;
}

// "22 Kasım 2026" biçimi, Türkiye saat diliminde.
function formatPublishedDate(value: string): string | null {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Istanbul",
  }).format(date);
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;

  // getBlogPostBySlug React cache() ile sarmalı (services/blog.ts) --
  // sayfa gövdesi aynı slug için tekrar çağırdığında fetch tekrarlanmıyor.
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return { title: "Yazı bulunamadı" };
  }

  const title = post.title;
  const description = buildBlogDescription(post);
  const canonical = `/blog/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "article",
      ...(post.cover_image
        ? { images: [{ url: post.cover_image, alt: title }] }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(post.cover_image ? { images: [post.cover_image] } : {}),
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const publishedDate = post.published_at
    ? formatPublishedDate(post.published_at)
    : null;

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Ana Sayfa</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/blog">Blog</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{post.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <article className="mt-6">
        <header>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {post.title}
          </h1>

          {publishedDate && (
            <time
              dateTime={post.published_at ?? undefined}
              className="mt-3 block text-sm font-semibold uppercase tracking-wide text-fg-subtle"
            >
              {publishedDate}
            </time>
          )}
        </header>

        {post.cover_image && (
          <div className="relative mt-6 aspect-video w-full overflow-hidden rounded-2xl bg-surface">
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              priority
              className="object-cover"
              sizes="(min-width: 768px) 720px, 100vw"
            />
          </div>
        )}

        <div className="mt-8">
          <BlogContent content={post.content} />
        </div>
      </article>

      <BlogCommentsSection slug={post.slug} comments={post.comments} />
    </main>
  );
}
