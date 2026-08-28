import { CircleCheck, CircleX } from "lucide-react";

import { Badge } from "@/components/ui/badge";

type ProductStockProps = {
  stockStatus: string;
};

export default function ProductStock({
  stockStatus,
}: ProductStockProps) {
  const isInStock = stockStatus === "in_stock";

  return (
    <Badge variant="secondary">
      {isInStock ? (
        <CircleCheck className="text-green-600" />
      ) : (
        <CircleX className="text-red-600" />
      )}
      {isInStock ? "Stokta" : "Stokta Yok"}
    </Badge>
  );
}