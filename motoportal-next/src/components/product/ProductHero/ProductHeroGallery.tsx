"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Play, X } from "lucide-react";

import type { ProductImage } from "@/services/catalog";

type ProductHeroGalleryProps = {
  coverImageUrl?: string | null;
  images: ProductImage[];
  productName: string;
  videoUrl?: string | null;
};

type GalleryItem = {
  id: string;
  type: "image" | "video";
  src: string;
  alt: string;
};

export default function ProductHeroGallery({
  coverImageUrl,
  images,
  productName,
  videoUrl,
}: ProductHeroGalleryProps) {
  const galleryItems = useMemo<GalleryItem[]>(() => {
    const mappedImages: GalleryItem[] = images
      .filter(
        (image): image is ProductImage & { image_url: string } =>
          Boolean(image.image_url)
      )
      .map((image) => ({
        id: `gallery-${image.id}`,
        type: "image",
        src: image.image_url,
        alt: image.alt_text || productName,
      }));

    const imageItems: GalleryItem[] = coverImageUrl
      ? [
          {
            id: "cover-image",
            type: "image",
            src: coverImageUrl,
            alt: productName,
          },
          ...mappedImages.filter((image) => image.src !== coverImageUrl),
        ]
      : mappedImages;

    // video_url boş/null ise video öğesi hiç eklenmez -- galeri
    // eskisi gibi sadece görsellerden oluşur.
    const trimmedVideoUrl = videoUrl?.trim();

    if (!trimmedVideoUrl) {
      return imageItems;
    }

    return [
      {
        id: "product-video",
        type: "video",
        src: trimmedVideoUrl,
        alt: `${productName} videosu`,
      },
      ...imageItems,
    ];
  }, [coverImageUrl, images, productName, videoUrl]);

  // Varsayılan seçim listenin ilk öğesi: video varsa video (ana
  // alanda poster görünür, oynatma kullanıcıya bırakılır).
  const [selectedItemId, setSelectedItemId] = useState<string | null>(
    galleryItems[0]?.id ?? null
  );
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const resolvedSelectedItemId =
    selectedItemId && galleryItems.some((item) => item.id === selectedItemId)
      ? selectedItemId
      : galleryItems[0]?.id ?? null;

  const selectedIndex = galleryItems.findIndex(
    (item) => item.id === resolvedSelectedItemId
  );

  const selectedItem = galleryItems[selectedIndex] ?? galleryItems[0] ?? null;

  const goToIndex = useCallback(
    (index: number) => {
      if (galleryItems.length === 0) return;
      const nextIndex = (index + galleryItems.length) % galleryItems.length;
      setSelectedItemId(galleryItems[nextIndex].id);
    },
    [galleryItems]
  );

  const goPrev = useCallback(() => {
    goToIndex(selectedIndex - 1);
  }, [goToIndex, selectedIndex]);

  const goNext = useCallback(() => {
    goToIndex(selectedIndex + 1);
  }, [goToIndex, selectedIndex]);

  // Lightbox açıkken ok tuşları ve Escape ile gezinme
  useEffect(() => {
    if (!isLightboxOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "Escape") setIsLightboxOpen(false);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, goPrev, goNext]);

  if (!selectedItem) {
    return (
      <div className="flex h-[500px] items-center justify-center rounded-2xl border border-line bg-surface text-fg-muted">
        Görsel Yok
      </div>
    );
  }

  const hasMultipleItems = galleryItems.length > 1;
  const posterUrl = coverImageUrl || undefined;

  return (
    <div>
      <div className="group relative overflow-hidden rounded-2xl border border-line bg-card">
        {selectedItem.type === "video" ? (
          // Video kendi kontrollerini kullanıyor; ana alana tıklamak
          // lightbox'ı açmıyor (oynat/duraklat tıklamalarıyla çakışmasın).
          <video
            key={selectedItem.src}
            src={selectedItem.src}
            poster={posterUrl}
            controls
            playsInline
            preload="metadata"
            aria-label={selectedItem.alt}
            className="h-[520px] w-full bg-black object-contain"
          />
        ) : (
          <button
            type="button"
            onClick={() => setIsLightboxOpen(true)}
            className="block w-full cursor-zoom-in"
          >
            <img
              src={selectedItem.src}
              alt={selectedItem.alt}
              className="h-[520px] w-full object-contain p-6"
            />
          </button>
        )}

        {hasMultipleItems && (
          <>
            <button
              type="button"
              onClick={goPrev}
              aria-label="Önceki görsel"
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-line bg-card/90 p-2 opacity-0 shadow-sm transition hover:bg-card group-hover:opacity-100"
            >
              <ChevronLeft className="h-5 w-5 text-foreground" />
            </button>

            <button
              type="button"
              onClick={goNext}
              aria-label="Sonraki görsel"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-line bg-card/90 p-2 opacity-0 shadow-sm transition hover:bg-card group-hover:opacity-100"
            >
              <ChevronRight className="h-5 w-5 text-foreground" />
            </button>
          </>
        )}
      </div>

      {hasMultipleItems && (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
          {galleryItems.map((item) => {
            const isActive = selectedItem.id === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedItemId(item.id)}
                aria-label={item.type === "video" ? item.alt : undefined}
                className={`relative shrink-0 overflow-hidden rounded-xl border-2 bg-card transition ${
                  isActive
                    ? "border-primary"
                    : "border-line hover:border-fg-subtle"
                }`}
              >
                {item.type === "video" ? (
                  <>
                    {posterUrl ? (
                      <img
                        src={posterUrl}
                        alt=""
                        className="h-24 w-28 object-contain p-2"
                      />
                    ) : (
                      <div className="h-24 w-28 bg-surface" />
                    )}
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white shadow-md">
                        <Play className="ml-0.5 h-5 w-5 fill-current" />
                      </span>
                    </span>
                  </>
                ) : (
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="h-24 w-28 object-contain p-2"
                  />
                )}
              </button>
            );
          })}
        </div>
      )}

      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-6"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            type="button"
            onClick={() => setIsLightboxOpen(false)}
            aria-label="Kapat"
            className="absolute right-6 top-6 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
          >
            <X className="h-6 w-6" />
          </button>

          {hasMultipleItems && (
            <span className="absolute left-1/2 top-6 -translate-x-1/2 text-sm font-medium text-white/80">
              {selectedIndex + 1} / {galleryItems.length}
            </span>
          )}

          {/* Lightbox'ta video da gösteriliyor: oklarla videoya
              gelindiğinde kontrollü <video> çıkar. */}
          {selectedItem.type === "video" ? (
            <video
              key={`lightbox-${selectedItem.src}`}
              src={selectedItem.src}
              poster={posterUrl}
              controls
              playsInline
              preload="metadata"
              aria-label={selectedItem.alt}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[85vh] max-w-[90vw] object-contain"
            />
          ) : (
            <img
              src={selectedItem.src}
              alt={selectedItem.alt}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[85vh] max-w-[90vw] object-contain"
            />
          )}

          {hasMultipleItems && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goPrev();
                }}
                aria-label="Önceki görsel"
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goNext();
                }}
                aria-label="Sonraki görsel"
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
