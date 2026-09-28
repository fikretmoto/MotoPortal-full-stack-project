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
  featured: "bg-slate-800 text-white",
  editors_pick: "bg-purple-600 text-white",
  deal: "bg-orange-600 text-white",
  best_seller: "bg-rose-600 text-white",
  trade_opportunity: "bg-blue-600 text-white",
  free_shipping: "bg-teal-600 text-white",
  installment_deal: "bg-indigo-600 text-white",
  a1_license: "bg-cyan-600 text-white",
  b_license: "bg-sky-700 text-white",
  free_shipping_city: "bg-teal-700 text-white",
};

// Sol-üst köşe: en "acil" bilgi (stok durumu). "discount" ve "new"
// artık hiçbir yerde gösterilmiyor.
const TOP_LEFT_BADGE_PRIORITY: string[][] = [
   ["featured"],
  ["deal"],
  ["best_seller"],
];

// Sağ-üst köşe (favori ikonunun altında): editöryel/onay tipi
// rozetler. a1_license/b_license sadece araç kategorisindeki
// ürünlerde 5. öncelik olarak eklenir.
function getTopRightBadgePriority(isVehicle: boolean): string[][] {
  const priority: string[][] = [
    ["editors_pick"],
  ];

  if (isVehicle) {
    priority.push(["a1_license", "b_license"]);
  }

  return priority;
}

const MAX_BADGES_PER_SLOT = 4;

function pickBadgesByPriority(
  badges: ProductBadge[],
  priorityGroups: string[][],
  limit: number
): ProductBadge[] {
  const picked: ProductBadge[] = [];

  for (const group of priorityGroups) {
    if (picked.length >= limit) {
      break;
    }

    const match = badges.find((badge) => group.includes(badge.type));
    if (match) {
      picked.push(match);
    }
  }

  return picked;
}

function getBadgeSlots(badges: ProductBadge[], isVehicle: boolean) {
  return {
    topLeft: pickBadgesByPriority(badges, TOP_LEFT_BADGE_PRIORITY, MAX_BADGES_PER_SLOT),
    topRight: pickBadgesByPriority(
      badges,
      getTopRightBadgePriority(isVehicle),
      MAX_BADGES_PER_SLOT
    ),
  };
}

const BADGE_SPAN_CLASS: Record<"pill" | "vertical", string> = {
  pill: "rounded-full px-2 py-0.5 text-[8px] font-semibold uppercase tracking-wide shadow-sm sm:px-1.5 sm:py-1 sm:text-[10px]",
 vertical:
    "flex w-5 items-center justify-center rounded-sm px-2 py-2 text-[11px] font-semibold text-transform:uppercase tracking-widest shadow-sm [writing-mode:vertical-rl] sm:w-6 sm:py-2.5",
};

function BadgeStack({
  badges,
  className,
  variant = "pill",
}: {
  badges: ProductBadge[];
  className: string;
  variant?: "pill" | "vertical";
}) {
  if (badges.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      {badges.map((badge) => (
        <span
  key={badge.type}
  className={`${BADGE_SPAN_CLASS[variant]} ${
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

  const { topLeft: topLeftBadges, topRight: topRightBadges } = getBadgeSlots(
    product.badges,
    product.category.is_vehicle
  );

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <Card
        className={`w-full gap-0 overflow-hidden rounded-2xl p-0 border-transparent transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg [--card-spacing:--spacing(2.5)] sm:w-[320px] sm:[--card-spacing:--spacing(4)] ${
          isPromoted ? "hover:border-orange-500/40" : "hover:border-border"
        } ${soldOut ? "opacity-70 grayscale" : ""}`}
      >
        <div className="relative aspect-square w-full overflow-hidden bg-surface">
          <BadgeStack
            badges={topLeftBadges}
            className="absolute left-1.5 top-1.5 z-10 flex flex-col items-start gap-0.5 sm:left-2 sm:top-2 sm:gap-1"
          />

          <div className="absolute right-1.5 top-1.5 z-10 flex flex-col items-end gap-1 sm:right-2 sm:top-2">
            <FavoriteButton
              slug={product.slug}
              initialIsFavorited={product.is_favorited}
            />
            <BadgeStack
              badges={topRightBadges}
              className="flex flex-col items-end gap-0.5 sm:gap-1"
              variant="vertical"
            />
          </div>

          {product.cover_image_url ? (
            <Image
              src={product.cover_image_url}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 25vw, 45vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-fg-subtle">
              Görsel yakında
            </div>
          )}
        </div>

        <CardContent className="flex h-full min-h-[150px] flex-col pb-1 pt-1.5 sm:min-h-[180px] sm:pt-2">
          <div className="min-h-[2.75rem] sm:min-h-[3.75rem]">
            <h3 className="line-clamp-2 text-xs font-semibold tracking-tight text-primary sm:text-sm">
              {product.display_name || product.name}
            </h3>

            {product.short_description && (
              <p className="font-motoportal-tagline line-clamp-2 text-[10px] font-semibold leading-tight tracking-tight text-fg-muted sm:text-[12px]">
                {product.short_description}
              </p>
            )}
          </div>

          <div className="mt-auto">
            {priceText && (
              <div className="flex items-baseline gap-1.5 sm:gap-2">
                <p
                  className={`font-mono text-sm font-bold tabular-nums sm:text-base ${
                    isPromoted ? "text-orange-600" : "text-foreground"
                  }`}
                >
                  {priceText}
                </p>

                {oldPriceText && (
                  <p className="font-mono text-[9px] tabular-nums text-fg-subtle line-through sm:text-[10px]">
                    {oldPriceText}
                  </p>
                )}
              </div>
            )}

            <div className="mt-1.5 flex h-4 items-center gap-1 border-t border-line pt-1.5 text-[10px] text-fg-subtle sm:mt-2 sm:pt-2 sm:text-xs">
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
              className={`mt-1.5 w-full rounded-lg py-1.5 text-[11px] font-semibold transition sm:mt-2 sm:py-2 sm:text-xs ${
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
