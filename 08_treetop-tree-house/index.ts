// import fs from 'fs';
import { Coordinate, directionIterator } from '../utilts.ts'

const input = Deno.readTextFileSync('./08_treetop-tree-house/input.txt').trim().split('\n')

type Map = number[][]
const map = input.map(l => l.split('').map(Number))

const checkVisibility = ([treeRow, treeColumn]: Coordinate, map: Map) => {
  const heightTree = map[treeRow][treeColumn]
  const iterateInDirection = directionIterator([treeRow, treeColumn], map)

  let visibleFromNorth = true
  iterateInDirection.North(tree => {
    if (tree >= heightTree) visibleFromNorth = false
    return tree >= heightTree
  })
  if (visibleFromNorth) return 1

  let visibleFromEast = true
  iterateInDirection.East(tree => {
    if (tree >= heightTree) visibleFromEast = false
    return tree >= heightTree
  })
  if (visibleFromEast) return 1

  let visibleFromSouth = true
  iterateInDirection.South(tree => {
    if (tree >= heightTree) visibleFromSouth = false
    return tree >= heightTree
  })
  if (visibleFromSouth) return 1
  
  let visibleFromWest = true
  iterateInDirection.West(tree => {
    if (tree >= heightTree) visibleFromWest = false
    return tree >= heightTree
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
    return tree >= heightTree
  })

  let visibleFromRight = 0
  iterateInDirection.East(tree => {
    visibleFromRight += 1
    return tree >= heightTree
  })

  let visibleFromBelow = 0
  iterateInDirection.South(tree => {
    visibleFromBelow += 1
    return tree >= heightTree
  })

  let visibleFromLeft = 0
  iterateInDirection.West(tree => {
    visibleFromLeft += 1
    return tree >= heightTree
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

console.log(part1)
console.log(part2)
