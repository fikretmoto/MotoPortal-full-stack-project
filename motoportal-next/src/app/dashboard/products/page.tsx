import Link from "next/link";
import { getDashboardProducts } from "@/services/products";
import { DashboardProductRow } from "@/components/dashboard/DashboardProductRow";

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
        <p className="text-sm text-fg-muted">Henüz ürün yok.</p>
      ) : (
        <div>
          {products.map((product) => (
            <DashboardProductRow key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
