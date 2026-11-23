export const TABLE_LINE_MODES = ["off", "rows", "grid"] as const;

export type TableLineMode = (typeof TABLE_LINE_MODES)[number];

export const TABLE_LINE_COLOR_PRESETS = [
  { id: "default", label: "Default", value: null, swatch: "#c9c3b8" },
  { id: "soft", label: "Soft", value: "#e6e1d8", swatch: "#e6e1d8" },
  { id: "stone", label: "Stone", value: "#8a847a", swatch: "#8a847a" },
  { id: "ink", label: "Ink", value: "#0a0a0a", swatch: "#0a0a0a" },
  { id: "accent", label: "Accent", value: "#c7253e", swatch: "#c7253e" },
] as const;

const HEX_COLOR = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

export function normalizeTableLines(value: unknown): TableLineMode | null {
  if (value === "off" || value === "rows" || value === "grid") return value;
  return null;
}

export function normalizeTableLineColor(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const color = value.trim();
  return HEX_COLOR.test(color) ? color.toLowerCase() : null;
}
