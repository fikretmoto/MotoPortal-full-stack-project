"use client";

import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { Gauge, Zap, ShieldCheck, Wrench } from "lucide-react";

type HighlightCard = {
  id: string;
  icon: React.ElementType;
  image: string;
  title: string;
  description: string;
};

// GEÇİCİ MOCK VERİ — sonra is_highlight API verisiyle değiştirilecek
const MOCK_HIGHLIGHTS: HighlightCard[] = [
  {
    id: "1",
    icon: Gauge,
    image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&q=80",
    title: "150cc Motor",
    description: "Şehir içi ve uzun yol kullanımına uygun dengeli güç.",
  },
  {
    id: "2",
    icon: Zap,
    image: "https://images.unsplash.com/photo-1558980664-1a1f8e5b1e8a?w=800&q=80",
    title: "Elektrikli Marş",
    description: "Tek dokunuşla anında çalıştırma konforu.",
  },
  {
    id: "3",
    icon: ShieldCheck,
    image: "https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=800&q=80",
    title: "ABS Fren Sistemi",
    description: "Ani frenlemede kontrolü kaybetmeden güvenli duruş.",
  },
  {
    id: "4",
    icon: Wrench,
    image: "https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?w=800&q=80",
    title: "Kolay Bakım",
    description: "Standart parçalarla düşük bakım maliyeti.",
  },
];

export function ProductHighlightCarousel() {
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
          {MOCK_HIGHLIGHTS.map((item) => {
            const Icon = item.icon;
            return (
              <CarouselItem
                key={item.id}
                className="pl-4 basis-[75%] sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
              >
                <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-neutral-900 shadow-sm transition-shadow duration-300 hover:shadow-xl">
                  <div className="relative aspect-[3/4] w-full overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 75vw"
                    />
                    <div className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-red-600 shadow-lg">
                      <Icon className="h-4 w-4 text-white" strokeWidth={2.5} />
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col gap-1.5 p-5">
                    <h3 className="text-base font-semibold text-white">
                      {item.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-neutral-400">
                      {item.description}
                    </p>
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        <div className="mt-6 flex items-center gap-3">
          <CarouselPrevious className="static translate-y-0 border-gray-300 bg-white text-gray-900 hover:bg-gray-100" />
          <CarouselNext className="static translate-y-0 border-gray-300 bg-white text-gray-900 hover:bg-gray-100" />
        </div>
      </Carousel>
    </section>
  );
}