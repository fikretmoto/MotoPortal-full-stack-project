"use client";

import { useState, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import { toggleFavorite } from "@/services/favorites";

type FavoriteButtonProps = {
  slug: string;
  initialIsFavorited: boolean;
};

export default function FavoriteButton({
  slug,
  initialIsFavorited,
}: FavoriteButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited);
  const [isPending, startTransition] = useTransition();

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    startTransition(async () => {
      const result = await toggleFavorite(slug);

      if (!result.success) {
        if (result.requiresAuth) {
          router.push(`/login?next=${encodeURIComponent(pathname)}`);
        }
        return;
      }

      setIsFavorited(result.is_favorited ?? isFavorited);
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-label={isFavorited ? "Favorilerden çıkar" : "Favorilere ekle"}
      className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm transition hover:scale-105 disabled:opacity-50"
    >
      <span className={isFavorited ? "text-red-600" : "text-gray-400"}>
        {isFavorited ? "♥" : "♡"}
      </span>
    </button>
  );
}