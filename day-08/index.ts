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
  // console.log('----------')
  // console.log(heightTree)

  // Check left
  let visibleFromLeft = true
  for (let targetColumn = treeColumn - 1; targetColumn >= 0; targetColumn--) {
    if (map[treeRow][targetColumn] >= heightTree) {
      // console.log(map[treeRow][targetColumn])
      // console.log('Bigger on left')
      visibleFromLeft = false
      break
    }
  }
  if (visibleFromLeft) {
    // console.log("Visible from: left")
    return 1
  }


  // Check right
  let visibleFromRight = true
  for (let targetColumn = treeColumn + 1; targetColumn < map[0].length; targetColumn++) {
    if (map[treeRow][targetColumn] >= heightTree) {
      // console.log(map[treeRow][targetColumn])
      // console.log('Bigger on right')
      visibleFromRight = false
      break
    }
  }
  if (visibleFromRight) {
    // console.log("Visible from: right")
    return 1
  }
  

  // Check above
  let visibleFromAbove = true
  for (let targetRow = treeRow - 1; targetRow >= 0; targetRow--) {
    if (map[targetRow][treeColumn] >= heightTree) {
      // console.log(map[targetRow][treeColumn])
      // console.log('Bigger on above')
      visibleFromAbove = false
      break
    }
  }
  if (visibleFromAbove) {
    // console.log("Visible from: above")
    return 1
  }

  // Check below
  let visibleFromBelow = true
  for (let targetRow = treeRow + 1; targetRow < map.length; targetRow++) {
    if (map[targetRow][treeColumn] >= heightTree) {
      // console.log(map[targetRow][treeColumn])
      // console.log('Bigger on below')
      visibleFromBelow = false
      break
    }
  }
  if (visibleFromBelow) {
    // console.log("Visible from: below")
    return 1
  }

  // console.log('Not visible from any side')
  return 0
}

/// brute force, O(n^2)

let countInterior = 0

// Ignore the edges
for (let row = 1; row < map.length - 1; row++) {
  for (let column = 1; column < map[row].length - 1; column++) {
    countInterior += checkVisibility([row, column], map)
  }
}

console.log(countInterior)

// We already counted the outer columns, so subtract 2 elements when counting the outer rows
export const part1 = countInterior + map.length * 2 + (map[0].length - 2) * 2
export const part2 = ''