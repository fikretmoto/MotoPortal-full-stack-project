import Link from "next/link";
import { getDashboardProducts } from "@/services/products";
import { DashboardProductRow } from "@/components/dashboard/DashboardProductRow";
import { DashboardProductSearch } from "@/components/dashboard/DashboardProductSearch";
import { Card } from "@/components/ui/card";

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export default async function DashboardProductsPage({
  searchParams,
}: Props) {
  const { q } = await searchParams;
  const products = await getDashboardProducts(q);

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-bold">Ürün Listesi</h1>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <DashboardProductSearch />
          <Link
            href="/dashboard/products/new"
            className="rounded-lg bg-primary px-4 py-2 text-center text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            + Yeni Ürün Ekle
          </Link>
        </div>
      </div>

      {products.length === 0 ? (
        <Card className="p-8 text-center text-sm text-fg-muted">
          {q ? "Aramanıza uygun ürün bulunamadı." : "Henüz ürün yok."}
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
