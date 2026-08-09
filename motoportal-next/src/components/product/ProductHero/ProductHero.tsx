import type { ProductDetail } from "@/services/catalog";

import ProductHeroGallery from "./ProductHeroGallery";
import ProductHeroAttributes from "./ProductHeroAttributes";

type ProductHeroProps = {
  product: ProductDetail;
};

export default function ProductHero({
  product,
}: ProductHeroProps) {
  return (
    <section className="mt-8 grid gap-10 lg:grid-cols-2 lg:items-start">
      <ProductHeroGallery
        coverImageUrl={product.cover_image_url}
        images={product.images}
        productName={product.name}
      />

      <ProductHeroAttributes product={product} />
    </section>
  );
}