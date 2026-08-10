import Link from "next/link";

import { getBrands } from "@/services/catalog";

export default async function Brands() {
  const brands = await getBrands();

  const displayedBrands = brands
    .filter((brand) => brand.is_active)
    .slice(0, 8);

  if (displayedBrands.length === 0) {
    return null;
  }

  return (
    <section className="border-b border-neutral-200 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-14 md:py-16">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
              Markalar
            </span>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
              Sektordeki markalari kesfet.
            </h2>

            <p className="mt-4 text-base leading-7 text-neutral-600">
              Mevcut katalogdan secilen markalari incele ve tum marka
              arsivine tek adimda ulas.
            </p>
          </div>

          <Link
            href="/brands"
            className="text-sm font-medium text-neutral-950 transition hover:text-neutral-700"
          >
            Tum Markalari Gor
          </Link>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {displayedBrands.map((brand) => (
            <Link
              key={brand.id}
              href="/brands"
              className="group rounded-3xl border border-neutral-200 bg-neutral-50 p-6 transition hover:border-neutral-300 hover:bg-white"
            >
              <div className="flex min-h-32 flex-col justify-between gap-6">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
                  Marka
                </span>

                <div>
                  <h3 className="text-2xl font-semibold tracking-tight text-neutral-950">
                    {brand.name}
                  </h3>

                  {brand.country && (
                    <p className="mt-3 text-sm text-neutral-500">
                      {brand.country}
                    </p>
                  )}
                </div>

                <span className="text-sm font-medium text-neutral-400 transition group-hover:text-neutral-700">
                  Incele
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
