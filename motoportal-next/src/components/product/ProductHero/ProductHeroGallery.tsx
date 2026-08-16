"use client";

import { useMemo, useState } from "react";

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
  const resolvedSelectedImageId =
    selectedImageId &&
    galleryImages.some((image) => image.id === selectedImageId)
      ? selectedImageId
      : galleryImages[0]?.id ?? null;

  const selectedImage =
    galleryImages.find(
      (image) => image.id === resolvedSelectedImageId
    ) ?? galleryImages[0] ?? null;

  if (!selectedImage) {
    return (
      <div className="flex h-[500px] items-center justify-center rounded-2xl border border-gray-200 bg-gray-100 text-gray-500">
        Görsel Yok
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <img
          src={selectedImage.image_url}
          alt={selectedImage.alt_text}
          className="h-[520px] w-full object-contain p-6"
        />
      </div>

      {galleryImages.length > 1 && (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
          {galleryImages.map((image) => {
            const isActive =
              selectedImage.id === image.id;

            return (
              <button
                key={image.id}
                type="button"
                onClick={() =>
                  setSelectedImageId(image.id)
                }
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
    </div>
  );
}
