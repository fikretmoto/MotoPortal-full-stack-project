import Link from "next/link";
import { cookies } from "next/headers";
import type { BlogComment } from "@/services/blog";
import BlogCommentForm from "./BlogCommentForm";

type BlogCommentsSectionProps = {
  slug: string;
  comments: BlogComment[];
};

// "23.11.2026 14:05" biçimi, Türkiye saat diliminde.
function formatCommentDate(value: string): string | null {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat("tr-TR", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "Europe/Istanbul",
  }).format(date);
}

export default async function BlogCommentsSection({
  slug,
  comments,
}: BlogCommentsSectionProps) {
  // Ürün sayfasındaki gibi giriş durumu sunucuda cookie'den okunuyor.
  // Sadece refresh_token kalmışsa da form gösteriliyor -- token
  // yenileme işini submitBlogComment (getValidAccessToken) üstleniyor.
  const cookieStore = await cookies();
  const isAuthenticated = Boolean(
    cookieStore.get("access_token")?.value ||
      cookieStore.get("refresh_token")?.value
  );

  const loginHref = `/login?next=${encodeURIComponent(`/blog/${slug}`)}`;

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold text-foreground">
        Yorumlar ({comments.length})
      </h2>

      <div className="mt-6 flex flex-col gap-6">
        {isAuthenticated ? (
          <BlogCommentForm slug={slug} />
        ) : (
          <p className="text-sm text-fg-muted">
            Yorum yapmak için{" "}
            <Link
              href={loginHref}
              className="text-primary underline underline-offset-2 hover:text-primary-hover"
            >
              giriş yapın
            </Link>
            .
          </p>
        )}

        <div className="flex flex-col gap-4 border-t border-line pt-4">
          {comments.length === 0 ? (
            <p className="text-sm text-fg-muted">Henüz yorum yok.</p>
          ) : (
            comments.map((comment) => {
              const commentDate = formatCommentDate(comment.created_at);

              return (
                <article
                  key={comment.id}
                  className="border-b border-line pb-4 last:border-b-0"
                >
                  <div className="mb-1 flex flex-wrap items-baseline gap-x-2">
                    <span className="text-sm font-bold text-foreground">
                      {comment.author_name}
                    </span>
                    {commentDate && (
                      <time
                        dateTime={comment.created_at}
                        className="text-xs text-fg-subtle"
                      >
                        {commentDate}
                      </time>
                    )}
                  </div>
                  <p className="whitespace-pre-line text-sm leading-relaxed text-foreground">
                    {comment.body}
                  </p>
                </article>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
