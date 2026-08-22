import { notFound } from "next/navigation";
import { getCategories, getBrands } from "@/services/catalog";
import { getProductForEdit } from "@/services/products";
import { ProductForm } from "@/components/ProductForm/ProductForm";

type EditProductPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { slug } = await params;

  const [categories, brands, product] = await Promise.all([
    getCategories(),
    getBrands(),
    getProductForEdit(slug),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-6">Ürün Düzenle: {product.name}</h1>
      <ProductForm categories={categories} brands={brands} initialData={product} />
    </div>
  );
}