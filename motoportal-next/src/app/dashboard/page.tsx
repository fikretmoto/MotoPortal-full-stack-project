import { getCurrentUser } from "@/services/auth";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Hoş geldin, {user?.first_name || user?.email}</h1>
      <p className="mt-1 text-sm text-fg-muted">
        Soldaki menüden ürünlerini yönetebilirsin.
      </p>
    </div>
  );
}
