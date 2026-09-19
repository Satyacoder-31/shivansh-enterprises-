import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number | null | undefined, currencySymbol = "₹"): string {
  if (amount === null || amount === undefined) return "Contact for Price";
  return `${currencySymbol}${amount.toLocaleString("en-IN")}`;
}

export function getProductDisplayPrice(product: { price_value?: number | null; price_display?: string | null }): string {
  if (product.price_display && product.price_display.trim() !== "") {
    const trimmed = product.price_display.trim();
    // Only fall back if it is an unconfigured default "Contact for Price" while an active numeric price exists
    if (trimmed.toLowerCase() === "contact for price" && product.price_value && Number(product.price_value) > 0) {
      return formatPrice(product.price_value);
    }
    return trimmed;
  }
  return product.price_value ? formatPrice(product.price_value) : "Contact for Price";
}
