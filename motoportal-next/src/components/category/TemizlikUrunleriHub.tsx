import CategoryHubBlock, { type HubCard } from "./CategoryHubBlock";

const HUB_CARDS: HubCard[] = [
  { name: "Motosiklet Temizliği", href: "/kategori/motosiklet-temizligi" },
  { name: "Zincir Bakımı", href: "/kategori/zincir-temizligi" },
  { name: "Kask & Vizör", href: "/kategori/kask-ve-vizor-bakimi" },
  { name: "Parlatma & Koruma", href: "/kategori/parlatma-ve-koruma" },
  { name: "Fırça & Bez", href: "/kategori/firca-ve-bezler" },
  { name: "Bakım Setleri", href: "/kategori/bakim-setleri" },
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
