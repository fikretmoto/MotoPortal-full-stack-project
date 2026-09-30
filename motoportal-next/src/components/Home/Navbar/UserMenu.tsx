"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, MessageSquare, UserRound } from "lucide-react";
import type { CurrentUser } from "@/services/auth";

type UserMenuProps = {
  user: CurrentUser | null;
};

const UserMenu = ({ user }: UserMenuProps) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handlePointerDown(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  if (!user) {
    return (
      <Link
        href={`/login?next=${encodeURIComponent(pathname)}`}
        className="group flex min-w-[74px] flex-col items-center gap-1 text-center text-[oklch(35%_0.01_60)] transition hover:text-[oklch(62%_0.19_35)]"
      >
        <span className="relative inline-flex h-8 w-8 items-center justify-center">
          <UserRound className="h-5 w-5" />
        </span>
        <span className="text-sm font-medium tracking-tight text-[oklch(35%_0.01_60)] transition group-hover:text-[oklch(62%_0.19_35)]">
          Giriş Yap
        </span>
      </Link>
    );
  }

  const displayName = user.first_name || user.email.split("@")[0];
  const isCustomer = user.role === "customer";
  const accountHref = isCustomer ? "/hesabim" : "/dashboard";
  const accountLabel = isCustomer ? "Hesabım" : "Panelim";

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((previous) => !previous)}
        className="group flex min-w-[74px] flex-col items-center gap-1 text-center text-[oklch(35%_0.01_60)] transition hover:text-[oklch(62%_0.19_35)]"
      >
        <span className="relative inline-flex h-8 w-8 items-center justify-center">
          <UserRound className="h-5 w-5" />
        </span>
        <span className="max-w-[90px] truncate text-sm font-medium tracking-tight text-[oklch(35%_0.01_60)] transition group-hover:text-[oklch(62%_0.19_35)]">
          {displayName}
        </span>
      </button>

      {isOpen ? (
        <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-xl border border-[oklch(90%_0.006_70)] bg-white p-2 text-left shadow-lg">
          <div className="truncate px-3 py-2 text-xs text-[oklch(45%_0.01_60)]">
            {user.email}
          </div>

          <Link
            href={accountHref}
            onClick={() => setIsOpen(false)}
            className="block rounded-lg px-3 py-2 text-sm text-[oklch(20%_0.01_60)] hover:bg-[oklch(96%_0.004_70)]"
          >
            {accountLabel}
          </Link>

          {isCustomer ? (
            <>
              <Link
                href="/hesabim/favorilerim"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[oklch(20%_0.01_60)] hover:bg-[oklch(96%_0.004_70)]"
              >
                <Heart className="h-4 w-4" />
                Favorilerim
              </Link>

              <Link
                href="/hesabim/yorumlarim"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[oklch(20%_0.01_60)] hover:bg-[oklch(96%_0.004_70)]"
              >
                <MessageSquare className="h-4 w-4" />
                Yorumlarım
              </Link>
            </>
          ) : null}

          <form action="/api/auth/logout" method="POST">
            <input type="hidden" name="next" value={pathname} />
            <button
              type="submit"
              className="w-full rounded-lg px-3 py-2 text-left text-sm text-[oklch(20%_0.01_60)] hover:bg-[oklch(96%_0.004_70)]"
            >
              Çıkış Yap
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
};

export default UserMenu;
