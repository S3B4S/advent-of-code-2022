import fs from 'fs'

type Item = string
type Rucksack = [Item, Item]

const UPPER_CASE_CORRECTION = 38
const LOWER_CASE_CORRECTION = 96

const sum = (a: number, b: number) => a + b
const priorityChar = (char: string) => char.charCodeAt(0) - (char.toUpperCase() === char ? UPPER_CASE_CORRECTION : LOWER_CASE_CORRECTION)
const parseInputLine = (line: string): Rucksack => {
  const middle = Math.floor(line.length / 2);
  return [line.substring(0, middle), line.substring(middle, line.length)]
}

/**
 * Finds if there is a duplicate char across compartments
 * @param rucksack
 * @returns duplicate char if found, undefined if not
 */
const findDuplicate = (rucksack: Rucksack): string => {
  // We know that each rucksack has a duplicate for sure
  return rucksack[0].split('').find(c => rucksack[1].includes(c))!
}

// @TODO Fix path
const input = fs.readFileSync(__dirname + '/../day-03/input.txt', 'utf-8')
const parsed = input
  .trim()
  .split('\n')
  .map(l => priorityChar(findDuplicate(parseInputLine(l))))
  .reduce(sum)

console.log(parsed)
