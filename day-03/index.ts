import fs from 'fs'
import { chunksOfN, compose, sum } from '../utilts'

type Rucksack = [string, string]

const UPPER_CASE_CORRECTION = 38
const LOWER_CASE_CORRECTION = 96

const priorityChar = (char: string) => char.charCodeAt(0) - (char.toUpperCase() === char ? UPPER_CASE_CORRECTION : LOWER_CASE_CORRECTION)

const strToObject = (str: string): Record<string, boolean> => str.split('').reduce((acc, c) => ({
  ...acc,
  [c]: true,
}), {})

/**
 * Finds if there is a duplicate char across compartments
 * @param rucksack
 * @returns duplicate char if found, undefined if not
 */
const findDuplicateInRucksack = (rucksack: Rucksack): string => {
  // We know that each rucksack has a duplicate for sure
  return rucksack[0].split('').find(c => rucksack[1].includes(c))!
}

/**
 * Finds the character that's present in all strings.
 * Assumes this duplicated character is always present.
 * @param rucksacks 
 * @returns character
 */
const charInAll = (rucksacks: string[]): string => {
  const found = rucksacks.slice(0, rucksacks.length - 2).map(strToObject)
  return rucksacks[rucksacks.length - 1].split('').find(c => found.every(r => r[c]))!
}

const parseInputLine = (line: string): Rucksack => {
  const middle = Math.floor(line.length / 2);
  return [line.substring(0, middle), line.substring(middle, line.length)]
}

/**
 * Example: chunks3([1, 2, 3, 4, 5, 6, 7]) -> [[1, 2, 3],  [4, 5, 6], [7]]
 */
const chunks3 = chunksOfN(3);

// @TODO Fix path
const input = fs.readFileSync(__dirname + '/../../day-03/input.txt', 'utf-8')
const parsed = input
  .trim()
  .split('\n')

export const part1 = parsed
  .map(compose(
    priorityChar,
    findDuplicateInRucksack,
    parseInputLine,
  ))
  .reduce(sum)

export const part2 = chunks3(parsed)
  .map(compose(
    priorityChar,
    charInAll,
  ))
  .reduce(sum)
