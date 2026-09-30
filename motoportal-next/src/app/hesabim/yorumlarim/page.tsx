import Link from "next/link";
import Image from "next/image";
import { getMyReviews } from "@/services/reviews";

export default async function YorumlarimPage() {
  const reviews = await getMyReviews();

  return (
    <div className="p-4 sm:p-6">
      <h1 className="mb-4 text-lg font-bold text-foreground sm:text-xl">
        Yorumlarım
      </h1>

      {reviews.length === 0 ? (
        <p className="text-sm text-fg-muted">
          Henüz bir yorum yapmadın. Satın aldığın ürünlerin sayfasından yorum
          bırakabilirsin.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="flex gap-3 rounded-2xl border border-line bg-card p-3"
            >
              <Link
                href={`/products/${review.product.slug}`}
                className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-surface"
              >
                {review.product.cover_image_url ? (
                  <Image
                    src={review.product.cover_image_url}
                    alt={review.product.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                ) : null}
              </Link>

              <div className="flex-1">
                <Link
                  href={`/products/${review.product.slug}`}
                  className="text-sm font-semibold text-primary"
                >
                  {review.product.display_name || review.product.name}
                </Link>

                <div className="mt-1 flex items-center gap-1 text-xs text-amber-500">
                  {"★".repeat(review.rating)}
                  <span className="text-fg-subtle">
                    {"★".repeat(5 - review.rating)}
                  </span>
                </div>

                <p className="mt-1 text-sm text-foreground">
                  {review.comment}
                </p>

                {!review.is_approved && (
                  <p className="mt-1 text-xs text-fg-subtle">
                    Onay bekliyor — henüz herkese açık görünmüyor.
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
