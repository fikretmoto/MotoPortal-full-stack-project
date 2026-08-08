import type { ProductImage } from "@/services/catalog";

type ProductGalleryProps = {
  images: ProductImage[];
  productName: string;
};

export default function ProductGallery({
  images,
  productName,
}: ProductGalleryProps) {
  if (images.length === 0) {
    return null;
  }

  return (
    <section className="mt-12">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
          Galeri
        </p>

        <h2 className="mt-2 text-2xl font-bold text-gray-900">
          Ürün Görselleri
        </h2>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((image) => (
          <div
            key={image.id}
            className="overflow-hidden rounded-2xl border border-gray-200 bg-white"
          >
            <img
              src={image.image_url}
              alt={image.alt_text || productName}
              className="aspect-[4/3] w-full object-cover transition duration-300 hover:scale-105"
            />
          </div>
        ))}
      </div>
    </section>
  );
}