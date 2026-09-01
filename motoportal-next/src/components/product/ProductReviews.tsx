import type { ProductReview } from "@/services/catalog";

type ProductReviewsProps = {
  reviews: ProductReview[];
};

export default function ProductReviews({ reviews }: ProductReviewsProps) {
  if (reviews.length === 0) {
    return (
      <div className="border-t py-6">
        <h2 className="text-sm text-muted-foreground mb-2">Yorumlar</h2>
        <p className="text-sm text-muted-foreground">
          Bu ürün için henüz yorum yapılmamış.
        </p>
      </div>
    );
  }

  return (
    <div className="border-t py-6">
      <h2 className="text-sm text-muted-foreground mb-4">
        Yorumlar ({reviews.length})
      </h2>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="border-b pb-4">
            <div className="flex items-center gap-1 mb-1">
              {Array.from({ length: 5 }).map((_, index) => (
                <span
                  key={index}
                  className={
                    index < review.rating
                      ? "text-yellow-500"
                      : "text-muted-foreground"
                  }
                >
                  ★
                </span>
              ))}
            </div>
            <p className="text-sm">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}