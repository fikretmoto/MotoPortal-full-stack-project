const Hero = () => {
  return (
    <section className="border-b border-neutral-200 bg-white">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-14 md:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="max-w-2xl">
          <span className="inline-flex rounded-full border border-neutral-300 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-600">
            MotoPortal
          </span>

          <h1 className="mt-6 max-w-xl text-4xl font-semibold tracking-tight text-neutral-950 sm:text-5xl lg:text-6xl">
            Doğru motosikleti bul.
          </h1>

          <p className="mt-5 max-w-xl text-base leading-7 text-neutral-600 sm:text-lg">
            Marka, model ve kategorileri karşılaştır. Motosiklet dünyasını
            daha bilinçli keşfet.
          </p>

          <form
            className="mt-8 flex flex-col gap-3 rounded-3xl border border-neutral-200 bg-neutral-50 p-3 sm:flex-row sm:items-center"
            role="search"
          >
            <input
              type="search"
              placeholder="Marka, model veya kategori ara"
              className="h-12 flex-1 rounded-2xl border border-transparent bg-white px-4 text-sm text-neutral-900 outline-none ring-0 placeholder:text-neutral-400 focus:border-neutral-300"
            />

            <button
              type="button"
              className="inline-flex h-12 items-center justify-center rounded-2xl bg-neutral-950 px-6 text-sm font-medium text-white transition hover:bg-neutral-800"
            >
              Ara
            </button>
          </form>
        </div>

        <div className="lg:justify-self-end">
          <div className="relative overflow-hidden rounded-[2rem] border border-neutral-200 bg-neutral-100 p-6 sm:p-8">
            <div className="aspect-[4/3] rounded-[1.5rem] border border-dashed border-neutral-300 bg-white/80" />

            <div className="pointer-events-none absolute inset-x-6 bottom-6 rounded-[1.5rem] border border-white/70 bg-white/80 p-5 backdrop-blur-sm sm:inset-x-8 sm:bottom-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
                Görsel Alanı
              </p>

              <p className="mt-2 text-sm leading-6 text-neutral-600">
                Buraya daha sonra MotoPortal ana sayfası için güçlü bir
                motosiklet görseli eklenecek.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
