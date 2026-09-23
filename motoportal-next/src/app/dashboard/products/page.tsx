import Link from "next/link";
import { getDashboardProducts } from "@/services/products";
import { DashboardProductRow } from "@/components/dashboard/DashboardProductRow";
import { Card } from "@/components/ui/card";

export default async function DashboardProductsPage() {
  const products = await getDashboardProducts();

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold">Ürün Listesi</h1>
        <Link
          href="/dashboard/products/new"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
        >
          + Yeni Ürün Ekle
        </Link>
      </div>

      {products.length === 0 ? (
        <Card className="p-8 text-center text-sm text-fg-muted">
          Henüz ürün yok.
        </Card>
      ) : (
        <Card className="overflow-hidden p-0">
          <div className="grid grid-cols-[56px_1fr_112px_96px_auto] items-center gap-4 border-b border-line bg-surface px-4 py-2 text-xs font-semibold uppercase tracking-wide text-fg-muted">
            <span>Görsel</span>
            <span>Ürün</span>
            <span className="text-right">Fiyat</span>
            <span className="text-right">Stok</span>
            <span>İşlem</span>
          </div>

          {products.map((product) => (
            <DashboardProductRow key={product.id} product={product} />
          ))}
        </Card>
      )}
    </div>
  );
}
