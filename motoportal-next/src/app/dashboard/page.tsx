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

      <form action="/api/auth/logout" method="POST">
        <button type="submit">Çıkış Yap</button>
      </form>
    </div>
  );
}