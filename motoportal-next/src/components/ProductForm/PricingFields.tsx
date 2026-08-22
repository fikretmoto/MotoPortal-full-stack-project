"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type PricingValues = {
  price: string;
  discountPrice: string;
  stockStatus: string;
};

type PricingFieldsProps = {
  values: PricingValues;
  onChange: (values: PricingValues) => void;
};

const STOCK_STATUS_OPTIONS = [
  { value: "in_stock", label: "Stokta" },
  { value: "out_of_stock", label: "Stokta Yok" },
  { value: "pre_order", label: "Ön Sipariş" },
  { value: "on_request", label: "Sipariş Üzerine" },
];

export function PricingFields({ values, onChange }: PricingFieldsProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Fiyat</Label>
          <Input
            id="price"
            type="number"
            value={values.price}
            onChange={(e) => onChange({ ...values, price: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="discountPrice">İndirimli Fiyat</Label>
          <Input
            id="discountPrice"
            type="number"
            value={values.discountPrice}
            onChange={(e) => onChange({ ...values, discountPrice: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="stockStatus">Stok Durumu</Label>
        <Select
          value={values.stockStatus}
          onValueChange={(stockStatus) => onChange({ ...values, stockStatus })}
        >
          <SelectTrigger id="stockStatus" className="w-full">
            <SelectValue placeholder="Seçin" />
          </SelectTrigger>
          <SelectContent>
            {STOCK_STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}