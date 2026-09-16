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
    <section className="border-b border-[oklch(90%_0.006_70)] bg-white py-8">
      <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-8">

        {title ? (
          <h2 className="mb-5 text-center text-[11px] font-black uppercase tracking-[0.1em] text-[oklch(20%_0.01_60)] xl:text-[12px]">
            {title}
          </h2>
        ) : null}

        {/* TAG PILL'LERİ — her biri kendi sayfasına gider */}
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Link
              key={tag.href}
              href={tag.href}
              className="shrink-0 whitespace-nowrap rounded-full border-2 border-[oklch(20%_0.01_60)] bg-white px-5 py-2 text-[13px] font-bold text-[oklch(20%_0.01_60)] transition hover:border-[oklch(62%_0.19_35)] hover:text-[oklch(62%_0.19_35)]"
            >
              {tag.label}
            </Link>
          ))}
        </div>

        <div className="my-6 h-px bg-[oklch(90%_0.006_70)]" />

        {/* KATEGORİ KARTLARI — her biri listeleme sayfasına gider */}
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-9 lg:gap-4">
          {categories.map((category) => (
            <Link
              key={category.href}
              href={category.href}
              className="group flex flex-col items-center gap-2.5"
            >
              <div className="flex aspect-square w-full items-center justify-center rounded border border-[oklch(90%_0.006_70)] bg-[oklch(97%_0.006_70)] p-3 transition group-hover:border-[oklch(62%_0.19_35)] group-hover:bg-white">
                {category.image ? (
                  <Image
                    src={category.image}
                    alt={category.name}
                    width={160}
                    height={160}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <span className="text-[9px] uppercase tracking-[0.08em] text-[oklch(70%_0.01_60)]">
                    görsel
                  </span>
                )}
              </div>
              <span className="text-center text-[13px] font-bold leading-tight text-[oklch(35%_0.01_60)] transition group-hover:text-[oklch(62%_0.19_35)]">
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