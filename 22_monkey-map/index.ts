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

const move2 = (board: Board, start: Coordinate, dir: Direction, amount: number) => {
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

export const solvePart2 = (input: string, startingPosition: Coordinate) => {
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
    
    const { start: newStart } = move2(board, startingPosition, currentDirection, amountToMove)
    startingPosition = newStart
  }


  return calcScore(startingPosition, currentDirection)
}
