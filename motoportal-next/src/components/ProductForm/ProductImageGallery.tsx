"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { ProductImage } from "@/services/products";

type ProductImageGalleryProps = {
  slug: string;
  initialImages: ProductImage[];
};

export function ProductImageGallery({
  slug,
  initialImages,
}: ProductImageGalleryProps) {
  const [images, setImages] = useState<ProductImage[]>(initialImages);
  const [isUploading, setIsUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFilesSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setError(null);
    setIsUploading(true);

    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("image", file);

        const response = await fetch(`/api/products/${slug}/images`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          setError("Bazı görseller yüklenemedi, lütfen tekrar deneyin.");
          continue;
        }

        const data: ProductImage = await response.json();
        setImages((prev) => [...prev, data]);
      }
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  async function handleDelete(imageId: number) {
    if (!window.confirm("Bu görseli silmek istediğinize emin misiniz?")) {
      return;
    }

    setError(null);
    setDeletingId(imageId);

    try {
      const response = await fetch(`/api/products/images/${imageId}`, {
        method: "DELETE",
      });

      if (!response.ok && response.status !== 204) {
        setError("Görsel silinemedi, lütfen tekrar deneyin.");
        return;
      }

      setImages((prev) => prev.filter((img) => img.id !== imageId));
    } catch {
      setError("Görsel silinemedi, lütfen tekrar deneyin.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-2">
      <Label>Galeri Görselleri</Label>

      <div className="flex flex-wrap gap-3">
        {images.map((image) => (
          <div
            key={image.id}
            className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border border-line bg-surface"
          >
            {image.image_url ? (
              <Image
                src={image.image_url}
                alt={image.alt_text || "Ürün galeri görseli"}
                fill
                className="object-cover"
                sizes="96px"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-[10px] text-fg-subtle">
                Görsel yok
              </div>
            )}

            <Button
              type="button"
              variant="destructive"
              size="icon-xs"
              className="absolute top-1 right-1"
              onClick={() => handleDelete(image.id)}
              disabled={deletingId === image.id}
            >
              <X />
            </Button>
          </div>
        ))}

        <label
          htmlFor="galleryImages"
          className="flex h-24 w-24 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-dashed border-line text-xs text-fg-muted hover:bg-surface"
        >
          {isUploading ? "Yükleniyor..." : "+ Ekle"}
        </label>
        <input
          ref={fileInputRef}
          id="galleryImages"
          type="file"
          accept="image/*"
          multiple
          onChange={handleFilesSelected}
          disabled={isUploading}
          className="hidden"
        />
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
