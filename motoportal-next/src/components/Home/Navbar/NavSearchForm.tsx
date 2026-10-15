"use client";

import { Suspense, useId } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { topBarContent } from "@/constant/constant";

type Variant = "mobile" | "desktop";

const VARIANT_CLASSES: Record<
  Variant,
  { input: string; button: string; icon: string }
> = {
  mobile: {
    input:
      "h-11 min-w-0 flex-1 bg-white px-4 text-sm text-[oklch(20%_0.01_60)] outline-none placeholder:text-[oklch(55%_0.01_60)]",
    button:
      "inline-flex h-11 w-12 items-center justify-center bg-[oklch(62%_0.19_35)] text-white transition hover:bg-[oklch(56%_0.19_35)]",
    icon: "h-4 w-4",
  },
  desktop: {
    input:
      "h-13 min-w-0 flex-1 bg-white px-5 text-base text-[oklch(20%_0.01_60)] outline-none placeholder:text-[oklch(55%_0.01_60)]",
    button:
      "inline-flex h-13 w-14 items-center justify-center bg-[oklch(62%_0.19_35)] text-white transition hover:bg-[oklch(56%_0.19_35)]",
    icon: "h-5 w-5",
  },
};

// Saf gorsel govde -- hook kullanmiyor, boylece Suspense fallback'i
// gercek icerikle piksel piksel ayni olabiliyor (sadece defaultValue
// farkli). Enter/ikon tiklama/bos-arama-engelleme tamamen native form
// davranisiyla (action+method+required) cozuluyor, JS'e bagimli degil.
function SearchFormView({
  variant,
  defaultValue,
}: {
  variant: Variant;
  defaultValue: string;
}) {
  const classes = VARIANT_CLASSES[variant];
  const inputId = useId();

  return (
    <form
      action="/ara"
      method="GET"
      role="search"
      className="flex items-center overflow-hidden rounded-xl border-2 border-[oklch(20%_0.01_60)] bg-white"
    >
      <input
        id={inputId}
        type="search"
        name="q"
        required
        defaultValue={defaultValue}
        placeholder={topBarContent.searchPlaceholder}
        className={classes.input}
      />
      <button
        type="submit"
        aria-label={topBarContent.searchButtonLabel}
        className={classes.button}
      >
        <Search className={classes.icon} />
      </button>
    </form>
  );
}

function NavSearchFormInner({ variant }: { variant: Variant }) {
  const searchParams = useSearchParams();
  return (
    <SearchFormView variant={variant} defaultValue={searchParams.get("q") ?? ""} />
  );
}

// useSearchParams() client tarafinda calisir, Next.js build sirasinda
// bir Suspense siniri gerektirir -- yoksa "useSearchParams should be
// wrapped in a suspense boundary" derleme hatasi verir.
export default function NavSearchForm({ variant }: { variant: Variant }) {
  return (
    <Suspense fallback={<SearchFormView variant={variant} defaultValue="" />}>
      <NavSearchFormInner variant={variant} />
    </Suspense>
  );
}
