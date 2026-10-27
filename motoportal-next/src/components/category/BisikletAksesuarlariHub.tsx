import CategoryHubBlock, { type HubCard } from "./CategoryHubBlock";

// Bu hub'daki kartlar "Bisiklet Aksesuarları" kategorisinin alt kategorileri,
// bu yüzden yolları bu önekle başlıyor.
const BASE = "/kategori/bisiklet-aksesuarlari";

const HUB_CARDS: HubCard[] = [
  { name: "Bisiklet Çantaları", href: `${BASE}/bisiklet-cantalari` },
  { name: "Bisiklet Kilitleri", href: `${BASE}/bisiklet-kilitleri` },
  { name: "Aydınlatma", href: `${BASE}/bisiklet-aydinlatma` },
  { name: "Telefon Tutucular", href: `${BASE}/bisiklet-telefon-tutuculari` },
  { name: "Çamurluklar", href: `${BASE}/bisiklet-camurluklari` },
  { name: "Sulama & Matara", href: `${BASE}/bisiklet-matara` },
  { name: "Bisiklet Bilgisayarları", href: `${BASE}/bisiklet-bilgisayarlari` },
  // Görünen isim "Pompa & Bakım" ama gerçekte sadece Pompa & Şişirme
  // kategorisine gidiyor — Tamir & Bakım ayrı kategori, buraya dahil
  // değil, sadece "Tümü" görünümünden erişilebilir.
  { name: "Pompa & Bakım", href: `${BASE}/bisiklet-pompa-sisirme` },
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