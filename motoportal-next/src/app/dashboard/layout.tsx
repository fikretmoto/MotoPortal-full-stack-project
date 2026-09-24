import { redirect } from "next/navigation";
import { getCurrentUser } from "@/services/auth";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
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
