"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Favorite } from "@/services/favorites";
import { toggleFavorite } from "@/services/favorites";

function formatPrice(price: string | null, currency: string) {
  if (!price) {
    return null;
  }

  const number = Number(price);
  const formatted = new Intl.NumberFormat("tr-TR").format(number);

  return currency === "TRY" ? `${formatted} ₺` : `${formatted} ${currency}`;
}

function FavoriteCard({
  favorite,
  onRemoved,
}: {
  favorite: Favorite;
  onRemoved: (id: number) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const { product } = favorite;

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

  function handleRemove() {
    startTransition(async () => {
      const result = await toggleFavorite(product.slug);

      if (result.success && result.is_favorited === false) {
        onRemoved(favorite.id);
      }
    });
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-card">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-square w-full bg-surface">
          {product.cover_image_url ? (
            <Image
              src={product.cover_image_url}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-fg-subtle">
              Görsel yakında
            </div>
          )}
        </div>
      </Link>

      <div className="flex flex-col gap-2 p-3">
        <Link href={`/products/${product.slug}`}>
          <h3 className="line-clamp-2 text-sm font-semibold text-primary">
            {product.display_name || product.name}
          </h3>
        </Link>

        {priceText && (
          <div className="flex items-baseline gap-1.5">
            <p className="font-mono text-sm font-bold tabular-nums text-foreground">
              {priceText}
            </p>
            {oldPriceText && (
              <p className="font-mono text-xs tabular-nums text-fg-subtle line-through">
                {oldPriceText}
              </p>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={handleRemove}
          disabled={isPending}
          className="w-full rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-foreground transition hover:bg-danger hover:text-white hover:border-danger disabled:opacity-50"
        >
          {isPending ? "Kaldırılıyor..." : "Favorilerden Çıkar"}
        </button>
      </div>
    </div>
  );
}

export function FavoriteGrid({ favorites }: { favorites: Favorite[] }) {
  const [items, setItems] = useState(favorites);

  function handleRemoved(id: number) {
    setItems((current) => current.filter((item) => item.id !== id));
  }

  if (items.length === 0) {
    return (
      <p className="text-sm text-fg-muted">
        Henüz favori ürünün yok. Ürün sayfalarındaki kalp ikonuna tıklayarak
        favorilerine ekleyebilirsin.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {items.map((favorite) => (
        <FavoriteCard
          key={favorite.id}
          favorite={favorite}
          onRemoved={handleRemoved}
        />
      ))}
    </div>
  );
}
