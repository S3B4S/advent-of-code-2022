import fs from 'fs';
import { scanN } from '../utilts';

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

const input = fs.readFileSync(__dirname + '/../../06_tuning-trouble/input.txt', 'utf-8').trim()

const n1 = 4
export const part1 = scanN(n1)(input).findIndex(uniqueCharsOnly) + n1

const n2 = 14
export const part2 = scanN(n2)(input).findIndex(uniqueCharsOnly) + n2
