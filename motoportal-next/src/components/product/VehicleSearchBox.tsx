import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function VehicleSearchBox() {
  return (
    <div className="mb-8 flex flex-wrap items-end gap-3 rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-600">Tip</label>
        <Select>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Seçiniz" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tip1">Yakında</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-600">Yıl</label>
        <Select>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Seçiniz" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="yil1">Yakında</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-600">Marka</label>
        <Select>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Seçiniz" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="marka1">Yakında</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-600">Model</label>
        <Select>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Seçiniz" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="model1">Yakında</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <button
        type="button"
        className="rounded-lg bg-gray-900 px-6 py-2 text-sm font-semibold text-white"
      >
        Ara
      </button>
    </div>
  );
}