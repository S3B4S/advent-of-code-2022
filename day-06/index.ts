import fs from 'fs';

const input = fs.readFileSync(__dirname + '/../../day-06/input.txt', 'utf-8').trim()

const scanN = (n: number) => (input: string): string[] => {
  if (input.length <= n) return [input]
  return [input.slice(0, n)].concat(scanN(n)(input.slice(1)))
}

const scan4 = scanN(4)
const scan14 = scanN(14)

const uniqueString = (input: string) => {
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

console.log(scan4(input))


export const part1 = scan4(input).findIndex(uniqueString) + 4
export const part2 = scan14(input).findIndex(uniqueString) + 14
