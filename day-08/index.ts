import fs from 'fs';

const input = fs.readFileSync(__dirname + '/../../day-08/input.txt', 'utf-8').trim().split('\n')

type Row = number
type Column = number
type Coordinate = [Row, Column]

type Map = number[][]

// const input = `
// 30373
// 25512
// 65332
// 33549
// 35390
// `.trim().split('\n')

const map = input.map(l => l.split('').map(Number))

const checkVisibility = ([treeRow, treeColumn]: Coordinate, map: Map) => {
  const heightTree = map[treeRow][treeColumn]

  // Check left
  let visibleFromLeft = true
  for (let targetColumn = treeColumn - 1; targetColumn >= 0; targetColumn--) {
    if (map[treeRow][targetColumn] >= heightTree) {
      visibleFromLeft = false
      break
    }
  }
  if (visibleFromLeft) {
    return 1
  }


  // Check right
  let visibleFromRight = true
  for (let targetColumn = treeColumn + 1; targetColumn < map[0].length; targetColumn++) {
    if (map[treeRow][targetColumn] >= heightTree) {
      visibleFromRight = false
      break
    }
  }
  if (visibleFromRight) {
    return 1
  }
  

  // Check above
  let visibleFromAbove = true
  for (let targetRow = treeRow - 1; targetRow >= 0; targetRow--) {
    if (map[targetRow][treeColumn] >= heightTree) {
      visibleFromAbove = false
      break
    }
  }
  if (visibleFromAbove) {
    return 1
  }

  // Check below
  let visibleFromBelow = true
  for (let targetRow = treeRow + 1; targetRow < map.length; targetRow++) {
    if (map[targetRow][treeColumn] >= heightTree) {
      visibleFromBelow = false
      break
    }
  }
  if (visibleFromBelow) {
    return 1
  }

  return 0
}

const calculateScenicScore = ([treeRow, treeColumn]: Coordinate, map: Map) => {
  const heightTree = map[treeRow][treeColumn]
  
  // Check left
  let visibleFromLeft = 0
  for (let targetColumn = treeColumn - 1; targetColumn >= 0; targetColumn--) {
    visibleFromLeft += 1
    if (map[treeRow][targetColumn] >= heightTree) break 
  }


  // Check right
  let visibleFromRight = 0
  for (let targetColumn = treeColumn + 1; targetColumn < map[0].length; targetColumn++) {
    visibleFromRight += 1
    if (map[treeRow][targetColumn] >= heightTree) break
  }


  // Check above
  let visibleFromAbove = 0
  for (let targetRow = treeRow - 1; targetRow >= 0; targetRow--) {
    visibleFromAbove += 1
    if (map[targetRow][treeColumn] >= heightTree) break
  }

  // Check below
  let visibleFromBelow = 0
  for (let targetRow = treeRow + 1; targetRow < map.length; targetRow++) {
    visibleFromBelow += 1
    if (map[targetRow][treeColumn] >= heightTree) break
  }

  return visibleFromLeft * visibleFromRight * visibleFromAbove * visibleFromBelow
}

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

// We already counted the outer columns, so subtract 2 elements when counting the outer rows
export const part1 = countInterior + map.length * 2 + (map[0].length - 2) * 2
export const part2 = maxScenicScore
