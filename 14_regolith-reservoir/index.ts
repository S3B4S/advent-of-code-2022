import { parseNumbersWithDelimiter } from '../parsing.ts'
import { monpar } from 'deps'
import { Characters } from '../utilts.ts'
const { liftAs, many, token, sentence, unpack } = monpar

interface Coordinate {
  y: number
  x: number
}

type Range = Coordinate[]

const MOVE_LEFT = 0

export const parseCoordinate = liftAs(
  ([x, y]: [number, number]) => ({ y, x: x - MOVE_LEFT }),
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

const SAND_DISPENSER_COORDINATE: Coordinate = {
  x: 500 - MOVE_LEFT,
  y: 0,
}

export const solvePart1 = (input: string) => {
  const ranges = unpack(parseInput)(input)!
  const map: string[][] = []

  let maxAmountColumns = 0

  for (const range of ranges) {
    let currentCoordinate = range[0]
    let destinationIndex = 1

    while (destinationIndex < range.length) {
      while (!equal(currentCoordinate, range[destinationIndex])) {
        maxAmountColumns = Math.max(maxAmountColumns, currentCoordinate.x + 1)

        // Draw this wall
        if (!map[currentCoordinate.y]) map[currentCoordinate.y] = []
        map[currentCoordinate.y][currentCoordinate.x] = Characters.WhiteRetroBlock
        currentCoordinate = moveCloser(currentCoordinate, range[destinationIndex])
      }
      
      // Draw when the coordinate has met the one they're pursuing
      if (!map[currentCoordinate.y]) map[currentCoordinate.y] = []
      map[currentCoordinate.y][currentCoordinate.x] = Characters.WhiteRetroBlock
      destinationIndex++
    }
  }

  // For entire map, if there is an empty spot, insert space
  for (let row = 0; row < map.length; row++) {
    if (!map[row]) map[row] = []
    for (let column = 0; column < maxAmountColumns; column++) {
      if (!map[row][column]) map[row][column] = Characters.Dot
    }
  }

  // Start dispensing sand
  let sandLocation = SAND_DISPENSER_COORDINATE
  let sandIstraversing = true
  let amountSand = 0

  map[SAND_DISPENSER_COORDINATE.y][SAND_DISPENSER_COORDINATE.x] = Characters.Plus
  const freeSpaces = [Characters.Dot, Characters.Space, Characters.Star]

  while(true) {
    while (sandIstraversing) {
      // If the next row is undefined, we've reached abyss
      if (map[sandLocation.y + 1] === undefined) return amountSand
      
      // We've also reached abyss if the right column is undefined, & bot + left are full
      if (map[sandLocation.y][sandLocation.x + 1] === undefined
        && !freeSpaces.includes(map[sandLocation.y + 1][sandLocation.x])
        && !freeSpaces.includes(map[sandLocation.y + 1][sandLocation.x - 1])
      ) {
        return amountSand
      }

      // Check directly beneath
      if (freeSpaces.includes(map[sandLocation.y + 1][sandLocation.x])) {
        sandLocation = { ...sandLocation, y: sandLocation.y + 1 }
        map[sandLocation.y][sandLocation.x] = Characters.Star
        continue
      // Check to the left
      } else if (freeSpaces.includes(map[sandLocation.y + 1][sandLocation.x - 1])) {
        sandLocation = { x: sandLocation.x - 1, y: sandLocation.y + 1 }
        map[sandLocation.y][sandLocation.x] = Characters.Star
        continue
      // Check to the right
      } else if (freeSpaces.includes(map[sandLocation.y + 1][sandLocation.x + 1])) {
        sandLocation = { x: sandLocation.x + 1, y: sandLocation.y + 1 }
        map[sandLocation.y][sandLocation.x] = Characters.Star
        continue
      }

      // No options to traverse further, save locaiton and reset
      map[sandLocation.y][sandLocation.x] = Characters.HashTag
      sandIstraversing = false
    }
    sandLocation = SAND_DISPENSER_COORDINATE
    sandIstraversing = true
    amountSand++
  }
}

// Goes up to 100s
const surroundByCoordinates = (map: any[][]) => [
  ['   ', ...Array.from({ length: map[0].length }).map((_, i) => String(i).padStart(3, '0')[0])], // 100s
  ['   ', ...Array.from({ length: map[0].length }).map((_, i) => String(i).padStart(3, '0')[1])], // 10s
  ['   ', ...Array.from({ length: map[0].length }).map((_, i) => String(i).padStart(3, '0')[2])], // 1s
  ...map.map((row, i) => [String(i).padStart(3, '0'), ...row, i])
]

const stringifyMap = (map: any[][]) => map.map(row => row.join('')).join('\n')

export const solvePart2 = (input: string) => {
  const ranges = unpack(parseInput)(input)!
  const map: string[][] = []

  let maxAmountColumns = 0

  for (const range of ranges) {
    let currentCoordinate = range[0]
    let destinationIndex = 1

    while (destinationIndex < range.length) {
      while (!equal(currentCoordinate, range[destinationIndex])) {
        maxAmountColumns = Math.max(maxAmountColumns, currentCoordinate.x + 1)

        // Draw this wall
        if (!map[currentCoordinate.y]) map[currentCoordinate.y] = []
        map[currentCoordinate.y][currentCoordinate.x] = Characters.WhiteRetroBlock
        currentCoordinate = moveCloser(currentCoordinate, range[destinationIndex])
      }
      
      // Draw when the coordinate has met the one they're pursuing
      if (!map[currentCoordinate.y]) map[currentCoordinate.y] = []
      map[currentCoordinate.y][currentCoordinate.x] = Characters.WhiteRetroBlock
      destinationIndex++
    }
  }

  // For entire map, if there is an empty spot, insert space
  for (let row = 0; row < map.length; row++) {
    if (!map[row]) map[row] = []
    for (let column = 0; column < maxAmountColumns; column++) {
      if (!map[row][column]) map[row][column] = Characters.Dot
    }
  }

  // Now add another row that's entirely empty
  map[map.length] = Array.from({ length: maxAmountColumns }).map(() => Characters.Dot)

  // And then add another row that's the floor
  map[map.length] = Array.from({ length: maxAmountColumns }).map(() => Characters.WhiteRetroBlock)

  // Start dispensing sand
  let sandLocation = SAND_DISPENSER_COORDINATE
  let sandIstraversing = true
  let amountSand = 0

  map[SAND_DISPENSER_COORDINATE.y][SAND_DISPENSER_COORDINATE.x] = Characters.Plus
  const freeSpaces = [Characters.Dot, Characters.Space, Characters.Star]

  const columnToFillAbyss = Array.from({ length: map.length }).map(() => Characters.Dot)
  columnToFillAbyss[columnToFillAbyss.length - 1] = Characters.WhiteRetroBlock

  while(true) {
    while (sandIstraversing) {
      // Check directly beneath
      if (freeSpaces.includes(map[sandLocation.y + 1][sandLocation.x])) {
        sandLocation = { ...sandLocation, y: sandLocation.y + 1 }
        map[sandLocation.y][sandLocation.x] = Characters.Star
        continue
      }

      // Check to the left
      if (freeSpaces.includes(map[sandLocation.y + 1][sandLocation.x - 1])) {
        sandLocation = { x: sandLocation.x - 1, y: sandLocation.y + 1 }
        map[sandLocation.y][sandLocation.x] = Characters.Star
        continue
      }

      // Check to the right
      // If the right has an abyss, we need to add another column
      if (map[sandLocation.y][sandLocation.x + 1] === undefined) {
        for (let row = 0; row < map.length; row++) {
          map[row] = [...map[row], columnToFillAbyss[row]]
        }
      }
      
      if (freeSpaces.includes(map[sandLocation.y + 1][sandLocation.x + 1])) {
        sandLocation = { x: sandLocation.x + 1, y: sandLocation.y + 1 }
        map[sandLocation.y][sandLocation.x] = Characters.Star
        continue
      }

      // Once the sand can't go any further, and we are at the sand dispenser location, we end the iterations
      if (equal(sandLocation, SAND_DISPENSER_COORDINATE)) {
        return amountSand + 1
      }

      // No options to traverse further, save locaiton and reset
      map[sandLocation.y][sandLocation.x] = Characters.HashTag
      sandIstraversing = false
    }
    sandLocation = SAND_DISPENSER_COORDINATE
    sandIstraversing = true
    amountSand++
  }
}
