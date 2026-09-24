"use client";

import * as React from "react";
import Link from "next/link";
import { PanelLeftIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type SidebarContextValue = {
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
};

const SidebarContext = React.createContext<SidebarContextValue | null>(null);

function useSidebar() {
  const context = React.useContext(SidebarContext);

  if (!context) {
    throw new Error("useSidebar, SidebarProvider içinde kullanılmalı.");
  }

  return context;
}

function SidebarProvider({
  children,
  className,
}: React.ComponentProps<"div">) {
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  return (
    <SidebarContext.Provider value={{ isMobileOpen, setIsMobileOpen }}>
      <div className={cn("flex min-h-screen w-full", className)}>
        {children}
      </div>
    </SidebarContext.Provider>
  );
}

function Sidebar({ children, className }: React.ComponentProps<"aside">) {
  const { isMobileOpen, setIsMobileOpen } = useSidebar();

  return (
    <>
      {isMobileOpen && (
        <div
          data-slot="sidebar-overlay"
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      <aside
        data-slot="sidebar"
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-screen w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-transform duration-200 ease-in-out",
          "md:sticky md:top-0 md:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
          className
        )}
      >
        {children}
      </aside>
    </>
  );
}

function SidebarHeader({ children, className }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-header"
      className={cn("flex flex-col gap-2 p-4", className)}
    >
      {children}
    </div>
  );
}

function SidebarContent({ children, className }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-content"
      className={cn("flex-1 overflow-y-auto px-2 py-2", className)}
    >
      {children}
    </div>
  );
}

function SidebarFooter({ children, className }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-footer"
      className={cn(
        "flex flex-col gap-2 border-t border-sidebar-border p-4",
        className
      )}
    >
      {children}
    </div>
  );
}

function SidebarMenu({ children, className }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="sidebar-menu"
      className={cn("flex flex-col gap-1", className)}
    >
      {children}
    </ul>
  );
}

function SidebarMenuItem({ children, className }: React.ComponentProps<"li">) {
  return (
    <li data-slot="sidebar-menu-item" className={className}>
      {children}
    </li>
  );
}

type SidebarMenuButtonProps = {
  href: string;
  isActive?: boolean;
  children: React.ReactNode;
  className?: string;
};

function SidebarMenuButton({
  href,
  isActive,
  children,
  className,
}: SidebarMenuButtonProps) {
  return (
    <Link
      href={href}
      data-slot="sidebar-menu-button"
      data-active={isActive}
      className={cn(
        "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        isActive &&
          "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground",
        className
      )}
    >
      {children}
    </Link>
  );
}

function SidebarTrigger({ className }: React.ComponentProps<"button">) {
  const { isMobileOpen, setIsMobileOpen } = useSidebar();

  return (
    <button
      type="button"
      data-slot="sidebar-trigger"
      onClick={() => setIsMobileOpen(!isMobileOpen)}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-surface-hover md:hidden",
        className
      )}
    >
      <PanelLeftIcon className="h-5 w-5" />
      <span className="sr-only">Menüyü aç/kapat</span>
    </button>
  );
}

function SidebarInset({ children, className }: React.ComponentProps<"main">) {
  return (
    <main
      data-slot="sidebar-inset"
      className={cn("flex min-h-screen w-full flex-1 flex-col", className)}
    >
      {children}
    </main>
  );
}

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
};
