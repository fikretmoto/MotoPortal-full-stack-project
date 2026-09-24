"use client";

import { usePathname } from "next/navigation";
import { LayoutGrid, PlusCircle } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { CurrentUser } from "@/services/auth";

const MENU_ITEMS = [
  {
    href: "/dashboard/products",
    label: "Ürünler",
    icon: LayoutGrid,
  },
  {
    href: "/dashboard/products/new",
    label: "Yeni Ürün Ekle",
    icon: PlusCircle,
  },
];

type DashboardSidebarProps = {
  user: CurrentUser;
};

export function DashboardSidebar({ user }: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <span className="text-lg font-black tracking-tight text-sidebar-foreground">
          Moto<span className="text-primary">Portal</span>
        </span>
        <span className="text-xs text-fg-muted">Dealer Paneli</span>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/dashboard/products"
                ? pathname === item.href
                : pathname.startsWith(item.href);

            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton href={item.href} isActive={isActive}>
                  <Icon className="h-4 w-4" />
                  {item.label}
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <div className="text-xs text-fg-muted">
          <p className="font-semibold text-sidebar-foreground">
            {user.first_name || user.email}
          </p>
          <p>{user.role}</p>
          <p className="truncate">{user.email}</p>
        </div>

        <form action="/api/auth/logout" method="POST">
          <button
            type="submit"
            className="w-full rounded-lg border border-sidebar-border px-3 py-2 text-xs font-semibold text-sidebar-foreground transition hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            Çıkış Yap
          </button>
        </form>
      </SidebarFooter>
    </Sidebar>
  );
}
