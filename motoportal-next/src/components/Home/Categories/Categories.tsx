import Link from "next/link";

import { homeCategoryItems } from "@/constant/constant";

const Categories = () => {
  return (
    <section
      id="kategoriler"
      className="border-b border-neutral-200 bg-white"
    >
      <div className="mx-auto max-w-6xl px-6 py-14 md:py-16">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
            Kategoriler
          </span>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
            Ilgilendigin alandan basla.
          </h2>

          <p className="mt-4 text-base leading-7 text-neutral-600">
            Ana kategorileri hizlica incele ve ilgini ceken alana dogrudan
            gec.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {homeCategoryItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="group rounded-3xl border border-neutral-200 bg-neutral-50 p-6 transition hover:border-neutral-300 hover:bg-white"
            >
              <div className="flex min-h-28 flex-col justify-between gap-6">
                <span className="text-sm font-medium uppercase tracking-[0.16em] text-neutral-500">
                  Ana Kategori
                </span>

                <div className="flex items-end justify-between gap-4">
                  <h3 className="text-2xl font-semibold tracking-tight text-neutral-950">
                    {item.label}
                  </h3>

                  <span className="text-sm font-medium text-neutral-400 transition group-hover:text-neutral-700">
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
