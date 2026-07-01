import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind class names safely, de-duplicating conflicting utilities.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a large integer with locale separators (e.g. 23000000 -> "23,000,000").
 */
export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}
