import fs, { Dir } from 'fs';

type Row = number
type Column = number
type Coordinate = [Row, Column]
enum Direction { North, East, South, West }

/**
 * Applies the provided function to the elements in the specified direction in a two-dimensional array, starting from the provided coordinate.
 * The function is applied to each element in the specified direction until it returns `true` or all elements have been visited.
 *
 * @param coordinate The starting coordinate
 * @param map The two-dimensional array to iterate over
 * @param direction The direction in which to apply the function
 * @param fn The function to apply to each element
 */
const directionIterator = <T>([row, column]: Coordinate, map: T[][]) => (direction: Direction, fn: (t: T) => boolean) => {
  switch (direction) {
    case Direction.North:
      for (let targetRow = row - 1; targetRow >= 0; targetRow--) {
        if (fn(map[targetRow][column])) return
      }
      return
    
    case Direction.East:
      for (let targetColumn = column + 1; targetColumn < map[0].length; targetColumn++) {
        if (fn(map[row][targetColumn])) return
      }
      return

    case Direction.South:
      for (let targetRow = row + 1; targetRow < map.length; targetRow++) {
        if (fn(map[targetRow][column])) return
      }
      return

    case Direction.West:
      for (let targetColumn = column - 1; targetColumn >= 0; targetColumn--) {
        if (fn(map[row][targetColumn])) return
      }
      return
  }
}

const input = fs.readFileSync(__dirname + '/../../08_treetop-tree-house/input.txt', 'utf-8').trim().split('\n')
type Map = number[][]
const map = input.map(l => l.split('').map(Number))

const checkVisibility = ([treeRow, treeColumn]: Coordinate, map: Map) => {
  const heightTree = map[treeRow][treeColumn]
  const iterateInDirection = directionIterator([treeRow, treeColumn], map)

  let visibleFromNorth = true
  iterateInDirection(Direction.North, tree => {
    if (tree >= heightTree) {
      visibleFromNorth = false
      return true
    }
  })
  if (visibleFromNorth) return 1

  let visibleFromEast = true
  iterateInDirection(Direction.East, tree => {
    if (tree >= heightTree) {
      visibleFromEast = false
      return true
    }
  })
  if (visibleFromEast) return 1

  let visibleFromSouth = true
  iterateInDirection(Direction.South, tree => {
    if (tree >= heightTree) {
      visibleFromSouth = false
      return true
    }
  })
  if (visibleFromSouth) return 1
  
  let visibleFromWest = true
  iterateInDirection(Direction.West, tree => {
    if (tree >= heightTree) {
      visibleFromWest = false
      return true
    }
  })
  if (visibleFromWest) return 1

  return 0
}

const calculateScenicScore = ([treeRow, treeColumn]: Coordinate, map: Map) => {
  const heightTree = map[treeRow][treeColumn]
  const iterateInDirection = directionIterator([treeRow, treeColumn], map)
  
  let visibleFromAbove = 0
  iterateInDirection(Direction.North, tree => {
    visibleFromAbove += 1
    if (tree >= heightTree) return true
  })

  let visibleFromRight = 0
  iterateInDirection(Direction.East, tree => {
    visibleFromRight += 1
    if (tree >= heightTree) return true
  })

  let visibleFromBelow = 0
  iterateInDirection(Direction.South, tree => {
    visibleFromBelow += 1
    if (tree >= heightTree) return true
  })

  let visibleFromLeft = 0
  iterateInDirection(Direction.West, tree => {
    visibleFromLeft += 1
    if (tree >= heightTree) return true
  })

  return visibleFromLeft * visibleFromRight * visibleFromAbove * visibleFromBelow
}

// We already counted the outer columns, so subtract 2 elements when counting the outer rows
const treesOnEdge = map.length * 2 + (map[0].length - 2) * 2

let countInterior = 0
// Ignore the edges
for (let row = 1; row < map.length - 1; row++) {
  for (let column = 1; column < map[row].length - 1; column++) {
    countInterior += checkVisibility([row, column], map)
  }
}

let maxScenicScore = 0
for (let row = 0; row < map.length; row++) {
  for (let column = 0; column < map[row].length; column++) {
    maxScenicScore = Math.max(maxScenicScore, calculateScenicScore([row, column], map))
  }
}

export const part1 = countInterior + treesOnEdge
export const part2 = maxScenicScore
