import fs from 'fs'

type Rucksack = [string, string]

const UPPER_CASE_CORRECTION = 38
const LOWER_CASE_CORRECTION = 96

const sum = (a: number, b: number) => a + b
const priorityChar = (char: string) => char.charCodeAt(0) - (char.toUpperCase() === char ? UPPER_CASE_CORRECTION : LOWER_CASE_CORRECTION)

/**
 * Finds if there is a duplicate char across compartments
 * @param rucksack
 * @returns duplicate char if found, undefined if not
 */
const findDuplicateInRucksack = (rucksack: Rucksack): string => {
  // We know that each rucksack has a duplicate for sure
  return rucksack[0].split('').find(c => rucksack[1].includes(c))!
}

const strToObject = (str: string): Record<string, boolean> => str.split('').reduce((acc, c) => ({
  ...acc,
  [c]: true,
}), {})

const findDuplicateAmongElves = (rucksacks: string[]): string => {
  const found = [
    strToObject(rucksacks[0]), // chars found in rucksack of elf 1
    strToObject(rucksacks[1]), // chars found in rucksack of elf 2
  ]

  return rucksacks[2].split('').find(c => found[0][c] && found[1][c])!
}

const parseInputLine = (line: string): Rucksack => {
  const middle = Math.floor(line.length / 2);
  return [line.substring(0, middle), line.substring(middle, line.length)]
}

const chunksOfN = (n: number) => <T>(input: T[]): T[][] => {
  if (input.length <= n) return [input]
  return [input.slice(0, n)].concat(chunksOfN(n)(input.slice(n)));
}

const chunks3 = chunksOfN(3);

// @TODO Fix path
const input = fs.readFileSync(__dirname + '/../day-03/input.txt', 'utf-8')
const parsed = input
  .trim()
  .split('\n')

const part1 = parsed
  .map(l => priorityChar(findDuplicateInRucksack(parseInputLine(l))))
  .reduce(sum)

const part2 = chunks3(parsed)
  .map(findDuplicateAmongElves)
  .map(priorityChar)
  .reduce(sum)

console.log(part1) // 8252
console.log(part2) // 2828
