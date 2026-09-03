import Image from "next/image";
import Link from "next/link";

export type TagPill = {
  label: string;
  href: string;
};

export type CategoryCard = {
  name: string;
  href: string;
  image?: string;
};

type Props = {
  /** Üstte ortalanmış başlık — verilmezse hiç render edilmez */
  title?: string;
  tags: TagPill[];
  categories: CategoryCard[];
};

const TagCategoryBlock = ({ title, tags, categories }: Props) => {
  return (
    <section className="border-b border-white/10 bg-[#09090b] py-8">
      <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-8">

        {title ? (
          <h2 className="mb-5 text-center text-[11px] font-bold uppercase tracking-[0.1em] text-white xl:text-[12px]">
            {title}
          </h2>
        ) : null}

        {/* TAG PILL'LERİ — her biri kendi sayfasına gider */}
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Link
              key={tag.href}
              href={tag.href}
              className="shrink-0 whitespace-nowrap rounded-full border border-white/15 bg-white/[0.06] px-5 py-2 text-[13px] font-bold text-white transition hover:border-white/40 hover:bg-white/[0.12]"
            >
              {tag.label}
            </Link>
          ))}
        </div>

        <div className="my-6 h-px bg-white/10" />

        {/* KATEGORİ KARTLARI — her biri listeleme sayfasına gider */}
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-9 lg:gap-4">
          {categories.map((category) => (
            <Link
              key={category.href}
              href={category.href}
              className="group flex flex-col items-center gap-2.5"
            >
              <div className="flex aspect-square w-full items-center justify-center rounded border border-transparent bg-white/[0.05] p-3 transition group-hover:border-white/25 group-hover:bg-white/[0.09]">
                {category.image ? (
                  <Image
                    src={category.image}
                    alt={category.name}
                    width={160}
                    height={160}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <span className="text-[9px] uppercase tracking-[0.08em] text-white/30">
                    görsel
                  </span>
                )}
              </div>
              <span className="text-center text-[13px] font-bold leading-tight text-white/85 transition group-hover:text-white">
                {category.name}
              </span>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};

export default TagCategoryBlock;
