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
  featured: "bg-gray-900 text-white",
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
          className={`rounded px-2 py-0.5 text-[10px] font-semibold ${
            BADGE_STYLES[badge.type] ?? "bg-gray-800 text-white"
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
  const priceText = formatPrice(product.price, product.currency);

  return (
    <Link href={`/products/${product.slug}`} className="group block">
            <Card className="w-[190px] gap-0 overflow-hidden p-0 transition hover:shadow-md">
        <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
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
            <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
              Görsel yakında
            </div>
          )}
        </div>

                      <CardContent className="flex h-full min-h-[150px] flex-col p-3 pb-1 pt-2">
          <h3 className="line-clamp-2 min-h-[2.25rem] text-sm font-semibold text-blue-700">
            {product.name}
          </h3>

          {product.short_description && (
                   <p className="font-motoportal-tagline mt-1 line-clamp-2 text-[12px] font-normal tracking-tight text-black">
              {product.short_description}
            </p>
          )}

          <div className="mt-auto">
            <div className="flex h-4 items-center gap-1 text-xs text-gray-500">
              {product.average_rating !== null && (
                <>
                  <span className="text-amber-500">★</span>
                  <span>{product.average_rating}</span>
                  <span>({product.review_count})</span>
                </>
              )}
            </div>

            {priceText && (
              <p className="mt-0.5 inline-block rounded-md bg-gray-100 px-2 py-1 text-sm font-bold text-white bg-gray-900">
                {priceText}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}