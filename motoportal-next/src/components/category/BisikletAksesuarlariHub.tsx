import Link from "next/link";

type HubCard = {
  name: string;
  href: string;
};

const HUB_CARDS: HubCard[] = [
  { name: "Bisiklet Çantaları", href: "/kategori/bisiklet-cantalari" },
  { name: "Bisiklet Kilitleri", href: "/kategori/bisiklet-kilitleri" },
  { name: "Aydınlatma", href: "/kategori/bisiklet-aydinlatma" },
  { name: "Telefon Tutucular", href: "/kategori/bisiklet-telefon-tutuculari" },
  { name: "Çamurluklar", href: "/kategori/bisiklet-camurluklari" },
  { name: "Sulama & Matara", href: "/kategori/bisiklet-matara" },
  { name: "Bisiklet Bilgisayarları", href: "/kategori/bisiklet-bilgisayarlari" },
  // Görünen isim "Pompa & Bakım" ama gerçekte sadece Pompa & Şişirme
  // kategorisine gidiyor — Tamir & Bakım ayrı kategori, buraya dahil
  // değil, sadece "Tümü" görünümünden erişilebilir.
  { name: "Pompa & Bakım", href: "/kategori/bisiklet-pompa-sisirme" },
];

export default function BisikletAksesuarlariHub() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Bisiklet Aksesuarları</h1>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {HUB_CARDS.map((card) => (
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
        href="/kategori/bisiklet-aksesuarlari?view=all"
        className="mt-8 inline-block rounded-full border-2 border-[oklch(20%_0.01_60)] bg-white px-5 py-2 text-[13px] font-bold text-[oklch(20%_0.01_60)] transition hover:border-[oklch(62%_0.19_35)] hover:text-[oklch(62%_0.19_35)]"
      >
        Tüm Bisiklet Aksesuarları
      </Link>
    </div>
  );
}
