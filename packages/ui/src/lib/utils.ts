import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge class names, letting a caller's utility win over the component's own.
 * This is what makes `className` a real escape hatch instead of a coin toss:
 * `<Button className="rounded-full" />` reliably beats the component's
 * `rounded-md`, because tailwind-merge drops the losing member of a conflicting
 * pair rather than emitting both and hoping about source order.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
