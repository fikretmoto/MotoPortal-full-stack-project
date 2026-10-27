import CategoryHubBlock, { type HubCard } from "./CategoryHubBlock";

// Bu hub'daki kartların üst kategorisi "temizlik-urunleri" varsayılıyor.
// Kartlardan biri başka bir üst kategorinin altındaysa önek o kart için
// değişmeli, bunu /categories/ verisinden kontrol etmek gerekir.
const BASE = "/kategori/temizlik-urunleri";

const HUB_CARDS: HubCard[] = [
  { name: "Motosiklet Temizliği", href: `${BASE}/motosiklet-temizligi` },
  { name: "Zincir Bakımı", href: `${BASE}/zincir-temizligi` },
  { name: "Kask & Vizör", href: `${BASE}/kask-ve-vizor-bakimi` },
  { name: "Parlatma & Koruma", href: `${BASE}/parlatma-ve-koruma` },
  { name: "Fırça & Bez", href: `${BASE}/firca-ve-bezler` },
  { name: "Bakım Setleri", href: `${BASE}/bakim-setleri` },
];

export default function TemizlikUrunleriHub() {
  return (
    <CategoryHubBlock
      title="Temizlik Ürünleri"
      cards={HUB_CARDS}
      allLabel="Tüm Temizlik Ürünleri"
      allHref="/kategori/temizlik-urunleri?view=all"
      columns={3}
    />
  );
}