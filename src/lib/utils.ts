import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { parseAsArrayOf, parseAsString } from 'nuqs';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const prefectureParser = parseAsArrayOf(parseAsString).withDefault([
  '1',
]);
