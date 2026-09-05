"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { campaignTags } from "@/constant/homepageBlocks";

export default function TagPillNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-2">
      {campaignTags.map((tag) => {
        const isActive = pathname === tag.href;

        return (
          <Link
            key={tag.href}
            href={tag.href}
            className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
              isActive
                ? "bg-blue-700 text-white"
                : "bg-gray-900 text-white hover:opacity-80"
            }`}
          >
            {tag.label}
          </Link>
        );
      })}
    </nav>
  );
}