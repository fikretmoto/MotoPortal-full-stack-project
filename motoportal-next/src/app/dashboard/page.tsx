import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/services/auth";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div>
      <h1>Hoş geldin, {user.first_name || user.email}</h1>
      <p>Rol: {user.role}</p>
      <p>E-posta: {user.email}</p>

      <nav className="mt-4 flex gap-4">
        <Link href="/dashboard/products">Ürünler</Link>
        <Link href="/dashboard/products/new">+ Yeni Ürün Ekle</Link>
      </nav>

      <form action="/api/auth/logout" method="POST">
        <button type="submit">Çıkış Yap</button>
      </form>
    </div>
  );
}