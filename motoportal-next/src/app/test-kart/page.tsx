import ProductCard from "@/components/product/ProductCard";
import type { Product } from "@/services/catalog";

const sampleProducts: Product[] = [
  {
    id: 1,
    name: "Honda PCX 125",
    slug: "honda-pcx-125",
    brand: { id: 1, name: "Honda", slug: "honda", logo_url: null, country: "Japonya", founded_year: 1948, website: "", description: "", is_active: true },
    category: { id: 1, name: "Scooter", slug: "scooter", parent: null, parent_name: null, is_active: true },
    short_description: "Şehir içi kullanım için ideal scooter",
    cover_image_url: null,
    is_featured: true,
    is_active: true,
    price: "285000",
    currency: "TRY",
    stock_status: "in_stock",
    badges: [
      { type: "new", label: "Yeni" },
      { type: "installment_deal", label: "Taksit Fırsatı" },
    ],
    average_rating: 4.5,
    review_count: 12,
    is_favorited: false,
  },
  {
    id: 2,
    name: "Yamaha NMAX 155",
    slug: "yamaha-nmax-155",
    brand: { id: 2, name: "Yamaha", slug: "yamaha", logo_url: null, country: "Japonya", founded_year: 1955, website: "", description: "", is_active: true },
    category: { id: 1, name: "Scooter", slug: "scooter", parent: null, parent_name: null, is_active: true },
    short_description: "",
    cover_image_url: null,
    is_featured: false,
    is_active: true,
    price: "310000",
    currency: "TRY",
    stock_status: "out_of_stock",
    badges: [{ type: "out_of_stock", label: "Tükendi" }],
    average_rating: null,
    review_count: 0,
    is_favorited: true,
  },
  {
    id: 3,
    name: "Arora Beatrix 150 — çok uzun bir ürün adı burada nasıl kırpılıyor test",
    slug: "arora-beatrix-150",
    brand: { id: 3, name: "Arora", slug: "arora", logo_url: null, country: "Türkiye", founded_year: 2010, website: "", description: "", is_active: true },
    category: { id: 2, name: "Motosiklet", slug: "motosiklet", parent: null, parent_name: null, is_active: true },
    short_description: "",
    cover_image_url: null,
    is_featured: false,
    is_active: true,
    price: "89000",
    currency: "TRY",
    stock_status: "low_stock",
    badges: [
      { type: "discount", label: "%7 İndirim" },
      { type: "low_stock", label: "Son 2 Adet" },
    ],
    average_rating: 3.8,
    review_count: 45,
    is_favorited: false,
  },
];

export default function TestKartPage() {
  return (
    <div className="min-h-screen bg-[#f4f3f1] p-10">
      <h1 className="mb-6 text-xl font-bold">Ürün Kartı — Test</h1>
      <div className="flex flex-wrap gap-6">
        {sampleProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}