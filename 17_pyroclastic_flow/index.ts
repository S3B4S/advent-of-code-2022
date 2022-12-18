import { addLists, Characters, range } from "../utilts.ts"

export enum Move { Left = "L", Right = "R", Up = "U" }
export enum Shape { HorizontalLine, Plus, MirroredL, VerticalLine, Square }

export const C = {
  Wall: Characters.WhiteRetroBlock,
  Open: Characters.Dot,
  Move: Characters.At,
}

// Y coordinate goes positive going south
// X coordinate goes positive going east
// This means that falling "down" as implied in the puzzle
// is actually falling up in my solution. I did this to keep
// using `.push` O(1) instead of `.shift` O(n) considering the array
// could get pretty large

// It would be possible to also map which coordinates to check
// depending on going right or left (as we don't need to check all)
// For example, for the square we only need to check the right wall when going right
type Coordinate = [number /* Y */, number /* X */]
const coordinates: Record<Shape, Coordinate[]> = {
  [Shape.HorizontalLine]: [
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
  ],
  [Shape.Plus]: [
    [0, 1],
    [-1, 0],
    [-1, 1],
    [-1, 2],
    [-2, 1],
  ],
  [Shape.MirroredL]: [
    [0, 2],
    [-1, 2],
    [-2, 2],
    [-2, 1],
    [-2, 0],
  ],
  [Shape.VerticalLine]: [
    [0, 0],
    [-1, 0],
    [-2, 0],
    [-3, 0],
  ],
  [Shape.Square]: [
    [0, 0],
    [-1, 0],
    [0, 1],
    [-1, 1],
  ]
}

const shapes: Record<Shape, string[][]> = {
  [Shape.HorizontalLine]: [
    [C.Open, C.Open, C.Move, C.Move, C.Move, C.Move, C.Open]
  ],
  [Shape.Plus]: [
    [C.Open, C.Open, C.Open, C.Move, C.Open, C.Open, C.Open],
    [C.Open, C.Open, C.Move, C.Move, C.Move, C.Open, C.Open],
    [C.Open, C.Open, C.Open, C.Move, C.Open, C.Open, C.Open],
  ],
  [Shape.MirroredL]: [
    [C.Open, C.Open, C.Move, C.Move, C.Move, C.Open, C.Open],
    [C.Open, C.Open, C.Open, C.Open, C.Move, C.Open, C.Open],
    [C.Open, C.Open, C.Open, C.Open, C.Move, C.Open, C.Open],
  ],
  [Shape.VerticalLine]: [
    [C.Open, C.Open, C.Move, C.Open, C.Open, C.Open, C.Open],
    [C.Open, C.Open, C.Move, C.Open, C.Open, C.Open, C.Open],
    [C.Open, C.Open, C.Move, C.Open, C.Open, C.Open, C.Open],
    [C.Open, C.Open, C.Move, C.Open, C.Open, C.Open, C.Open],
  ],
  [Shape.Square]: [
    [C.Open, C.Open, C.Move, C.Move, C.Open, C.Open, C.Open],
    [C.Open, C.Open, C.Move, C.Move, C.Open, C.Open, C.Open],
  ]
}

/**
 * Mutating!
 * @param map 
 * @param anchorCoordiante 
 * @param trackingShape 
 * @param move 
 * @returns true if the shape did move, false if it stays in place
 */
export const moveShape = (map: (string|undefined)[][], anchorCoordiante: Coordinate, trackingShape: Shape, move: Move): boolean => {
  if (move === Move.Right) {
    // For all coordaintes of shape, check if there's a wall or bounds to the right,
    // if there are we can't move
    const coords = coordinates[trackingShape].map(coordinate => addLists(coordinate, anchorCoordiante))
    const newCoords = coords.map(coord => [coord[0], coord[1] + 1])
    if (newCoords.some(coord => [undefined, C.Wall].includes(map[coord[0]][coord[1]]))) return false

    // If above doesn't hold up, we can move freely
    // First fill the coords with open space, then fill newCoords with moving characters
    coords.forEach(c => { map[c[0]][c[1]] = C.Open })
    newCoords.forEach(c => { map[c[0]][c[1]] = C.Move })
    return true
  }

  if (move === Move.Left) {
    // For all coordaintes of shape, check if there's a wall or bounds to the left,
    // if there are we can't move
    const coords = coordinates[trackingShape].map(coordinate => addLists(coordinate, anchorCoordiante))
    const newCoords = coords.map(coord => [coord[0], coord[1] - 1])
    if (newCoords.some(coord => [undefined, C.Wall].includes(map[coord[0]][coord[1]]))) return false
  
    // If above doesn't hold up, we can move freely
    // First fill the coords with open space, then fill newCoords with moving characters
    coords.forEach(c => { map[c[0]][c[1]] = C.Open })
    newCoords.forEach(c => { map[c[0]][c[1]] = C.Move })
    return true
  }
  
  // For all coordaintes of shape, check if there's a wall or bounds to the up,
  // if there are we can't move
  const coords = coordinates[trackingShape].map(coordinate => addLists(coordinate, anchorCoordiante))
  const newCoords = coords.map(coord => [coord[0] - 1, coord[1]])
  if (newCoords.some(coord => [undefined, C.Wall].includes(map[coord[0]] && map[coord[0]][coord[1]]))) {
    // If we can't move upwards, this piece is stuck and we'll need to replace current coords by walls
    coords.forEach(coord => { map[coord[0]][coord[1]] = C.Wall })
    return false
  }

  // If above doesn't hold up, we can move freely
  // First fill the coords with open space, then fill newCoords with moving characters
  coords.forEach(c => { map[c[0]][c[1]] = C.Open })
  newCoords.forEach(c => { map[c[0]][c[1]] = C.Move })
  return true
}

const order: Shape[] = [Shape.HorizontalLine, Shape.Plus, Shape.MirroredL, Shape.VerticalLine, Shape.Square]
const getNextShape = (shape: Shape) => {
  const currentI = order.findIndex(s => shape === s) + 1
  return currentI < order.length ? currentI : order[0]
}

const isEmptyRow = (row: string[]) => row.every(cell => cell === C.Open)

export const solvePart1 = (input: string) => {
  const inp = [...input.trim().split('').join('^').split(''), '^']
  
  const directions = inp.map(i => {
    if (i === '^') return Move.Up
    if (i === '>') return Move.Right
    return Move.Left
  })

  const _getNextDirection = () => {
    let directionIndex = -1
    return () => {
      if (directionIndex >= directions.length - 1) {
        directionIndex = 0
        return directions[directionIndex]
      }
      directionIndex++
      return directions[directionIndex]
    }
  }
  const getNextDirection = _getNextDirection()
  let currentDirection = getNextDirection()

  const anchorCoordianteRelative = [0, 2]
  const board: string[][] = [
    C.Open.repeat(7).split(''),
    C.Open.repeat(7).split(''),
    C.Open.repeat(7).split(''),
  ]
  let shape = Shape.HorizontalLine

  for (const _ of range(0, 2022)) {
    const newRows: string[][] = JSON.parse(JSON.stringify(shapes[shape])) // Make copy
    newRows.forEach(row => board.push(row));
    let anchorCoordiante: [number, number] = [anchorCoordianteRelative[0] + board.length - 1, anchorCoordianteRelative[1]]
    
    // Move inserted piece until it is blocked by upwards movement
    while(true) {
      const didMove = moveShape(board, anchorCoordiante, shape, currentDirection)
      if (didMove && currentDirection === Move.Up) anchorCoordiante = addLists(anchorCoordiante, [-1, 0]) as [number, number]
      if (didMove && currentDirection === Move.Right) anchorCoordiante = addLists(anchorCoordiante, [0, 1]) as [number, number]
      if (didMove && currentDirection === Move.Left) anchorCoordiante = addLists(anchorCoordiante, [0, -1]) as [number, number]
      
      if (!didMove && currentDirection === Move.Up) {
        // Count empty rows, make sure there are only 3 empty rows at the end
        let emptyRows = 0
        for (let i = board.length - 1; i > 0; i--) {
          if (!isEmptyRow(board[i])) break
          emptyRows++
        }

        while (emptyRows > 3) {
          board.pop()
          emptyRows--
        }

        currentDirection = getNextDirection()
        break
      }
      currentDirection = getNextDirection();
    }

    shape = getNextShape(shape)
  }

  return board.length - 3
}

// To be able to simulate 1.000.000.000.000 rocks falling down, we're going to only keep a part of the array in memory
// Our strategy is as follows, anytime the array is > 1.000.000 elements, we cut the bottom half and keep track of how many
// rows we've cut along the way. While there is a risk that this could cut the board along some way where there is a column
// that would hit the floor, I will approximate that that chance is very small, considering we're keeping 500.000 rows.

const CUTOFF_AT = 1000000 // 1.000.000
const N_ROWS_TO_REMOVE = 500000 // 500.000

export const solvePart2 = (input: string) => {
  const inp = [...input.trim().split('').join('^').split(''), '^']
  
  const directions = inp.map(i => {
    if (i === '^') return Move.Up
    if (i === '>') return Move.Right
    return Move.Left
  })

  const _getNextDirection = () => {
    let directionIndex = -1
    return () => {
      if (directionIndex >= directions.length - 1) {
        directionIndex = 0
        return directions[directionIndex]
      }
      directionIndex++
      return directions[directionIndex]
    }
  }
  const getNextDirection = _getNextDirection()
  let currentDirection = getNextDirection()

  const anchorCoordianteRelative = [0, 2]
  const board: string[][] = [
    C.Open.repeat(7).split(''),
    C.Open.repeat(7).split(''),
    C.Open.repeat(7).split(''),
  ]
  let shape = Shape.HorizontalLine

  let amountRowsRemoved = 0

  // const total = 1000000000000
  for (let i = 0; i < 1000; i++) {
    const newRows: string[][] = JSON.parse(JSON.stringify(shapes[shape])) // Make copy
    newRows.forEach(row => board.push(row));
    let anchorCoordiante: [number, number] = [anchorCoordianteRelative[0] + board.length - 1, anchorCoordianteRelative[1]]

    // Move inserted piece until it is blocked by upwards movement
    while(true) {
      const didMove = moveShape(board, anchorCoordiante, shape, currentDirection)
      if (didMove && currentDirection === Move.Up) anchorCoordiante = addLists(anchorCoordiante, [-1, 0]) as [number, number]
      if (didMove && currentDirection === Move.Right) anchorCoordiante = addLists(anchorCoordiante, [0, 1]) as [number, number]
      if (didMove && currentDirection === Move.Left) anchorCoordiante = addLists(anchorCoordiante, [0, -1]) as [number, number]
      
      if (!didMove && currentDirection === Move.Up) {
        // Count empty rows, make sure there are only 3 empty rows at the end
        let emptyRows = 0
        for (let i = board.length - 1; i > 0; i--) {
          if (!isEmptyRow(board[i])) break
          emptyRows++
        }

        while (emptyRows > 3) {
          board.pop()
          emptyRows--
        }

        currentDirection = getNextDirection()
        break
      }
      currentDirection = getNextDirection();
    }

    shape = getNextShape(shape)

    // console.log(board.length)
  
    if (board.length > CUTOFF_AT) {
      board.splice(N_ROWS_TO_REMOVE, board.length)
      
      amountRowsRemoved += N_ROWS_TO_REMOVE
    }
  }


  // [...board].reverse().forEach(r => console.log(r.join('')))
  return amountRowsRemoved + board.length - 3
}
