import fs from 'fs'
import { compose, countBy } from '../utilts'

type Range = [number, number]

const containsRange = (range: Range, other: Range) => range[0] <= other[0] && range[1] >= other[1]
const containsPoint = (range: Range, point: number) => range[0] <= point && range[1] >= point
const overlap = (range: Range, other: Range) => containsPoint(range, other[0]) || containsPoint(range, other[1])

// @TODO resolve through other means instead of `as`?
const parseLine = (line: string): [Range, Range] => line.split(',').map(parseRange) as [Range, Range]
const parseRange = (range: string): Range => range.split('-').map(Number) as Range

const input = fs.readFileSync(__dirname + '/../../04_camp-cleanup/input.txt', 'utf-8')
const parsed = input
  .trim()
  .split('\n')
  .map(compose(
    parseLine,
  ))

export const part1 = countBy(([range, other]) => containsRange(range, other) || containsRange(other, range), parsed)
export const part2 = countBy(([range, other]) => overlap(range, other) || overlap(other, range), parsed)
