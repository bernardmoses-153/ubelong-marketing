import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDriftColor(score: number): string {
  if (score >= 80) return "#22C55E"; // success - green
  if (score >= 60) return "#0D9488"; // primary - teal
  if (score >= 40) return "#F59E0B"; // accent - amber
  if (score >= 20) return "#EF4444"; // danger - red
  return "#EF4444"; // danger - red
}

export function getDriftLabel(score: number): string {
  if (score >= 80) return "On Track";
  if (score >= 60) return "Mild Drift";
  if (score >= 40) return "Moderate Drift";
  if (score >= 20) return "High Drift";
  return "Critical";
}

export function formatPhone(phone: string): string {
  // Remove non-digits
  const digits = phone.replace(/\D/g, "");

  // Indian phone format: +91 XXXXX XXXXX
  if (digits.length === 10) {
    return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
  }
  if (digits.length === 12 && digits.startsWith("91")) {
    return `+${digits.slice(0, 2)} ${digits.slice(2, 7)} ${digits.slice(7)}`;
  }
  return phone;
}
