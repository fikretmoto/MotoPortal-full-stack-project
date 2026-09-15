import Link from "next/link";
import Image from "next/image";
import type { Product, ProductBadge } from "@/services/catalog";
import { Card, CardContent } from "@/components/ui/card";
import FavoriteButton from "./FavoriteButton";

type ProductCardProps = {
  product: Product;
};

const BADGE_STYLES: Record<string, string> = {
  new: "bg-emerald-600 text-white",
  discount: "bg-red-600 text-white",
  out_of_stock: "bg-gray-500 text-white",
  low_stock: "bg-amber-500 text-white",
  featured: "bg-elevated text-white",
  editors_pick: "bg-purple-600 text-white",
  deal: "bg-orange-600 text-white",
  trade_opportunity: "bg-blue-600 text-white",
  free_shipping: "bg-teal-600 text-white",
  installment_deal: "bg-indigo-600 text-white",
};

function ProductBadges({ badges }: { badges: ProductBadge[] }) {
  if (badges.length === 0) {
    return null;
  }

  return (
    <div className="absolute left-2 top-2 z-10 flex flex-col gap-1">
      {badges.slice(0, 2).map((badge) => (
        <span
          key={badge.type}
          className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide shadow-sm ${
            BADGE_STYLES[badge.type] ?? "bg-surface-hover text-white"
          }`}
        >
          {badge.label}
        </span>
      ))}
    </div>
  );
}

function formatPrice(price: string | null, currency: string) {
  if (!price) {
    return null;
  }

  const number = Number(price);
  const formatted = new Intl.NumberFormat("tr-TR").format(number);

  return currency === "TRY" ? `${formatted} ₺` : `${formatted} ${currency}`;
}

export default function ProductCard({ product }: ProductCardProps) {
  const soldOut = product.badges.some(
    (badge) => badge.type === "out_of_stock"
  );

  const hasDiscount =
    product.discount_price !== null &&
    Number(product.discount_price) < Number(product.price);

  const priceText = formatPrice(
    hasDiscount ? product.discount_price : product.price,
    product.currency
  );
  const oldPriceText = hasDiscount
    ? formatPrice(product.price, product.currency)
    : null;

  const isPromoted =
    hasDiscount ||
    product.badges.some(
      (badge) => badge.type === "discount" || badge.type === "deal"
    );

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <Card
        className={`w-[190px] gap-0 overflow-hidden rounded-2xl p-0 border-transparent transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${
          isPromoted ? "hover:border-orange-500/40" : "hover:border-border"
        } ${soldOut ? "opacity-70 grayscale" : ""}`}
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface">
          <ProductBadges badges={product.badges} />

          <div className="absolute right-2 top-2 z-10">
            <FavoriteButton
              slug={product.slug}
              initialIsFavorited={product.is_favorited}
            />
          </div>

          {product.cover_image_url ? (
            <Image
              src={product.cover_image_url}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 25vw, 70vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-fg-subtle">
              Görsel yakında
            </div>
          )}
        </div>

        <CardContent className="flex h-full min-h-[150px] flex-col pb-1 pt-2">
          <div className="min-h-[3.75rem]">
            <h3 className="line-clamp-2 text-sm font-semibold tracking-tight text-primary">
              {product.name}
            </h3>

            {product.short_description && (
              <p className="font-motoportal-tagline line-clamp-2 text-[12px] font-semibold leading-tight tracking-tight text-fg-muted">
                {product.short_description}
              </p>
            )}
          </div>

          <div className="mt-auto">
            {priceText && (
              <div className="flex items-baseline gap-2">
                <p
                  className={`font-mono text-xs font-bold tabular-nums ${
                    isPromoted ? "text-orange-600" : "text-foreground"
                  }`}
                >
                  {priceText}
                </p>

                {oldPriceText && (
                  <p className="font-mono text-[10px] tabular-nums text-fg-subtle line-through">
                    {oldPriceText}
                  </p>
                )}
              </div>
            )}

            <div className="mt-2 flex h-4 items-center gap-1 border-t border-line pt-2 text-xs text-fg-subtle">
              {product.average_rating !== null && (
                <>
                  <span className="text-amber-500">★</span>
                  <span>{product.average_rating}</span>
                  <span>({product.review_count})</span>
                </>
              )}
            </div>

            <button
              type="button"
              disabled={soldOut}
              className={`mt-2 w-full rounded-lg py-2 text-xs font-semibold transition ${
                soldOut
                  ? "cursor-not-allowed bg-surface-hover text-fg-subtle"
                  : "bg-surface-hover text-foreground hover:bg-primary hover:text-primary-foreground"
              }`}
            >
              {soldOut ? "Tükendi" : "İncele"}
            </button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
