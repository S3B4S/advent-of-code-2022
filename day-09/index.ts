import fs, { Dir } from 'fs'
import { addLists, Coordinate } from '../utilts'

type Direction = 'R' | 'U' | 'L' | 'D'

const printMap = ([amountRows, amountColumns]: [number, number], start: Coordinate, set: Set<string>, knots: Coordinate[]) => {
  const printable = Array.from({ length: amountRows }).map(() =>
    Array.from({ length: amountColumns }).fill('.')
  )

  set.forEach((v: string) => {
    const [row, column] = v.split(',').map(Number)
    printable[row + start[0]][column + start[1]] = '#'
  })

  const copy = [...knots]
  copy.reverse().forEach((knot, i) => {
    const symbol = String((knots.length - 1) - i)
    printable[knot[0] + start[0]][knot[1] + start[1]] = symbol === "0" ? "H" : symbol
  })

  const p2 = printable.reverse().map(line => line.join(' '))
  process.stdout.write(p2.join('\n'))
  process.stdout.write('\n')
}

const input = fs.readFileSync(__dirname + '/../../day-09/input.txt', 'utf-8')
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

const part1Fn = (input: [Direction, number][]) => {
  let tail: Coordinate = [0, 0]
  let head: Coordinate = [0, 0]
  let visited = new Set<string>()
  
  visited.add("0,0")
  
  for (let [direction, amountSteps] of input) {
    for (let _ of range(0, amountSteps)) {
      const futureHead = updateCoordinate(head, direction)
      
      if (!adjacentTo(tail, futureHead)) {
        visited.add(head.toString())
        tail = head
        head = futureHead
        continue
      }
  
      head = futureHead
    }
  }
  
  console.log(visited.size)
}

const moveCloser = (trailingTail: Coordinate, goal: Coordinate) => {
  let newLocation: Coordinate
  // If on same row
  if (trailingTail[0] === goal[0]) {
    newLocation = [trailingTail[0], goal[1] < trailingTail[1] ? trailingTail[1] - 1 : trailingTail[1] + 1]
  // If on same column
  } else if (trailingTail[1] === goal[1]) {
    newLocation = [goal[0] < trailingTail[0] ? trailingTail[0] - 1 : trailingTail[0] + 1, trailingTail[1]]
  // Move northeast
  } else if (goal[0] > trailingTail[0] && goal[1] > trailingTail[1]) {
    newLocation = addLists(trailingTail, [1, 1]) as Coordinate
  // Move southeast
  } else if (goal[0] < trailingTail[0] && goal[1] > trailingTail[1]) {
    newLocation = addLists(trailingTail, [-1, 1]) as Coordinate
  // Move southwest
  } else if (goal[0] < trailingTail[0] && goal[1] < trailingTail[1]) {
    newLocation = addLists(trailingTail, [-1, -1]) as Coordinate
  // Move northwest
  } else if (goal[0] > trailingTail[0] && goal[1] < trailingTail[1]) {
    newLocation = addLists(trailingTail, [1, -1]) as Coordinate
  }

  return newLocation
}


const part2Fn = (input: [Direction, number][]) => {
  let visited = new Set<string>()

  const k = 10
  // head is at 0, tail is at last
  const knots = Array.from({ length: k }).map((_, i) => [0, 0]) as Coordinate[]

  for (let [direction, amountSteps] of input) {
    for (let _ of range(0, amountSteps)) {
      for (let i of range(0, knots.length  - 1)) {
        const tail = knots[i + 1]
        const head = knots[i]

        if (i === 0) {
          const futureHead = updateCoordinate(knots[0], direction)
          
          // Tail is not going to move
          if (adjacentTo(tail, futureHead)) {
            knots[0] = futureHead
            break
          }

          // Tail is going to move
          const futureTail = head
          knots[i] = futureHead
          knots[i + 1] = futureTail
          continue
        }

        // If tail of next subsequent pair of knot is adjacent to the (already) moved head,
        // go to next iteration
        if (adjacentTo(knots[i + 1], knots[i])) {
          break
        }

        const newLocation = moveCloser(tail, head)
        
        knots[i + 1] = newLocation
        visited.add(knots[knots.length - 1].toString())
      }
    }
  }
  
  return visited.size
}

console.log(part2Fn(input))

export const part1 = ''
export const part2 = ''
