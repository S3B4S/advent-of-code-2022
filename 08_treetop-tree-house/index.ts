import fs from 'fs';
import { Coordinate, directionIterator } from '../utilts';

const input = fs.readFileSync(__dirname + '/../../08_treetop-tree-house/input.txt', 'utf-8').trim().split('\n')
type Map = number[][]
const map = input.map(l => l.split('').map(Number))

const checkVisibility = ([treeRow, treeColumn]: Coordinate, map: Map) => {
  const heightTree = map[treeRow][treeColumn]
  const iterateInDirection = directionIterator([treeRow, treeColumn], map)

  let visibleFromNorth = true
  iterateInDirection.North(tree => {
    if (tree >= heightTree) {
      visibleFromNorth = false
      return true
    }
  })
  if (visibleFromNorth) return 1

  let visibleFromEast = true
  iterateInDirection.East(tree => {
    if (tree >= heightTree) {
      visibleFromEast = false
      return true
    }
  })
  if (visibleFromEast) return 1

  let visibleFromSouth = true
  iterateInDirection.Sotuh(tree => {
    if (tree >= heightTree) {
      visibleFromSouth = false
      return true
    }
  })
  if (visibleFromSouth) return 1
  
  let visibleFromWest = true
  iterateInDirection.West(tree => {
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
  iterateInDirection.North(tree => {
    visibleFromAbove += 1
    if (tree >= heightTree) return true
  })

  let visibleFromRight = 0
  iterateInDirection.East(tree => {
    visibleFromRight += 1
    if (tree >= heightTree) return true
  })

  let visibleFromBelow = 0
  iterateInDirection.Sotuh(tree => {
    visibleFromBelow += 1
    if (tree >= heightTree) return true
  })

  let visibleFromLeft = 0
  iterateInDirection.West(tree => {
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
