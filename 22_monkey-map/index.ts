import { parseNumber } from '../parsing.ts'
import { Characters, range } from 'utils'

const C = {
  OpenSpace: Characters.Dot,
  Wall: Characters.HashTag,
  Void: Characters.Space,
  Start: "S",
}

export interface Coordinate {
  y: number,
  x: number,
}

type ValueOf<T> = T[keyof T];

/**
 * m x n board
 * Access by y / row first, then by x / column
 */
class Board {
  board: ValueOf<typeof C>[][]

  constructor(boardStr: string) {
    this.board = boardStr.split('\n').map(l => l.split(''))
  }

  get(c: Coordinate) {
    return this.board[c.y] && this.board[c.y][c.x]
  }

  amountRows() {
    return this.board.length
  }

  amountColumns() {
    return this.board[0].length
  }

  toString() {
    return this.board.map(l => l.join('')).join('\n')
  }
}

export enum Direction { East, South, West, North }
// type Board = string[][] // select by rows (y) first, then columns (x)
type Rotation = "R" | "L"

const directionDrawing = (dir: Direction) => {
  switch(dir) {
    case Direction.North:
      return "^"
    case Direction.East:
      return ">"
    case Direction.South:
      return "v"
    case Direction.West:
      return "<"
  }
}

const rotate = (direction: Direction, rotation: Rotation) => {
  if (rotation === "L") {
    return {
      [Direction.North]: Direction.West,
      [Direction.East]: Direction.North,
      [Direction.South]: Direction.East,
      [Direction.West]: Direction.South,
    }[direction]
  }

  // Else it's "R"
  return {
    [Direction.North]: Direction.East,
    [Direction.East]: Direction.South,
    [Direction.South]: Direction.West,
    [Direction.West]: Direction.North,
  }[direction]
}

const step = (start: Coordinate, dir: Direction) => {
  switch (dir) {
    case Direction.North:
      return { y: start.y - 1, x: start.x }
    case Direction.East:
      return { y: start.y, x: start.x + 1 }
    case Direction.South:
      return { y: start.y + 1, x: start.x }
    case Direction.West:
      return { y: start.y, x: start.x - 1 }
  }
}

const isRotation = (char: string): char is Rotation => ["R", "L"].includes(char)

export const calcScore = (c: Coordinate, dir: Direction) => (c.y + 1) * 1000 + (c.x + 1) * 4 + dir

const move = (board: Board, start: Coordinate, dir: Direction, amount: number) => {
  const amountRows = board.amountRows()
  const amountColumns = board.amountColumns()

  for (const _ of range(0, amount)) {
    // Look ahead a move
    // If it is a wall, stop moving and return
    const ahead = step(start, dir)

    if (board.get(ahead) === C.Wall)
      return { board, start }
    
    if (board.get(ahead) === C.OpenSpace) {
      start = ahead
      continue
    }

    // The only remaining option is the tile being void
    let subAhead = ahead
    // This keeps iterating, including wrapping around
    // If a wall is found after the void, return the coords
    // that were still on an open tile. If it is open space after
    // void, then set ahead to those coords and then continue iterating
    // from there
    let flag = true
    while(flag) {
      subAhead = step(subAhead, dir)
      // If stepping out of bounds, wrap around
      if (subAhead.x < 0) subAhead.x = amountColumns - 1
      if (subAhead.y < 0) subAhead.y = amountRows - 1
      if (subAhead.x >= amountColumns) subAhead.x = 0
      if (subAhead.y >= amountRows) subAhead.y = 0
      const tile = board.get(subAhead)
      
      switch(tile) {
        case C.Wall:
          return { start, board }
        case C.OpenSpace:
          start = subAhead
          flag = false
          break
        // If it is void, just start next iteration
        // to keep looking
      }
    }
  }
  return { board, start }
}

export const solvePart1 = (input: string, startingPosition: Coordinate) => {
  let [boardStr, instructions] = input.split('\n\n')
  instructions = instructions.trim()

  const board = new Board(boardStr)

  let currentDirection: Direction = Direction.East
  
  while (instructions.length > 0) {
    // Rotate current direction
    if (isRotation(instructions[0])) {
      currentDirection = rotate(currentDirection, instructions[0])
      instructions = instructions.slice(1)
      continue
    }

    const [[amountToMove, remainder]] = parseNumber(instructions)
    instructions = remainder
    
    const { start: newStart } = move(board, startingPosition, currentDirection, amountToMove)
    startingPosition = newStart
  }


  return calcScore(startingPosition, currentDirection)
}

/**
 * Solves part 1, but you can indicate the starting position on the map with a S
 * @param input the input as outlined in the puzzle
 * @returns solution of part 1
 */
export const solvePart1StartMarker = (input: string) => {
  let [boardStr, instructions] = input.split('\n\n')
  instructions = instructions.trim()

  const board = new Board(boardStr)
  const rowIndex = board.board.findIndex(row => row.includes(C.Start))
  const columnIndex = board.board[rowIndex].findIndex(cell => cell === C.Start)

  return solvePart1(input.replace(C.Start, C.OpenSpace), { y: rowIndex, x: columnIndex })
}

export type DiceBorder = { from: [Coordinate, Coordinate, Direction, string], to: [Coordinate, Coordinate, Direction] }

/**
 * Range can be only 1 dimensional, both ends inclusive
 * @param range
 * @param c 
 */
export const onRange = (range: [Coordinate, Coordinate], c: Coordinate) => {
  if (range[0].x === range[1].x) {
    if (range[0].x !== c.x) return false

    // Check y range
    const lower = Math.min(range[0].y, range[1].y)
    const higher = Math.max(range[0].y, range[1].y)
    return lower <= c.y && c.y <= higher
  }

  if (range[0].y !== c.y) return false

  // Check x range
  const lower = Math.min(range[0].x, range[1].x)
  const higher = Math.max(range[0].x, range[1].x)
  return lower <= c.x && c.x <= higher
}

export const equalCoordinates = (a: Coordinate, b: Coordinate) => a.x === b.x && a.y === b.y

export const takePortal = (coordinate: Coordinate, dir: Direction, portalJumps: PortalJumps[]) => {
  const portal = portalJumps.find(({ blue }) => blue.coords.some(c => equalCoordinates(c, coordinate)) && blue.direction === dir)

  // No portal found, so just carry on along on these coordinates
  if (!portal) return {coordinate, direction: dir}

  // Portal found, make the transition
  const portalIndex = portal.blue.coords.findIndex(c => equalCoordinates(c, coordinate))
  const goingTo = portal.orange.coords[portalIndex]
  return { coordinate: goingTo, direction: portal.orange.direction }
}

const moveAcrossDice = (board: Board, start: Coordinate, dir: Direction, amount: number, portalJumps: PortalJumps[]) => {
  for (const _ of range(0, amount)) {
    // Look ahead a move
    // If it is a wall, stop moving and return
    let ahead = step(start, dir)

    // Take portal if needed
    const { coordinate, direction } = takePortal(ahead, dir, portalJumps)
    ahead = coordinate
    const tempOldDir = dir
    dir = direction

    if (board.get(ahead) === C.Wall)
      return { board, start, direction: tempOldDir }
    
    if (board.get(ahead) === C.OpenSpace) {
      start = ahead
      continue
    }
  }
  return { board, start, direction: dir }
}

export const solvePart2 = (input: string, startingPosition: Coordinate, portalJumps: PortalJumps[]) => {
  let [boardStr, instructions] = input.split('\n\n')
  instructions = instructions.trim()

  const board = new Board(boardStr)

  let currentDirection: Direction = Direction.East
  
  while (instructions.length > 0) {
    // Rotate current direction
    if (isRotation(instructions[0])) {
      currentDirection = rotate(currentDirection, instructions[0])
      instructions = instructions.slice(1)
      continue
    }

    const [[amountToMove, remainder]] = parseNumber(instructions)
    instructions = remainder
    
    const { start: newStart, direction } = moveAcrossDice(board, startingPosition, currentDirection, amountToMove, portalJumps)

    startingPosition = newStart
    currentDirection = direction
  }

  return calcScore(startingPosition, currentDirection)
}

/**
 * Solves part 2, but you can indicate the starting position on the map with a S
 * @param input the input as outlined in the puzzle
 * @returns solution of part 1
 */
export const solvePart2StartMarker = (input: string, portalJumps: PortalJumps[]) => {
  let [boardStr, instructions] = input.split('\n\n')
  instructions = instructions.trim()

  const board = new Board(boardStr)
  const rowIndex = board.board.findIndex(row => row.includes(C.Start))
  const columnIndex = board.board[rowIndex].findIndex(cell => cell === C.Start)

  return solvePart2(input.replace(C.Start, C.OpenSpace), { y: rowIndex, x: columnIndex }, portalJumps)
}

/**
 * A quadrant holds the most northwest coordinate as the anchor coordinate
 * The width & height + coordinate are all inclusive
 */
export interface Quadrant extends Coordinate {
  id: number
  width: number
  height: number
}

/**
 * A portal jumps from blue to orange
 */
export interface PortalJumps {
  blue: {
    coords: Coordinate[],
    direction: Direction,
  },
  orange: {
    coords: Coordinate[],
    direction: Direction,
  }
}

/**
 * Generates an outer border (just lying outside of the quadrant)
 * @param q The quadrant to generate a border of coordinates for
 * @param dir The side of the quadrant, representing the border
 * @param isReverse By default the border is top to bottom or left to right, set this to true to reverse
 * @returns 
 */
export const outerBorder = (q: Quadrant, dir: Direction, isReverse = false) => {
  let res
  
  switch (dir) {
    case Direction.North:
      res = Array.from({ length: q.width }).map((_, i) => ({ y: q.y - 1, x: i + q.x }))
      break
    case Direction.East:
      res = Array.from({ length: q.height }).map((_, i) => ({ y: i + q.y, x: q.x + q.width }))
      break
    case Direction.South:
      res = Array.from({ length: q.width }).map((_, i) => ({ y: q.y + q.height, x: i + q.x }))
      break
    case Direction.West:
      res = Array.from({ length: q.height }).map((_, i) => ({ y: i + q.y, x: q.x - 1 }))
      break
  }

  return isReverse ? res.reverse() : res
}

/**
 * Generates an inner border (the edge of the quadrant)
 * @param q The quadrant to generate a border of coordinates for
 * @param dir The side of the quadrant, representing the border
 * @param isReverse By default the border is top to bottom or left to right, set this to true to reverse
 * @returns 
 */
export const innerBorder = (q: Quadrant, dir: Direction, isReverse = false) => {
  let res
  
  switch (dir) {
    case Direction.North:
      res = Array.from({ length: q.width }).map((_, i) => ({ y: q.y, x: i + q.x }))
      break
    case Direction.East:
      res = Array.from({ length: q.height }).map((_, i) => ({ y: i + q.y, x: q.x + q.width - 1 }))
      break
    case Direction.South:
      res = Array.from({ length: q.width }).map((_, i) => ({ y: q.y + q.height - 1, x: i + q.x }))
      break
    case Direction.West:
      res = Array.from({ length: q.height }).map((_, i) => ({ y: i + q.y, x: q.x }))
      break
  }

  return isReverse ? res.reverse() : res
}

export const leavesAt = (quadrant: Quadrant, direction: Direction): PortalJumps['blue'] => ({
  coords: outerBorder(quadrant, direction),
  direction: direction,
})

export const arrivesAt = (quadrant: Quadrant, direction: Direction, reverse = false): PortalJumps['orange'] => ({
  coords: innerBorder(quadrant, direction, reverse),
  direction: opposite(direction),
})

export const opposite = (direction: Direction) => {
  switch (direction) {
    case Direction.North:
      return Direction.South
    case Direction.East:
      return Direction.West
    case Direction.South:
      return Direction.North
    case Direction.West:
      return Direction.East
  }
}
