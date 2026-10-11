import Link from "next/link";
import { getBrandsWithProducts } from "@/services/catalog";

const IletisimBrandStrip = async () => {
  const brands = await getBrandsWithProducts();

  return (
    <section className="px-[24px] pt-[32px] pb-[72px]">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-[16px] rounded-[16px] border border-border bg-white p-[28px]">
        <h2 className="m-0 font-[family-name:var(--font-barlow-condensed)] text-[28px] font-bold">
          Mağazamızda bulabileceğiniz markalar
        </h2>
        <div className="flex flex-wrap gap-[10px]">
          {brands.map((brand) => (
            <Link
              key={brand.slug}
              href={`/marka/${brand.slug}`}
              className="inline-flex min-h-[40px] items-center rounded-full border border-border bg-elevated px-[16px] text-[15px] font-semibold text-foreground no-underline"
            >
              {brand.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IletisimBrandStrip;
