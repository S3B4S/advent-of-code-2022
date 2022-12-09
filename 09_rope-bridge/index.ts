import fs from 'fs'
import { addLists, Coordinate, range } from '../utilts'

type Direction = 'R' | 'U' | 'L' | 'D'

/**
 * Prints a map of the coordinates visited by a set of knots.
 *
 * @param dimensions - The dimensions of the map as a tuple of `number` values, representing the number of rows and columns.
 * @param start - The starting coordinates of the map as a `Coordinate` tuple.
 * @param set - A `Set` of `string` coordinates visited by the knots.
 * @param knots - The current locations of the knots as an array of `Coordinate` tuples.
 */
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

  const p2 = printable.reverse().map(line => line.join(''))
  process.stdout.write(p2.join('\n'))
  process.stdout.write('\n')
}

const moveTowards = ([row, column]: Coordinate, direction: Direction): Coordinate => {
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

const adjacentTo = (coordiante: Coordinate, other: Coordinate) => {
  return Math.abs(coordiante[0] - other[0]) <= 1 && Math.abs(coordiante[1] - other[1]) <= 1
}

const moveCloserTo = (trailingTail: Coordinate, goal: Coordinate) => {
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

const input: [Direction, number][] = fs.readFileSync(__dirname + '/../../09_rope-bridge/input.txt', 'utf-8')
  .trim()
  .split('\n')
  .map(line => {
    const [direction, amount] = line.trim().split(' ')
    return [direction as Direction, Number(amount)]
  })

/**
 * Simulates the movement of a rope with 2 knots in a grid.
 *
 * @param input - A list of `Direction` values and distances, representing the movement of the knot.
 * @returns The number of unique coordinates visited by the last knot.
 */
const part1Fn = (input: [Direction, number][]) => {
  let tail: Coordinate = [0, 0]
  let head: Coordinate = [0, 0]
  let visited = new Set<string>()
  
  visited.add("0,0")
  
  for (let [direction, amountSteps] of input) {
    for (let _ of range(0, amountSteps)) {
      const futureHead = moveTowards(head, direction)
      
      if (!adjacentTo(tail, futureHead)) {
        visited.add(head.toString())
        tail = head
        head = futureHead
        continue
      }
  
      head = futureHead
    }
  }
  return visited.size
}

/**
 * Simulates the movement of a number of knots in a grid.
 *
 * @param input - A list of `Direction` values and distances, representing the movement of the knots.
 * @param amountKnots - The number of knots to simulate.
 * @returns The number of unique coordinates visited by the last knot.
 */
const part2Fn = (input: [Direction, number][], amountKnots: number) => {
  let visited = new Set<string>()

  // Head is at index 0
  const knots: Coordinate[] = Array.from({ length: amountKnots }).map(() => [0, 0])

  for (let [direction, amountSteps] of input) {
    for (let _ of range(0, amountSteps)) {
      for (let i of range(0, knots.length  - 1)) {
        const tail = knots[i + 1]
        const head = knots[i]

        if (i === 0) {
          const futureHead = moveTowards(knots[0], direction)
          
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
        if (adjacentTo(knots[i + 1], knots[i]))
          break

        const newLocation = moveCloserTo(tail, head)
        knots[i + 1] = newLocation
        visited.add(knots[knots.length - 1].toString())
      }
    }
  }
  
  return visited.size
}

export const part1 = part1Fn(input)
export const part2 = part2Fn(input, 10)
