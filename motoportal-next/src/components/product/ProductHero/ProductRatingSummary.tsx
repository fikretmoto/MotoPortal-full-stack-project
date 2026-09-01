import { Star, StarHalf } from "lucide-react";
import type { ProductReview } from "@/services/catalog";

type ProductRatingSummaryProps = {
  reviews: ProductReview[];
};

const MAX_STARS = 5;

export default function ProductRatingSummary({
  reviews,
}: ProductRatingSummaryProps) {
  if (reviews.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Henüz yorum yapılmamış
      </p>
    );
  }

  const averageRating =
    reviews.reduce((total, review) => total + review.rating, 0) /
    reviews.length;

  const fullStars = Math.floor(averageRating);
  const hasHalfStar = averageRating % 1 >= 0.5;
  const emptyStars = MAX_STARS - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        {Array.from({ length: fullStars }).map((_, index) => (
          <Star
            key={`full-${index}`}
            className="size-4 fill-yellow-500 stroke-yellow-500"
          />
        ))}

        {hasHalfStar && (
          <div className="relative size-4">
            <StarHalf className="absolute top-0 right-0 size-full fill-yellow-500 stroke-yellow-500" />
            <StarHalf className="absolute top-0 left-0 size-full -scale-x-100 fill-black/15 stroke-black/15" />
          </div>
        )}

        {Array.from({ length: emptyStars }).map((_, index) => (
          <Star
            key={`empty-${index}`}
            className="size-4 fill-black/15 stroke-black/15"
          />
        ))}
      </div>

      <p className="text-sm font-medium text-muted-foreground">
        {reviews.length} yorum
      </p>
    </div>
  );
}