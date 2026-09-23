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
  return (
    <div className="flex items-center gap-4 border-b border-line py-3">
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

      <div className="min-w-0 flex-1">
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

      <div className="w-28 shrink-0 text-right text-sm font-mono font-semibold text-foreground">
        {formatPrice(product.discount_price ?? product.price, product.currency)}
      </div>

      <div className="w-24 shrink-0 text-right text-xs text-fg-muted">
        {STOCK_STATUS_LABELS[product.stock_status] ?? product.stock_status}
      </div>

      <Link
        href={`/dashboard/products/${product.slug}/edit`}
        className="shrink-0 rounded-lg bg-surface-hover px-3 py-1.5 text-xs font-semibold text-foreground transition hover:bg-primary hover:text-primary-foreground"
      >
        Düzenle
      </Link>
    </div>
  );
}
