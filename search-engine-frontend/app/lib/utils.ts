import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDuration(ptDuration: string): string {
  const match = ptDuration.match(/PT(\d+H)?(\d+M)?/);
  if (!match) return ptDuration;
  
  const hours = match[1] ? match[1].replace('H', 'h') : '';
  const minutes = match[2] ? match[2].replace('M', 'm') : '';
  
  return `${hours} ${minutes}`.trim();
}

export function formatTime(dateString: string): string {
  return format(parseISO(dateString), 'HH:mm');
}

export function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

export function debounce<T extends (...args: never[]) => void>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
