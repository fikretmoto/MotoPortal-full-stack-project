"use client";

import { useState } from "react";
import { submitBlogComment } from "@/services/blogComments";
import { Textarea } from "@/components/ui/textarea";

type BlogCommentFormProps = {
  slug: string;
};

// ReviewForm.tsx ile aynı kalıp: useState ile form durumu, onSubmit
// içinde server action'ı doğrudan argümanlarla çağırma.
export default function BlogCommentForm({ slug }: BlogCommentFormProps) {
  const [body, setBody] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!body.trim() || isSubmitting) {
      return;
    }

    setError(null);
    setSuccess(false);
    setIsSubmitting(true);

    const result = await submitBlogComment(slug, body.trim());

    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error ?? "Yorum gönderilemedi. Lütfen tekrar deneyin.");
      return;
    }

    setSuccess(true);
    setBody("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <Textarea
        name="body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Bu yazı hakkındaki düşüncelerini yaz..."
        rows={3}
        required
        className="rounded-md border-line bg-card px-3 py-2 text-sm text-foreground placeholder:text-fg-subtle focus-visible:border-primary"
      />

      {error && <p className="text-sm text-danger">{error}</p>}

      {success && (
        <p className="text-sm text-success">
          Yorumun onaylandıktan sonra görünecek.
        </p>
      )}

      <button
        type="submit"
        disabled={!body.trim() || isSubmitting}
        className="self-start rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? "Gönderiliyor..." : "Yorumu Gönder"}
      </button>
    </form>
  );
}
