import { sliding } from '../utilts.ts'

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

const input = Deno.readTextFileSync('./06_tuning-trouble/input.txt').trim()

const n1 = 4
export const part1 = sliding(n1)(input).findIndex(uniqueCharsOnly) + n1

const n2 = 14
export const part2 = sliding(n2)(input).findIndex(uniqueCharsOnly) + n2
