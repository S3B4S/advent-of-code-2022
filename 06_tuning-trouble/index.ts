import fs from 'fs';
import { scanN } from '../utilts';

/**
 * Exmaple, if n = 4: "cdsaffjdsakl" -> [
 *   "cdsa",
 *   "dsaf",
 *   "saff",
 *   ....
 *   "sakl",
 * ]
 */
const scan4 = scanN(4)
const scan14 = scanN(14)

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

export const part1 = scan4(input).findIndex(uniqueCharsOnly) + 4
export const part2 = scan14(input).findIndex(uniqueCharsOnly) + 14
