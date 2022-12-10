import { countBy, lines } from '../utilts.ts'

type Range = [number, number]

const containsRange = (range: Range, other: Range) => range[0] <= other[0] && range[1] >= other[1]
const containsPoint = (range: Range, point: number) => range[0] <= point && range[1] >= point
const overlap = (range: Range, other: Range) => containsPoint(range, other[0]) || containsPoint(range, other[1])

const parseLine = (line: string): [Range, Range] => line.split(',').map(parseRange) as [Range, Range]
const parseRange = (range: string): Range => range.split('-').map(Number) as Range

export const solvePart1 = (input: string) => {
  const parsed = lines(input).map(parseLine)
  return countBy(([range, other]) => containsRange(range, other) || containsRange(other, range), parsed)
}

export const solvePart2 = (input: string) => {
  const parsed = lines(input).map(parseLine)
  return countBy(([range, other]) => overlap(range, other) || overlap(other, range), parsed)
}
