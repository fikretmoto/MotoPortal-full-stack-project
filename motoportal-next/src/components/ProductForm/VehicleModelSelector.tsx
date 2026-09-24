"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import type { VehicleModel } from "@/services/catalog";

type VehicleModelSelectorProps = {
  vehicleModels: VehicleModel[];
  value: number | null;
  onChange: (vehicleModelId: number | null) => void;
};

export function VehicleModelSelector({
  vehicleModels,
  value,
  onChange,
}: VehicleModelSelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="vehicleModel">Araç Modeli</Label>
      <Select
        value={value ? String(value) : undefined}
        onValueChange={(newValue) => onChange(Number(newValue))}
      >
        <SelectTrigger id="vehicleModel" className="w-full">
          <SelectValue placeholder="Bir araç modeli seçin" />
        </SelectTrigger>
        <SelectContent>
          {vehicleModels.map((vehicleModel) => (
            <SelectItem key={vehicleModel.id} value={String(vehicleModel.id)}>
              {vehicleModel.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
