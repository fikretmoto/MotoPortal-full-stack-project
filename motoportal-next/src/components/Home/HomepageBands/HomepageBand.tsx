import Link from "next/link";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import type { HomepageBand as HomepageBandType } from "@/services/catalog";

type HomepageBandProps = {
  band: HomepageBandType;
};

export default function HomepageBand({ band }: HomepageBandProps) {
  if (band.products.length === 0) {
    return null;
  }

  return (
    <section className="mt-14">
      <h2 className="text-2xl font-bold tracking-tight text-gray-900">
        {band.title}
      </h2>

      <Carousel opts={{ align: "start", loop: false }} className="mt-6 w-full">
        <CarouselContent className="-ml-4">
          {band.products.map((product) => (
            <CarouselItem
              key={product.id}
              className="pl-4 basis-[70%] sm:basis-1/3 lg:basis-1/4"
            >
              <Link
                href={`/products/${product.slug}`}
                className="group block overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
                  {product.cover_image_url ? (
                    <Image
                      src={product.cover_image_url}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 70vw"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
                      Görsel yakında
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="font-semibold text-gray-900">
                      {product.brand.name}
                    </span>
                    <span>{product.category.name}</span>
                  </div>

                  <h3 className="mt-1 font-semibold text-gray-900">
                    {product.name}
                  </h3>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>

        <div className="mt-4 flex items-center gap-3">
          <CarouselPrevious className="static translate-y-0 border-gray-300 bg-white text-gray-900 hover:bg-gray-100" />
          <CarouselNext className="static translate-y-0 border-gray-300 bg-white text-gray-900 hover:bg-gray-100" />
        </div>
      </Carousel>
    </section>
  );
}