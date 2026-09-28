const COLOR_HEX_MAP: Record<string, string> = {
  beyaz: "#f5f5f5",
  gri: "#9ca3af",
  siyah: "#18181b",
  kırmızı: "#dc2626",
  mavi: "#2563eb",
  yeşil: "#16a34a",
  sarı: "#eab308",
  turuncu: "#ea580c",
  kahverengi: "#78350f",
};

// Sabit, küçük bir palet olduğu için genel bir luminance hesabı
// yerine hangi renklerin açık zemin (koyu yazı gerektiren) olduğu
// elle işaretlendi.
const LIGHT_FILL_COLOR_NAMES = new Set(["beyaz", "gri", "sarı"]);

function normalizeColorName(colorName: string): string {
  return colorName.trim().toLowerCase();
}

function resolveColorHex(normalizedName: string): string | null {
  return COLOR_HEX_MAP[normalizedName] ?? null;
}

type VariantColorPillProps = {
  colorName: string;
  isSelected: boolean;
  isAvailable: boolean;
  onSelect: () => void;
};

export default function VariantColorPill({
  colorName,
  isSelected,
  isAvailable,
  onSelect,
}: VariantColorPillProps) {
  const normalizedName = normalizeColorName(colorName);
  const hex = resolveColorHex(normalizedName);
  const textColorClass = hex
    ? LIGHT_FILL_COLOR_NAMES.has(normalizedName)
      ? "text-foreground"
      : "text-white"
    : "text-foreground";

  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={!isAvailable}
      style={hex ? { backgroundColor: hex } : undefined}
      className={`rounded-full px-4 py-1.5 text-sm font-medium shadow-sm transition ${textColorClass} ${
        hex ? "" : "bg-surface-hover"
      } ${
        isSelected
          ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
          : "border border-line"
      } ${!isAvailable ? "cursor-not-allowed opacity-40" : ""}`}
    >
      {colorName}
    </button>
  );
}
