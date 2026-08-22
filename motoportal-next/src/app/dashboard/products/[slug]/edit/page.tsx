type EditProductPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const { slug } = await params;

  return (
    <div>
      <h1>Ürün Düzenle: {slug}</h1>
    </div>
  );
}