import { type ClassValue, clsx } from "clsx"
import { parseAsArrayOf, parseAsString } from "nuqs"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const prefectureParser = parseAsArrayOf(parseAsString).withDefault(["1"])
