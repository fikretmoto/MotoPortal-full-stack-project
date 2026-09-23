"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { DashboardProductListItem } from "@/services/products";

type DashboardProductRowProps = {
  product: DashboardProductListItem;
};

function formatPrice(price: string | null, currency: string) {
  if (!price) {
    return "-";
  }

  const number = Number(price);
  const formatted = new Intl.NumberFormat("tr-TR").format(number);

  return currency === "TRY" ? `${formatted} ₺` : `${formatted} ${currency}`;
}

const STOCK_STATUS_LABELS: Record<string, string> = {
  in_stock: "Stokta",
  out_of_stock: "Tükendi",
  low_stock: "Az Stok",
  preorder: "Ön Sipariş",
};

export function DashboardProductRow({ product }: DashboardProductRowProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      `"${product.display_name || product.name}" ürününü pasife almak istediğinize emin misiniz? Ürün mağazada görünmemeye başlar, verisi silinmez.`
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(
        `/api/products/update/${product.slug}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        alert("Ürün pasife alınamadı, lütfen tekrar deneyin.");
        return;
      }

      router.refresh();
    } catch {
      alert("Ürün pasife alınamadı, lütfen tekrar deneyin.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="grid grid-cols-[56px_1fr_112px_96px_auto] items-center gap-4 border-b border-line px-4 py-3 last:border-b-0 hover:bg-surface-hover/50">
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-surface">
        {product.cover_image_url ? (
          <Image
            src={product.cover_image_url}
            alt={product.name}
            fill
            className="object-cover"
            sizes="56px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[10px] text-fg-subtle">
            Görsel yok
          </div>
        )}
      </div>

      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-semibold text-foreground">
            {product.display_name || product.name}
          </p>
          {!product.is_active && (
            <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
              Onay Bekliyor
            </span>
          )}
        </div>
        <p className="truncate text-xs text-fg-muted">
          {product.brand_name} · {product.category_name}
        </p>
      </div>

      <div className="text-right text-sm font-mono font-semibold text-foreground">
        {formatPrice(product.discount_price ?? product.price, product.currency)}
      </div>

      <div className="text-right text-xs text-fg-muted">
        {STOCK_STATUS_LABELS[product.stock_status] ?? product.stock_status}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <Link
          href={`/dashboard/products/${product.slug}/edit`}
          className="rounded-lg bg-surface-hover px-3 py-1.5 text-xs font-semibold text-foreground transition hover:bg-primary hover:text-primary-foreground"
        >
          Düzenle
        </Link>
        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
        >
          {isDeleting ? "..." : "Sil"}
        </button>
      </div>
    </div>
  );
}
