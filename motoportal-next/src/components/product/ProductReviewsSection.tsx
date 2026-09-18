"use client";

import { useState } from "react";
import type { ProductReview } from "@/services/catalog";
import { getProductReviews } from "@/services/catalog";
import ReviewForm from "./ReviewForm";

type Props = {
  slug: string;
  productId: number;
  reviews: ProductReview[];
  isAuthenticated: boolean;
};

export default function ProductReviewsSection({
  slug,
  productId,
  reviews,
  isAuthenticated,
}: Props) {
  const [reviewList, setReviewList] = useState<ProductReview[]>(reviews);

  async function refreshReviews() {
    const updated = await getProductReviews(slug);
    setReviewList(updated);
  }

  return (
    <section className="mt-12">
      <p className="text-sm font-semibold uppercase tracking-wide text-fg-muted">
        Müşteri Deneyimleri
      </p>

      <h2 className="mt-2 text-2xl font-bold text-foreground">
        Yorumlar ({reviewList.length})
      </h2>

      <div className="mt-6 flex flex-col gap-6">
        <ReviewForm
          slug={slug}
          productId={productId}
          isAuthenticated={isAuthenticated}
          onSubmitted={refreshReviews}
        />

        <div className="flex flex-col gap-4 border-t border-line pt-4">
          {reviewList.length === 0 ? (
            <p className="text-sm text-fg-muted">
              Bu ürün için henüz onaylanmış yorum yok.
            </p>
          ) : (
            reviewList.map((review) => (
              <div
                key={review.id}
                className="border-b border-line pb-4 last:border-b-0"
              >
                <div className="mb-1 flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <span
                      key={index}
                      className={
                        index < review.rating
                          ? "text-amber-500"
                          : "text-fg-subtle"
                      }
                    >
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-sm text-foreground">{review.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
