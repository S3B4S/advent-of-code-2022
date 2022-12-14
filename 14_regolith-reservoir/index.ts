import { parseNumbersWithDelimiter } from '../parsing.ts'
import { monpar } from 'deps'
import { Characters } from '../utilts.ts'
const { liftAs, many, token, sentence, unpack } = monpar

interface Coordinate {
  y: number
  x: number
}

type Range = Coordinate[]

export const parseCoordinate = liftAs(
  ([x, y]: [number, number]) => ({ y, x }),
  parseNumbersWithDelimiter(',')
)

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

const moveCloser = ({ y, x }: Coordinate, { y: destY, x: destX }: Coordinate): Coordinate => {
  if (x < destX) return { y, x: x + 1, }
  if (y < destY) return { y: y + 1, x }
  if (x > destX) return { y, x: x - 1 }
  if (y > destY) return { y: y - 1, x }
  return { y, x }
}

const equal = ({ y, x }: Coordinate, { y: y2, x: x2 }: Coordinate) => y == y2 && x == x2

export const solvePart1 = (input: string) => {
  const ranges = unpack(parseInput)(input)!
  const map: string[][] = []

  for (const range of ranges) {
    let currentCoordinate = range[0]
    let destinationIndex = 1
    
    while (!equal(currentCoordinate, range.at(-1)!)) {
      while (!equal(currentCoordinate, range[destinationIndex])) {
        // Draw this wall
        if (!map[currentCoordinate.y]) map[currentCoordinate.y] = []
        map[currentCoordinate.y][currentCoordinate.x] = Characters.WhiteBlock
        currentCoordinate = moveCloser(currentCoordinate, range[destinationIndex])
      }
      
      // Draw when the coordinate has met the one they're pursuing
      if (!map[currentCoordinate.y]) map[currentCoordinate.y] = []
      map[currentCoordinate.y][currentCoordinate.x] = Characters.WhiteBlock
      destinationIndex++
    }

    // For enire map, if there is an empty spot, insert space
    for (let i = 0; i < map.length; i++) {
      if (!map[i]) map[i] = []
      for (let j = 0; j < map[i].length; j++) {
        if (!map[i][j]) map[i][j] = Characters.Space
      }
    }
  }

  return 0
}

export const solvePart2 = (input: string) => {
  return 0
}
