"use client";

import { useEffect, useState } from "react";
import type {
  InstallmentOption,
  ProductDetail,
  ProductReview,
  SiteContent,
} from "@/services/catalog";
import {
  getInstallmentOptions,
  getProductReviews,
  getSiteContent,
} from "@/services/catalog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import ReviewForm from "./ReviewForm";

type Props = {
  product: ProductDetail;
  reviews: ProductReview[];
  isAuthenticated: boolean;
};

function getRelevantInstallments(
  options: InstallmentOption[],
  brandSlug: string,
  categorySlug: string
) {
  const brandAndCategory = options.filter(
    (o) => o.brand_slug === brandSlug && o.category_slug === categorySlug
  );
  if (brandAndCategory.length) return brandAndCategory;

  const brandOnly = options.filter(
    (o) => o.brand_slug === brandSlug && !o.category_slug
  );
  if (brandOnly.length) return brandOnly;

  const categoryOnly = options.filter(
    (o) => !o.brand_slug && o.category_slug === categorySlug
  );
  if (categoryOnly.length) return categoryOnly;

  return options.filter((o) => !o.brand_slug && !o.category_slug);
}

function formatCurrency(amount: number, currency: string) {
  const formatted = new Intl.NumberFormat("tr-TR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  return currency === "TRY" ? `${formatted} ₺` : `${formatted} ${currency}`;
}

export default function ProductCommercialTabs({
  product,
  reviews,
  isAuthenticated,
}: Props) {
  const [siteContent, setSiteContent] = useState<SiteContent | null>(null);
  const [installmentOptions, setInstallmentOptions] = useState<
    InstallmentOption[]
  >([]);
  const [reviewList, setReviewList] = useState<ProductReview[]>(reviews);

  async function refreshReviews() {
    const updated = await getProductReviews(product.slug);
    setReviewList(updated);
  }

  useEffect(() => {
    let cancelled = false;

    Promise.all([getSiteContent(), getInstallmentOptions()]).then(
      ([siteContentResult, installmentOptionsResult]) => {
        if (cancelled) return;
        setSiteContent(siteContentResult);
        setInstallmentOptions(installmentOptionsResult);
      }
    );

    return () => {
      cancelled = true;
    };
  }, []);

  const basePrice = product.discount_price ?? product.price;
  const price = basePrice ? Number(basePrice) : null;

  const relevantInstallments = installmentOptions.length
    ? getRelevantInstallments(
        installmentOptions,
        product.brand.slug,
        product.category.slug
      )
    : [];

  const hasResources = product.resources.length > 0;

  return (
    <section className="mt-10">
      <Tabs defaultValue="aciklama">
        <TabsList>
          <TabsTrigger value="aciklama">Açıklama</TabsTrigger>
          <TabsTrigger value="taksit">Taksit Tablosu</TabsTrigger>
          <TabsTrigger value="kargo">Kargo ve Teslimat</TabsTrigger>
          <TabsTrigger value="iade">İade ve Değişim</TabsTrigger>
          <TabsTrigger value="garanti">Garanti Bilgisi</TabsTrigger>
          <TabsTrigger value="takas">Takas Bilgilendirme</TabsTrigger>
          <TabsTrigger value="yorumlar">
            Yorumlar ({reviewList.length})
          </TabsTrigger>
          {hasResources && (
            <TabsTrigger value="kaynaklar">Kaynaklar/Dökümanlar</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="aciklama">
          <p className="whitespace-pre-line leading-8 text-fg-muted">
            {product.description?.trim()
              ? product.description
              : "Henüz açıklama eklenmemiş."}
          </p>
        </TabsContent>

        <TabsContent value="taksit">
          {relevantInstallments.length === 0 || price === null ? (
            <p className="text-sm text-fg-muted">
              Bu ürün için taksit seçeneği tanımlanmamış.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-line text-fg-muted">
                    <th className="py-2 pr-4 font-medium">Banka</th>
                    <th className="py-2 pr-4 font-medium">Taksit Sayısı</th>
                    <th className="py-2 pr-4 font-medium">Vade Farkı</th>
                    <th className="py-2 pr-4 font-medium">Aylık Tutar</th>
                    <th className="py-2 pr-4 font-medium">Toplam Tutar</th>
                  </tr>
                </thead>
                <tbody>
                  {relevantInstallments.map((option) => {
                    const rate = Number(option.rate);
                    const total = price * (1 + rate / 100);
                    const monthly = total / option.installment_count;

                    return (
                      <tr key={option.id} className="border-b border-line">
                        <td className="py-2 pr-4">{option.bank_name}</td>
                        <td className="py-2 pr-4">
                          {option.installment_count}
                        </td>
                        <td className="py-2 pr-4">%{rate}</td>
                        <td className="py-2 pr-4">
                          {formatCurrency(monthly, product.currency)}
                        </td>
                        <td className="py-2 pr-4">
                          {formatCurrency(total, product.currency)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="kargo">
          <p className="whitespace-pre-line leading-8 text-fg-muted">
            {siteContent?.kargo_teslimat || "-"}
          </p>
        </TabsContent>

        <TabsContent value="iade">
          <p className="whitespace-pre-line leading-8 text-fg-muted">
            {siteContent?.iade_degisim || "-"}
          </p>
        </TabsContent>

        <TabsContent value="garanti">
          <p className="whitespace-pre-line leading-8 text-fg-muted">
            {siteContent?.garanti_bilgisi || "-"}
          </p>
        </TabsContent>

        <TabsContent value="takas">
          <p className="whitespace-pre-line leading-8 text-fg-muted">
            Takas teklifleri için ürün sahibiyle iletişime geçebilirsiniz.
            Detaylı takas bilgilendirme formu yakında eklenecektir.
          </p>
        </TabsContent>

        <TabsContent value="yorumlar">
          <div className="flex flex-col gap-6">
            <ReviewForm
              slug={product.slug}
              productId={product.id}
              isAuthenticated={isAuthenticated}
              onSubmitted={refreshReviews}
            />

            <div className="flex flex-col gap-4 border-t border-line pt-4">
              {reviewList.length === 0 ? (
                <p className="text-sm text-fg-muted">
                  Bu ürün için henüz onaylanmış yorum yok.
                </p>
              ) : (
                reviewList.map((review) => (
                  <div
                    key={review.id}
                    className="border-b border-line pb-4 last:border-b-0"
                  >
                    <div className="mb-1 flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <span
                          key={index}
                          className={
                            index < review.rating
                              ? "text-amber-500"
                              : "text-fg-subtle"
                          }
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <p className="text-sm text-foreground">
                      {review.comment}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </TabsContent>

        {hasResources && (
          <TabsContent value="kaynaklar">
            <ul className="flex flex-col gap-2">
              {product.resources.map((resource) => (
                <li key={resource.id}>
                  <a
                    href={resource.file_url ?? undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline underline-offset-2 hover:text-primary-hover"
                  >
                    {resource.title}
                  </a>
                </li>
              ))}
            </ul>
          </TabsContent>
        )}
      </Tabs>
    </section>
  );
}
