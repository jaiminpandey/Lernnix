import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
/**
 * Generates a random alphanumeric string of the specified length.
 * @param length - The desired length of the random string.
 * @returns A random string composed of uppercase letters, lowercase letters, and digits.
 */
export function randomString(length: number): string {
  const characters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result: string = '';
  for (let i = 0; i < length; i++) {
    const randomIndex: number = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  return result;
}

export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  wait: number
) => {
  let timeout: NodeJS.Timeout

  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export const validateFont = (fontFamily: string): boolean => {
  try {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return false
    ctx.font = `16px ${fontFamily}`
    return ctx.font.includes(fontFamily)
  } catch (e) {
    return false
  }
}

export const calculateTextDimensions = (
  text: string,
  ctx: CanvasRenderingContext2D
) => {
  const metrics = ctx.measureText(text)
  return {
    width: metrics.width,
    height: metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent
  }
}
