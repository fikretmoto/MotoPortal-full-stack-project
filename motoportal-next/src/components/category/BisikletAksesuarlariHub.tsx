import CategoryHubBlock, { type HubCard } from "./CategoryHubBlock";

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
    <CategoryHubBlock
      title="Bisiklet Aksesuarları"
      cards={HUB_CARDS}
      allLabel="Tüm Bisiklet Aksesuarları"
      allHref="/kategori/bisiklet-aksesuarlari?view=all"
    />
  );
}
