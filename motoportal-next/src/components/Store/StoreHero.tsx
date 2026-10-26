
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

const StoreHero = () => {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-8 pt-6 sm:px-6 lg:px-8 lg:pt-10">
      <div className="grid overflow-hidden rounded-3xl border border-border bg-muted md:grid-cols-2">
        {/* Metin alanı */}
        <div className="flex flex-col items-start justify-center px-6 py-10 sm:px-10 sm:py-14 lg:px-14 lg:py-16">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary sm:text-sm">
            <Sparkles className="h-4 w-4" />
            MOTOPORTAL MAĞAZA
          </span>

          <h1 className="max-w-xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Tarzını
            <span className="block text-primary">keşfet.</span>
          </h1>

          <p className="mt-5 max-w-lg text-sm leading-7 text-muted-foreground sm:text-base">
            Giyimden günlük ihtiyaçlara, aradığın ürünleri keşfet.
            Yeni favorin burada olabilir.
          </p>

          <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link
              href="/magaza/giyim"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              Giyimi keşfet
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/magaza"
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-accent"
            >
              Tüm ürünler
            </Link>
          </div>

          <p className="mt-6 text-xs text-muted-foreground">
            Giyimle başlayan, yeni kategorilerle büyüyen bir mağaza.
          </p>
        </div>

        {/* Görsel alanı */}
        <div className="relative min-h-[300px] bg-secondary sm:min-h-[400px] md:min-h-full">
          <Image
            src="/images/store/store-hero.jpg"
            alt="MotoPortal mağaza giyim koleksiyonu"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />

          <div className="absolute bottom-5 left-5 rounded-xl border border-white/20 bg-black/45 px-4 py-3 text-white backdrop-blur-sm sm:bottom-7 sm:left-7">
            <p className="text-xs font-medium text-white/75">
              MOTOPORTAL SEÇKİSİ
            </p>
            <p className="mt-1 text-sm font-semibold sm:text-base">
              Günlük tarzına yeni bir dokunuş
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StoreHero;
