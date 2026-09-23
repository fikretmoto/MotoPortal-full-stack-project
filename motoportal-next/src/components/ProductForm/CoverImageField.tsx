"use client";

import { useState } from "react";
import Image from "next/image";
import { Label } from "@/components/ui/label";

type CoverImageFieldProps = {
  /** Düzenleme modunda mevcut ürünün slug'ı — varsa dosya seçilir seçilmez hemen yüklenir. */
  slug?: string;
  initialImageUrl?: string | null;
  /** Yeni ürün modunda: seçilen dosyayı ProductForm'a bildirir, kaydetme sonrası yüklenir. */
  onFileSelected?: (file: File | null) => void;
};

export function CoverImageField({
  slug,
  initialImageUrl,
  onFileSelected,
}: CoverImageFieldProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initialImageUrl ?? null
  );
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setPreviewUrl(URL.createObjectURL(file));

    if (!slug) {
      onFileSelected?.(file);
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("cover_image", file);

      const response = await fetch(`/api/products/${slug}/cover-image`, {
        method: "PATCH",
        body: formData,
      });

      if (!response.ok) {
        setError("Görsel yüklenemedi, lütfen tekrar deneyin.");
        return;
      }

      const data = await response.json();
      setPreviewUrl(data.cover_image_url);
    } catch {
      setError("Görsel yüklenemedi, lütfen tekrar deneyin.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="coverImage">Kapak Görseli</Label>

      <div className="flex items-center gap-4">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border border-line bg-surface">
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt="Kapak görseli önizleme"
              fill
              className="object-cover"
              sizes="96px"
              unoptimized={previewUrl.startsWith("blob:")}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[10px] text-fg-subtle">
              Görsel yok
            </div>
          )}
        </div>

        <div className="space-y-1">
          <input
            id="coverImage"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
            className="text-sm"
          />
          {isUploading && (
            <p className="text-xs text-fg-muted">Yükleniyor...</p>
          )}
          {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}
