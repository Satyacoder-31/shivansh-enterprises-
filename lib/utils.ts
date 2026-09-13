import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number | null | undefined, currencySymbol = "₹"): string {
  if (amount === null || amount === undefined) return "Contact for Price";
  return `${currencySymbol}${amount.toLocaleString("en-IN")}`;
}
