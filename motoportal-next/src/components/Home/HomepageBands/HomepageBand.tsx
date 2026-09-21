import Link from "next/link";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import type { HomepageBand as HomepageBandType, ProductBadge } from "@/services/catalog";

type HomepageBandProps = {
  band: HomepageBandType;
};

const BADGE_STYLES: Record<string, string> = {
  new: "bg-emerald-600 text-white",
  discount: "bg-red-600 text-white",
  out_of_stock: "bg-gray-500 text-white",
  low_stock: "bg-amber-500 text-white",
  featured: "bg-elevated text-white",
  editors_pick: "bg-purple-600 text-white",
  deal: "bg-orange-600 text-white",
  trade_opportunity: "bg-blue-600 text-white",
  free_shipping: "bg-teal-600 text-white",
  installment_deal: "bg-indigo-600 text-white",
};

function ProductBadges({ badges }: { badges: ProductBadge[] }) {
  if (badges.length === 0) {
    return null;
  }

  return (
    <div className="absolute left-2 top-2 z-10 flex flex-col gap-1">
      {badges.slice(0, 5).map((badge) => (
        <span
          key={badge.type}
          className={`rounded px-2 py-0.5 text-[10px] font-semibold ${
            BADGE_STYLES[badge.type] ?? "bg-surface-hover text-white"
          }`}
        >
          {badge.label}
        </span>
      ))}
    </div>
  );
}

export default function HomepageBand({ band }: HomepageBandProps) {
  if (band.products.length === 0) {
    return null;
  }

  return (
    <section className="mt-14">
      <h2 className="text-2xl font-bold tracking-tight text-foreground">
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
                className="group block overflow-hidden rounded-2xl border border-line bg-card shadow-sm transition hover:shadow-md"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface">
                  <ProductBadges badges={product.badges} />

                  {product.cover_image_url ? (
                    <Image
                      src={product.cover_image_url}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 70vw"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm text-fg-subtle">
                      Görsel yakında
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <div className="flex items-center gap-2 text-xs text-fg-muted">
                    <span className="font-semibold text-foreground">
                      {product.brand.name}
                    </span>
                    <span>{product.category.name}</span>
                  </div>

                  <h3 className="mt-1 font-semibold text-foreground">
                    {product.display_name || product.name}
                  </h3>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>

        <div className="mt-4 flex items-center gap-3">
          <CarouselPrevious className="static translate-y-0 border-line bg-card text-foreground hover:bg-surface-hover" />
          <CarouselNext className="static translate-y-0 border-line bg-card text-foreground hover:bg-surface-hover" />
        </div>
      </Carousel>
    </section>
  );
}