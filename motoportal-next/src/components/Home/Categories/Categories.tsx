import Link from "next/link";

import { homeCategoryItems } from "@/constant/constant";

const Categories = () => {
  return (
    <section
      id="kategoriler"
      className="border-b border-line bg-background"
    >
      <div className="mx-auto max-w-6xl px-6 py-14 md:py-16">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-fg-muted">
            Kategoriler
          </span>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Ilgilendigin alandan basla.
          </h2>

          <p className="mt-4 text-base leading-7 text-fg-muted">
            Ana kategorileri hizlica incele ve ilgini ceken alana dogrudan
            gec.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {homeCategoryItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="group rounded-3xl border border-line bg-surface p-6 transition hover:border-fg-subtle hover:bg-surface-hover"
            >
              <div className="flex min-h-28 flex-col justify-between gap-6">
                <span className="text-sm font-medium uppercase tracking-[0.16em] text-fg-muted">
                  Ana Kategori
                </span>

                <div className="flex items-end justify-between gap-4">
                  <h3 className="text-2xl font-semibold tracking-tight text-foreground">
                    {item.label}
                  </h3>

                  <span className="text-sm font-medium text-fg-subtle transition group-hover:text-foreground">
                    Kesfet
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
