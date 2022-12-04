import fs from 'fs'
import { compose } from '../utilts'

type Range = [number, number]

const contains = (range: Range, other: Range) => {
  return range[0] <= other[0] && range[1] >= other[1]
}

// @ts-ignore
const parseLine = (line: string): [Range, Range] => line.split(',').map(parseRange)
// @ts-ignore
const parseRange = (range: string): Range => range.split('-').map(Number)

const input = fs.readFileSync(__dirname + '/../../day-04/input.txt', 'utf-8')
const parsed = input
  .trim()
  .split('\n')

// Use count
export const part1 = parsed
  .map(compose(
    parseLine,
  ))
  .reduce((count, rs) => {
    return (contains(rs[0], rs[1]) || contains(rs[1], rs[0]) ? 1 : 0) + count
  }, 0)
