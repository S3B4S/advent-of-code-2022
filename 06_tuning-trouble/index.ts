import { sliding } from '../utilts.ts'
import { pipe } from "deps"

const uniqueCharsOnly = (input: string) => {
  const found: Record<string, boolean> = {}
  for (const char of input.split('')) {
    if (found[char]) {
      return false
    } else {
      found[char] = true
    }
  }
  return true
}

export const solve = (input: string, windowSize: number) => pipe(
  input.trim(),
  sliding(windowSize),
  windows => windows.findIndex(uniqueCharsOnly),
  index => index + windowSize
)
