"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

import type { ProductImage } from "@/services/catalog";

type ProductHeroGalleryProps = {
  coverImageUrl?: string | null;
  images: ProductImage[];
  productName: string;
};

type GalleryImage = {
  id: string;
  image_url: string;
  alt_text: string;
};

export default function ProductHeroGallery({
  coverImageUrl,
  images,
  productName,
}: ProductHeroGalleryProps) {
  const galleryImages = useMemo<GalleryImage[]>(() => {
    const mappedImages = images
      .filter(
        (image): image is ProductImage & { image_url: string } =>
          Boolean(image.image_url)
      )
      .map((image) => ({
        id: `gallery-${image.id}`,
        image_url: image.image_url,
        alt_text: image.alt_text || productName,
      }));

    if (!coverImageUrl) {
      return mappedImages;
    }

    return [
      {
        id: "cover-image",
        image_url: coverImageUrl,
        alt_text: productName,
      },
      ...mappedImages.filter(
        (image) => image.image_url !== coverImageUrl
      ),
    ];
  }, [coverImageUrl, images, productName]);

  const [selectedImageId, setSelectedImageId] = useState<string | null>(
    galleryImages[0]?.id ?? null
  );
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const resolvedSelectedImageId =
    selectedImageId &&
    galleryImages.some((image) => image.id === selectedImageId)
      ? selectedImageId
      : galleryImages[0]?.id ?? null;

  const selectedIndex = galleryImages.findIndex(
    (image) => image.id === resolvedSelectedImageId
  );

  const selectedImage =
    galleryImages[selectedIndex] ?? galleryImages[0] ?? null;

  const goToIndex = useCallback(
    (index: number) => {
      if (galleryImages.length === 0) return;
      const nextIndex =
        (index + galleryImages.length) % galleryImages.length;
      setSelectedImageId(galleryImages[nextIndex].id);
    },
    [galleryImages]
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

  if (!selectedImage) {
    return (
      <div className="flex h-[500px] items-center justify-center rounded-2xl border border-gray-200 bg-gray-100 text-gray-500">
        Görsel Yok
      </div>
    );
  }

  const hasMultipleImages = galleryImages.length > 1;

  return (
    <div>
      <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <button
          type="button"
          onClick={() => setIsLightboxOpen(true)}
          className="block w-full cursor-zoom-in"
        >
          <img
            src={selectedImage.image_url}
            alt={selectedImage.alt_text}
            className="h-[520px] w-full object-contain p-6"
          />
        </button>

        {hasMultipleImages && (
          <>
            <button
              type="button"
              onClick={goPrev}
              aria-label="Önceki görsel"
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-gray-200 bg-white/90 p-2 opacity-0 shadow-sm transition hover:bg-white group-hover:opacity-100"
            >
              <ChevronLeft className="h-5 w-5 text-gray-900" />
            </button>

            <button
              type="button"
              onClick={goNext}
              aria-label="Sonraki görsel"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-gray-200 bg-white/90 p-2 opacity-0 shadow-sm transition hover:bg-white group-hover:opacity-100"
            >
              <ChevronRight className="h-5 w-5 text-gray-900" />
            </button>
          </>
        )}
      </div>

      {hasMultipleImages && (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
          {galleryImages.map((image) => {
            const isActive = selectedImage.id === image.id;

            return (
              <button
                key={image.id}
                type="button"
                onClick={() => setSelectedImageId(image.id)}
                className={`shrink-0 overflow-hidden rounded-xl border-2 bg-white transition ${
                  isActive
                    ? "border-gray-900"
                    : "border-gray-200 hover:border-gray-400"
                }`}
              >
                <img
                  src={image.image_url}
                  alt={image.alt_text}
                  className="h-24 w-28 object-contain p-2"
                />
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

          {hasMultipleImages && (
            <span className="absolute left-1/2 top-6 -translate-x-1/2 text-sm font-medium text-white/80">
              {selectedIndex + 1} / {galleryImages.length}
            </span>
          )}

          <img
            src={selectedImage.image_url}
            alt={selectedImage.alt_text}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[85vh] max-w-[90vw] object-contain"
          />

          {hasMultipleImages && (
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