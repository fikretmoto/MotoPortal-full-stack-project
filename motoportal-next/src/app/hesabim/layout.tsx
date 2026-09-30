import { redirect } from "next/navigation";
import { getCurrentUser } from "@/services/auth";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AccountSidebar } from "@/components/account/AccountSidebar";
import Navbar from "@/components/Home/Navbar/Navbar";

// /hesabim, dealer/admin panelinden (dashboard) tamamen ayrı bir
// müşteri alanı — sadece customer rolüne açık. middleware.ts'teki
// /auth/me/ kontrolüyle birlikte iki bağımsız savunma katmanı.
const HESABIM_ALLOWED_ROLES = ["customer"];

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (!HESABIM_ALLOWED_ROLES.includes(user.role)) {
    redirect("/dashboard");
  }

  return (
    <>
      <Navbar user={user} />
      <SidebarProvider>
        <AccountSidebar user={user} />
        <SidebarInset>
          <div className="flex items-center border-b border-line px-4 py-2 md:hidden">
            <SidebarTrigger />
            <span className="ml-2 text-sm font-semibold">MotoPortal Hesabım</span>
          </div>
          {children}
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
