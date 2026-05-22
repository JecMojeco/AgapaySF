import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

/**
 * Safely formats a date string (YYYY-MM-DD) to MM/DD/YYYY without timezone shifting.
 * Handles both raw date strings and full ISO strings.
 */
export function formatDate(dateStr) {
  if (!dateStr) return "-";
  
  // If it's a full ISO string (e.g. from a TIMESTAMP), take the date part
  const datePart = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr;
  
  // Split by hyphen to avoid new Date() parsing which shifts timezones
  const parts = datePart.split('-');
  if (parts.length !== 3) return dateStr;
  
  const [year, month, day] = parts;
  return `${month}/${day}/${year}`;
}
