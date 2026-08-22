import { getCategories, getBrands } from "@/services/catalog";
import { ProductForm } from "@/components/ProductForm/ProductForm";

export default async function NewProductPage() {
  const [categories, brands] = await Promise.all([
    getCategories(),
    getBrands(),
  ]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-6">Yeni Ürün Ekle</h1>
      <ProductForm categories={categories} brands={brands} />
    </div>
  );
}