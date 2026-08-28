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
      <p className="whitespace-nowrap text-lg font-semibold text-gray-700">
        Fiyat için iletişime geçin
      </p>
    );
  }

  return (
    <div className="flex flex-wrap items-baseline gap-2">
      {discountPrice && (
        <span className="whitespace-nowrap text-lg text-gray-400 line-through">
          {Number(price).toLocaleString("tr-TR")}{" "}
          {currency === "TRY" ? "₺" : currency}
        </span>
      )}

      <span className="whitespace-nowrap text-3xl font-bold text-gray-900">
        {Number(discountPrice ?? price).toLocaleString("tr-TR")}{" "}
        {currency === "TRY" ? "₺" : currency}
      </span>
    </div>
  );
}