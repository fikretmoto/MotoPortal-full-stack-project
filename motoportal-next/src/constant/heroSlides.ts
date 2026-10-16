// Ana sayfa hero karuselindeki kartlar.
// Yeni kart eklemek için bu listeye bir satır ekle, kaldırmak için sil. Sıra = ekrandaki sıra.
// Görselleri motoportal-next/public/hero/ klasörüne koy (öneri: 1600x1200 px, yatay 4:3, JPG/WebP, 300 KB altı).
// Mobilde kart dikey kırpılır; ürünü/sahneyi görselin ortasında tut.

export type HeroSlide = {
  id: string;
  badge?: string; // kart üstündeki küçük etiket, örn. "Editörün Seçimi"
  title: string; // kart başlığı
  highlight: string; // neden öne çıkarıyoruz: 1-2 satırlık vurgu cümlesi
  image: string; // örn. "/hero/nmax-125.jpg"
  href: string; // "Ürünü İncele" ile gidilecek sayfa
};

export const heroSlides: HeroSlide[] = [
  {
    id: "mondial-velomax-125",
    badge: "Editörün Seçimi",
    title: "Mondial Velomax 125",
    highlight: "Segmentinin referansı: çekiş kontrolü, TFT ekran ve akıllı bağlantı tek pakette.",
    image: "/hero/mondial-velomax.jpg",
    href: "/products/mondial-velomax",
  },
  {
    id: "mondial-fuzion-125",
    badge: "Yeni Sezon",
    title: "Mondial Fuzion 125",
    highlight: "Dört mevsim uzun yol için katmanlı yapı ve tam koruma; macera sürücülerinin tercihi.",
    image: "/hero/mondial-fuzion.jpg",
    href: "/products/mondial-fuzion-125",
  },

  {
    id: "yuki-defender-125",
    badge: "Fiyet Performans",
    title: "Yuki Defender 125",
    highlight: "Sınıfının en sportif 125'i: dijital ekran, güçlü çekiş, düşük tüketim.",
    image: "/hero/defender-125.png",
    href: "/products/defender-125",
  },

];