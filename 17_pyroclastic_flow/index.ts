import { addLists, Characters, range } from "../utilts.ts"

export enum Move { Left, Right, Up }
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
    [1, 0],
    [1, 1],
    [1, 2],
    [2, 1],
  ],
  [Shape.MirroredL]: [
    [0, 2],
    [1, 2],
    [2, 2],
    [2, 1],
    [2, 0],
  ],
  [Shape.VerticalLine]: [
    [0, 0],
    [1, 0],
    [2, 0],
    [3, 0],
  ],
  [Shape.Square]: [
    [0, 0],
    [1, 0],
    [0, 1],
    [1, 1],
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
    [C.Open, C.Open, C.Open, C.Open, C.Move, C.Open, C.Open],
    [C.Open, C.Open, C.Open, C.Open, C.Move, C.Open, C.Open],
    [C.Open, C.Open, C.Move, C.Move, C.Move, C.Open, C.Open],
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
  if (newCoords.some(coord => [undefined, C.Wall].includes(map[coord[0]] && map[coord[0]][coord[1]]))) return false

  // If above doesn't hold up, we can move freely
  // First fill the coords with open space, then fill newCoords with moving characters
  coords.forEach(c => { map[c[0]][c[1]] = C.Open })
  newCoords.forEach(c => { map[c[0]][c[1]] = C.Move })
  return true
}

const relativeStartingLocation = {
  bottom: 3,
  left: 2
}

const order: Shape[] = [Shape.HorizontalLine, Shape.Plus, Shape.MirroredL, Shape.VerticalLine, Shape.Square]
const getNextShape = (shape: Shape) => {
  const currentI = order.findIndex(s => shape === s) + 1
  return currentI < order.length ? currentI : order[0]
}

export const solvePart1 = (input: string) => {
  const board: string[][] = [
    C.Open.repeat(7).split(''),
    C.Open.repeat(7).split(''),
    C.Open.repeat(7).split(''),
  ]
  let shape = Shape.HorizontalLine
  let floorLevel = 0 

  // for (const _ of range(0, 2022)) {
  for (const _ of range(0, 3)) {
    const newRows = shapes[shape]
    const window = {
      from: board.length - 2,
      to: board.length + newRows.length
    }
    newRows.forEach(row => board.push(row))

    // console.log(board.slice(window.from, window.to))
  }

  return 0
}

export const solvePart2 = (input: string) => {
  return 0
}
