type ProductStockProps = {
  stockStatus: string;
};

export default function ProductStock({
  stockStatus,
}: ProductStockProps) {
  const isInStock = stockStatus === "in_stock";

  return (
    <div className="mt-6 flex items-center gap-3">
      <span
        className={`h-3 w-3 rounded-full ${
          isInStock ? "bg-green-500" : "bg-red-500"
        }`}
      />

      <span className="text-sm font-medium text-gray-700">
        {isInStock ? "Stokta" : "Stokta Yok"}
      </span>
    </div>
  );
}