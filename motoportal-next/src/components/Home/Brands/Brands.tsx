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
    <section
      id="markalar"
      className="border-b border-line bg-background"
    >
      <div className="mx-auto max-w-6xl px-6 py-14 md:py-16">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-fg-muted">
              Markalar
            </span>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Sektordeki markalari kesfet.
            </h2>

            <p className="mt-4 text-base leading-7 text-fg-muted">
              Mevcut katalogdan secilen markalari incele ve tum marka
              arsivine tek adimda ulas.
            </p>
          </div>

          <Link
            href="#markalar"
            className="text-sm font-medium text-foreground transition hover:text-primary"
          >
            Tum Markalari Gor
          </Link>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {displayedBrands.map((brand) => (
            <Link
              key={brand.id}
              href="#markalar"
              className="group rounded-3xl border border-line bg-surface p-6 transition hover:border-fg-subtle hover:bg-surface-hover"
            >
              <div className="flex min-h-32 flex-col justify-between gap-6">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-fg-muted">
                  Marka
                </span>

                <div>
                  <h3 className="text-2xl font-semibold tracking-tight text-foreground">
                    {brand.name}
                  </h3>

                  {brand.country && (
                    <p className="mt-3 text-sm text-fg-muted">
                      {brand.country}
                    </p>
                  )}
                </div>

                <span className="text-sm font-medium text-fg-subtle transition group-hover:text-foreground">
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
