"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function DashboardProductSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [value, setValue] = useState(searchParams.get("q") ?? "");

  function runSearch(nextValue: string) {
    const trimmed = nextValue.trim();
    const params = new URLSearchParams(searchParams.toString());

    if (trimmed) {
      params.set("q", trimmed);
    } else {
      params.delete("q");
    }

    const queryString = params.toString();
    router.push(
      `/dashboard/products${queryString ? `?${queryString}` : ""}`
    );
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    runSearch(value);
  }

  function handleClear() {
    setValue("");
    runSearch("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full items-center gap-2 sm:w-auto"
    >
      <div className="relative w-full sm:w-64">
        <Input
          type="text"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Ürün adı, marka veya kod ara…"
          className={value ? "pr-7" : undefined}
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Aramayı temizle"
            className="absolute right-1.5 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded text-fg-muted transition hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <Button type="submit" size="default">
        Ara
      </Button>
    </form>
  );
}
