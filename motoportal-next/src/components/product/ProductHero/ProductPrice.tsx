type ProductPriceProps = {
  price: string | null;
  currency: string;
};

export default function ProductPrice({
  price,
  currency,
}: ProductPriceProps) {
  return (
    <div className="mt-8 border-y border-gray-200 py-6">
      {price ? (
        <>
          <p className="text-sm font-medium text-gray-500">
            Satış Fiyatı
          </p>

          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900">
            {Number(price).toLocaleString("tr-TR")}{" "}
            {currency === "TRY" ? "₺" : currency}
          </p>
        </>
      ) : (
        <p className="text-lg font-semibold text-gray-700">
          Fiyat için iletişime geçin
        </p>
      )}
    </div>
  );
}