import { addLists, Characters, range } from "../utilts.ts"

export enum Move { Left, Right }
export enum Shape { HorizontalLine, Plus, MirroredL, VerticalLine, Square }

export const C = {
  Wall: Characters.HashTag,
  Open: Characters.Dot,
  Move: Characters.At,
}

// Meaning of symbols
// Dot      | . | open space
// At       | @ | Moving block
// Hashtag  | # | Walls

// Y coordinate goes positive going south
// X coordinate goes positive going east

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

const shapes: Record<Shape, (string|undefined)[][]> = {
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
 * Each shape is 
 * @param shape 
 * @param move 
 */
export const moveShape = (map: (string|undefined)[][], anchorCoordiante: Coordinate, trackingShape: Shape, move: Move) => {
  if (move === Move.Right) {
    // For all coordaintes of shape, check if there's a wall or bounds to the right,
    // if there are we can't move
    const coords = coordinates[trackingShape].map(coordinate => addLists(coordinate, anchorCoordiante))
    const newCoords = coords.map(coord => [coord[0], coord[1] + 1])
    if (newCoords.some(coord => [undefined, C.Wall].includes(map[coord[0]][coord[1]]))) return map

    // If above doesn't hold up, we can move freely
    // First fill the coords with open space, then fill newCoords with moving characters
    coords.forEach(c => { map[c[0]][c[1]] = C.Open })
    newCoords.forEach(c => { map[c[0]][c[1]] = C.Move })
    return map
  }
  
  // For all coordaintes of shape, check if there's a wall or bounds to the left,
  // if there are we can't move
  const coords = coordinates[trackingShape].map(coordinate => addLists(coordinate, anchorCoordiante))
  const newCoords = coords.map(coord => [coord[0], coord[1] - 1])
  if (newCoords.some(coord => [undefined, C.Wall].includes(map[coord[0]][coord[1]]))) return map

  // If above doesn't hold up, we can move freely
  // First fill the coords with open space, then fill newCoords with moving characters
  coords.forEach(c => { map[c[0]][c[1]] = C.Open })
  newCoords.forEach(c => { map[c[0]][c[1]] = C.Move })
  return map
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
  const board = [
    C.Open.repeat(7).split(''),
    C.Open.repeat(7).split(''),
    C.Open.repeat(7).split(''),
  ]
  let shape = Shape.HorizontalLine
  let floorLevel = 0

  for (const _ of range(0, 2022)) {
    
  }

  return 0
}

export const solvePart2 = (input: string) => {
  return 0
}
