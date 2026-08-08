import Image from "next/image";
import Link from "next/link";
import {
  getBrands,
  getCategories,
  getProducts,
  type Brand,
  type Category,
  type Product,
  
} from "@/services/catalog";




export default async function HomePage() {
  const [categories, brands, products]: [
    Category[],
    Brand[],
    Product[],
  ] = await Promise.all([
    getCategories(),
    getBrands(),
    getProducts(),
  ])

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <section>
        <h1 className="text-3xl font-bold">
          MotoPortal Kategorileri
        </h1>

        <p className="mt-2 text-gray-600">
          Bu veriler Django API üzerinden geliyor.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <article
              key={category.id}
              className="rounded-xl border p-5 shadow-sm"
            >
              <h2 className="text-lg font-semibold">
                {category.name}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Slug: {category.slug}
              </p>

              {category.parent_name && (
                <p className="mt-2 text-sm">
                  Üst kategori: {category.parent_name}
                </p>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-3xl font-bold">
          Markalar
        </h2>

        <p className="mt-2 text-gray-600">
          MotoPortal marka verileri Django API’den geliyor.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {brands.map((brand) => (
            <article
              key={brand.id}
              className="rounded-xl border p-5 shadow-sm"
            >
              <h3 className="text-lg font-semibold">
                {brand.name}
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Slug: {brand.slug}
              </p>

              {brand.country && (
                <p className="mt-2 text-sm">
                  Ülke: {brand.country}
                </p>
              )}

              {brand.founded_year && (
                <p className="mt-1 text-sm">
                  Kuruluş: {brand.founded_year}
                </p>
              )}
            </article>
          ))}
        </div>
      </section>


      <section className="mt-14">
  <h2 className="text-3xl font-bold">
    Ürünler
  </h2>

  <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {products.map((product) => (
  <Link
    key={product.id}
    href={`/products/${product.slug}`}
    className="block"
  >
    <article className="rounded-xl border p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <h3 className="text-lg font-semibold">
        {product.name}
      </h3>

      <p className="text-sm text-gray-500">
        {product.brand.name}
      </p>

      <p className="text-sm text-gray-500">
        {product.category.name}
      </p>

      <p className="mt-3">
        {product.short_description}
      </p>

      {product.cover_image_url && (
        <img
          src={product.cover_image_url}
          alt={product.name}
          className="mt-4 h-40 w-full rounded-lg object-cover"
        />
      )}
    </article>
  </Link>
))}
      
    
  </div>
</section>
    </main>
  );
}


