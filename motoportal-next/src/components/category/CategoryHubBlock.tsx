import Link from "next/link";

export type HubCard = {
  name: string;
  href: string;
};

type Props = {
  title: string;
  cards: HubCard[];
  allLabel: string;
  allHref: string;
  /** Kart grid'inin sm+ ekranlardaki kolon sayısı. Varsayılan: 4. */
  columns?: 3 | 4;
};

const COLUMN_CLASSES: Record<3 | 4, string> = {
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-4",
};

export default function CategoryHubBlock({
  title,
  cards,
  allLabel,
  allHref,
  columns = 4,
}: Props) {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">{title}</h1>

      <div className={`grid grid-cols-2 gap-3 ${COLUMN_CLASSES[columns]} sm:gap-4`}>
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group flex flex-col items-center gap-2.5"
          >
            <div className="flex aspect-square w-full items-center justify-center rounded border border-[oklch(90%_0.006_70)] bg-[oklch(97%_0.006_70)] p-3 transition group-hover:border-[oklch(62%_0.19_35)] group-hover:bg-white">
              <span className="text-[9px] uppercase tracking-[0.08em] text-[oklch(70%_0.01_60)]">
                görsel
              </span>
            </div>
            <span className="text-center text-[13px] font-bold leading-tight text-[oklch(35%_0.01_60)] transition group-hover:text-[oklch(62%_0.19_35)]">
              {card.name}
            </span>
          </Link>
        ))}
      </div>

      <Link
        href={allHref}
        className="mt-8 inline-block rounded-full border-2 border-[oklch(20%_0.01_60)] bg-white px-5 py-2 text-[13px] font-bold text-[oklch(20%_0.01_60)] transition hover:border-[oklch(62%_0.19_35)] hover:text-[oklch(62%_0.19_35)]"
      >
        {allLabel}
      </Link>
    </div>
  );
}
