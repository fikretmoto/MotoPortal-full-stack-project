"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { submitReview } from "@/services/reviews";

type ReviewFormProps = {
  slug: string;
  productId: number;
  isAuthenticated: boolean;
  onSubmitted?: () => void;
};

export default function ReviewForm({
  slug,
  productId,
  isAuthenticated,
  onSubmitted,
}: ReviewFormProps) {
  const pathname = usePathname();

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isAuthenticated) {
    return (
      <p className="text-sm text-fg-muted">
        Yorum yapmak için{" "}
        <Link
          href={`/login?next=${encodeURIComponent(pathname)}`}
          className="text-primary underline underline-offset-2 hover:text-primary-hover"
        >
          giriş yapın
        </Link>
        .
      </p>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (rating === 0 || !comment.trim() || isSubmitting) {
      return;
    }

    setError(null);
    setIsSubmitting(true);

    const result = await submitReview(slug, productId, rating, comment.trim());

    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error ?? "Yorum gönderilemedi. Lütfen tekrar deneyin.");
      return;
    }

    setSuccess(true);
    setRating(0);
    setHoverRating(0);
    setComment("");
    onSubmitted?.();
  }

  const displayRating = hoverRating || rating;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, index) => {
          const value = index + 1;

          return (
            <button
              key={value}
              type="button"
              aria-label={`${value} yıldız`}
              onClick={() => setRating(value)}
              onMouseEnter={() => setHoverRating(value)}
              onMouseLeave={() => setHoverRating(0)}
              className="text-2xl leading-none transition"
            >
              <span
                className={
                  value <= displayRating ? "text-amber-500" : "text-fg-subtle"
                }
              >
                ★
              </span>
            </button>
          );
        })}
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Bu ürün hakkındaki düşüncelerini yaz..."
        rows={3}
        className="w-full rounded-md border border-line bg-card px-3 py-2 text-sm text-foreground outline-none placeholder:text-fg-subtle focus:border-primary"
      />

      {error && <p className="text-sm text-danger">{error}</p>}

      {success && (
        <p className="text-sm text-success">
          Teşekkürler! Yorumun onaylandıktan sonra burada görünecek.
        </p>
      )}

      <button
        type="submit"
        disabled={rating === 0 || !comment.trim() || isSubmitting}
        className="self-start rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? "Gönderiliyor..." : "Yorumu Gönder"}
      </button>
    </form>
  );
}
