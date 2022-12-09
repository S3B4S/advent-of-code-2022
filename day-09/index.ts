import fs, { Dir } from 'fs';
import { Coordinate } from '../utilts';

type Direction = 'R' | 'U' | 'L' | 'D';

const printMap = ([amountRows, amountColumns]: [number, number], set: Set<string>, head: Coordinate, tail: Coordinate) => {
  const printable = Array.from({ length: amountRows }).map(() =>
    Array.from({ length: amountColumns }).fill('.')
  )

  set.forEach((v: string) => {
    const [row, column] = v.split(',').map(Number)
    printable[row][column] = '#'
  })

  printable[tail[0]][tail[1]] = 'T'
  printable[head[0]][head[1]] = 'H'


  const p2 = printable.reverse().map(line => line.join(' '))
  process.stdout.write(p2.join('\n'))
  process.stdout.write('\n')
}

const input = fs.readFileSync(__dirname + '/../../day-09/input.txt', 'utf-8')
// const input = `
// U 4
// D 15
// R 11
// U 11
// D 17
// U 2
// R 6
// U 13
// R 8
// D 9
// U 19
// D 8
// U 5
// D 10
// U 18
// L 7
// D 2
// R 13
// D 11
// R 14
// L 14
// R 11
// U 11
// D 13
// L 4
// R 2
// U 18
// ` 

// L 4
// D 3
// L 15
// U 6
// R 16
// L 13
// D 3
// U 14
// R 5
// U 15
// L 7
// R 5
// U 11
// L 16
// R 5
// L 1
// U 9
// D 7
// R 8
// L 11
// R 6
// L 16
// U 19
// R 2
// D 10
// L 15
// D 7
// U 19
// D 1
// U 5
// L 3
.trim()
  .split('\n')
  .map(line => {
    const [direction, amount] = line.trim().split(' ')
    return [direction, Number(amount)]
  }) as [Direction, number][]

const updateCoordinate = ([row, column]: Coordinate, direction: Direction): Coordinate => {
  switch (direction) {
    case 'D':
      return [row - 1, column]
    case 'L':
      return [row, column - 1]
    case 'R':
      return [row, column + 1]
    case 'U':
      return [row + 1, column]
  }
}

const range = (start: number, end: number) => Array.from({ length: Math.abs(end - start) }, (_, i) => start < end ? i + start : Math.abs(i - start))
const adjacentTo = (coordiante: Coordinate, other: Coordinate) => {
  return Math.abs(coordiante[0] - other[0]) <= 1 && Math.abs(coordiante[1] - other[1]) <= 1
}

let tail: Coordinate = [0, 0]
let head: Coordinate = [0, 0]
let visited = new Set<string>()

visited.add("0,0")

for (let [direction, amountSteps] of input) {
  for (let step of range(0, amountSteps)) {
    const futureHead = updateCoordinate(head, direction)
    
    if (!adjacentTo(tail, futureHead)) {
      visited.add(head.toString())
      tail = head
      head = futureHead
      continue
    }

    // If it stays on the same line, or we're beyond the first step, keep recording as usual
    head = futureHead
  }

  // process.stdout.write(direction + ' ' + amountSteps + '\n')
  // printMap([50, 50], visited, head, tail);
}

console.log(visited.size)

export const part1 = ''
export const part2 = ''