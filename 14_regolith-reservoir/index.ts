import { parseNumbersWithDelimiter } from '../parsing.ts'
import { monpar } from 'deps'
import { Coordinate } from 'utils'
const { liftAs, many, token, sentence, unpack } = monpar

type Range = Coordinate[]

export const parseCoordinate = parseNumbersWithDelimiter(',')

export const parseLine = liftAs(
  (numbers: number[][]) => (number: number[]) => numbers.concat([number]),
  many(liftAs(
    (numbers: number[]) => () => numbers,
    parseCoordinate,
    sentence(" -> ")
  )),
  token(parseCoordinate),
)

export const parseInput = liftAs<Range[]>(
  (ranges: number[][][]) => ranges,
  token(many(parseLine)),
)

export const solvePart1 = (input: string) => {
  const ranges = unpack(parseInput)(input)!
  ranges.forEach(r => console.log(r))

  return 0
}

export const solvePart2 = (input: string) => {
  return 0
}
