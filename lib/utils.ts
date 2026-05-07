import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const containerClasses = {
  wide: "max-w-7xl mx-auto w-full",
  content: "max-w-6xl mx-auto w-full",
  admin: "max-w-5xl mx-auto w-full",
  narrow: "max-w-3xl mx-auto w-full",
}
