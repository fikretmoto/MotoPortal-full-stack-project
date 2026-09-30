import { redirect } from "next/navigation";
import { getCurrentUser } from "@/services/auth";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";

// Backend'deki CanManageProducts permission'ıyla aynı rol listesi
// (apps/catalog/permissions.py) — bu, ikinci savunma katmanı
// (middleware.ts, /auth/me/ ile) ile birlikte çalışır.
const DASHBOARD_ALLOWED_ROLES = ["super_admin", "admin", "editor", "dealer"];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (!DASHBOARD_ALLOWED_ROLES.includes(user.role)) {
    redirect("/erisim-engellendi");
  }

  return (
    <SidebarProvider>
      <DashboardSidebar user={user} />
      <SidebarInset>
        <div className="flex items-center border-b border-line px-4 py-2 md:hidden">
          <SidebarTrigger />
          <span className="ml-2 text-sm font-semibold">MotoPortal Dealer Paneli</span>
        </div>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
