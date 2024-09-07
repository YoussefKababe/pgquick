import clsx, { ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const clsxMerge = (...args: ClassValue[]) => {
  return twMerge(clsx(args))
}
