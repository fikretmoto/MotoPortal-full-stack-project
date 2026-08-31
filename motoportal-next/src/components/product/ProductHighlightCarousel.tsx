"use client";

import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import type { ProductAttribute } from "@/services/catalog";

type ProductHighlightCarouselProps = {
  attributes: ProductAttribute[];
};

export function ProductHighlightCarousel({
  attributes,
}: ProductHighlightCarouselProps) {
  const highlightAttributes = attributes.filter(
    (attribute) => attribute.is_highlight && attribute.value?.trim()
  );

  if (highlightAttributes.length === 0) {
    return null;
  }

  return (
    <section className="mt-10">
      <div className="max-w-xl">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900">
          Öne Çıkan Özellikler
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Bu modeli farklı kılan detaylara yakından bakın.
        </p>
      </div>

      <Carousel opts={{ align: "start", loop: false }} className="mt-8 w-full">
        <CarouselContent className="-ml-4">
          {highlightAttributes.map((attribute) => (
            <CarouselItem
              key={attribute.id}
              className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
            >
              <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-neutral-900 shadow-sm transition-shadow duration-300 hover:shadow-xl">
                <div className="relative h-48 w-full overflow-hidden bg-neutral-800">
                  {attribute.highlight_image_url ? (
                    <Image
                      src={attribute.highlight_image_url}
                      alt={attribute.highlight_title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm text-neutral-500">
                      Görsel yok
                    </div>
                  )}

                  <span className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                    {attribute.name}
                  </span>
                </div>

                <div className="flex flex-1 flex-col gap-1.5 p-5">
                  <h3 className="text-base font-semibold text-white">
                    {attribute.highlight_title}
                  </h3>
                  <p className="text-sm leading-relaxed text-neutral-400">
                    {attribute.highlight_description}
                  </p>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <div className="mt-6 flex items-center gap-3">
          <CarouselPrevious className="static translate-y-0 border-gray-300 bg-white text-gray-900 hover:bg-gray-100" />
          <CarouselNext className="static translate-y-0 border-gray-300 bg-white text-gray-900 hover:bg-gray-100" />
        </div>
      </Carousel>
    </section>
  );
}