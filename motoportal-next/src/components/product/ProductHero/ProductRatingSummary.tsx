import { getProductReviews } from "@/services/catalog";

type ProductRatingSummaryProps = {
  slug: string;
};

export default async function ProductRatingSummary({
  slug,
}: ProductRatingSummaryProps) {
  const reviews = await getProductReviews(slug);

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

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, index) => (
          <span
            key={index}
            className={
              index < Math.round(averageRating)
                ? "text-yellow-500"
                : "text-muted-foreground"
            }
          >
            ★
          </span>
        ))}
      </div>
      <span className="text-sm text-muted-foreground">
        {averageRating.toFixed(1)} ({reviews.length} yorum)
      </span>
    </div>
  );
}