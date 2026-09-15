type ProductPriceProps = {
  price: string | null;
  discountPrice?: string | null;
  currency: string;
};

export default function ProductPrice({
  price,
  discountPrice,
  currency,
}: ProductPriceProps) {
  if (!price) {
    return (
      <p className="whitespace-nowrap text-lg font-semibold text-fg-muted">
        Fiyat için iletişime geçin
      </p>
    );
  }

  return (
    <div className="flex flex-wrap items-baseline gap-2">
      {discountPrice && (
        <span className="whitespace-nowrap text-lg text-fg-subtle line-through">
          {Number(price).toLocaleString("tr-TR")}{" "}
          {currency === "TRY" ? "₺" : currency}
        </span>
      )}

      <span className="whitespace-nowrap text-3xl font-bold text-foreground">
        {Number(discountPrice ?? price).toLocaleString("tr-TR")}{" "}
        {currency === "TRY" ? "₺" : currency}
      </span>
    </div>
  );
}