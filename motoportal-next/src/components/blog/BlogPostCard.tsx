import Link from "next/link";
import Image from "next/image";
import type { BlogPost } from "@/services/blog";
import { Card, CardContent } from "@/components/ui/card";

type BlogPostCardProps = {
  post: BlogPost;
};

// "22 Kasım 2026" biçimi. Sunucunun saat diliminden bağımsız olsun
// diye Türkiye saat dilimi sabit veriliyor (gece yarısına yakın
// yayınlarda gün kaymasın).
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

export default function BlogPostCard({ post }: BlogPostCardProps) {
  const publishedDate = post.published_at
    ? formatPublishedDate(post.published_at)
    : null;

  return (
    <Link href={`/blog/${post.slug}`} className="group block h-full">
      <Card className="h-full w-full gap-0 overflow-hidden rounded-2xl border border-transparent bg-card p-0 transition-all duration-200 hover:-translate-y-0.5 hover:border-line hover:shadow-lg">
        {post.cover_image && (
          <div className="relative aspect-video w-full overflow-hidden bg-surface">
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            />
          </div>
        )}

        <CardContent className="flex flex-1 flex-col gap-2 p-4 sm:p-5">
          {publishedDate && (
            <time
              dateTime={post.published_at ?? undefined}
              className="text-xs font-semibold uppercase tracking-wide text-fg-subtle"
            >
              {publishedDate}
            </time>
          )}

          <h3 className="line-clamp-2 text-base font-bold tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-lg">
            {post.title}
          </h3>

          {post.summary && (
            <p className="line-clamp-3 text-sm leading-relaxed text-fg-muted">
              {post.summary}
            </p>
          )}

          <span className="mt-auto pt-3 text-sm font-semibold text-primary group-hover:text-primary-hover">
            Devamını oku →
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}
