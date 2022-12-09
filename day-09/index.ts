import fs, { Dir } from 'fs';
import { exit } from 'process';
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

// const input = fs.readFileSync(__dirname + '/../../day-09/input.txt', 'utf-8')
const input = `
R 4
U 4
`
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

const part1Fn = () => {
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
  
      head = futureHead
    }
  }
  
  console.log(visited.size)
}

enum DirectionCompass {
  North,
  NorthEast,
  East,
  SouthEast,
  South,
  SouthWest,
  West,
  NorthWest,
}

const zip = <A, B>(xs: A[], ys: B[]) => {
  const maxLength = Math.min(xs.length, ys.length)
  return xs.slice(0, maxLength).map((a, i) => [a, ys[i]])
}

const subtractLists = (xs: number[], ys: number[]) => zip(xs, ys).map(([x, y]) => x - y)
const addLists = (xs: number[], ys: number[]) => zip(xs, ys).map(([x, y]) => x + y)
const hammingDistance = (xs: number[], ys: number[]) => zip(xs, ys).filter(([x, y]) => x !== y).length

const Movement: [DirectionCompass, [number, number]][] = [
  [DirectionCompass.North, [1, 0]],
  [DirectionCompass.NorthEast, [1, 1]],
  [DirectionCompass.East, [0, 1]],
  [DirectionCompass.SouthEast, [-1, 1]],
  [DirectionCompass.South, [-1, 0]],
  [DirectionCompass.SouthWest, [-1, -1]],
  [DirectionCompass.West, [0, -1]],
  [DirectionCompass.NorthWest, [1, -1]],
]

const part2Fn = () => {
  let visited = new Set<string>()

  const k = 10
  // head is at 0, tail is at last
  const knots = Array.from({ length: k }).map((_, i) => [0, 0]) as Coordinate[]

  for (let [direction, amountSteps] of input) {
    console.log({ direction, amountSteps })
    for (let step of range(0, amountSteps)) {
      console.group()
      console.log({step, knots})
      let trail: [number, number]
      let lastMovement: [number, number]
      // If it's the head, calculate future new head
      // also calculate the move the tail makes, we need it in subsequent steps
      for (let i of range(0, knots.length  - 1)) {
        if (direction === 'U') console.log()
        if (direction === 'U') console.log({i})
        if (i === 0) {
          const futureHead = updateCoordinate(knots[0], direction)
          const head = knots[0]
          const tail = knots[i + 1]
          
          // Tail is not going to move
          if (adjacentTo(tail, futureHead)) {
            knots[0] = futureHead
            break
          }

          // Tail is going to move
          const futureTail = head
          // So we need to leave a trail + lastMovement behind, the next knot needs that
          lastMovement = subtractLists(futureTail, tail) as [number, number]
          trail = tail
          knots[i] = futureHead
          knots[i + 1] = futureTail
          continue
        }

        // If tail of next subsequent pair of knot is adjacent to the (already) moved head, go to next iteration
        if (adjacentTo(knots[i + 1], knots[i])) {
          break
        }

        // If previous tail was moved, move the current tail as close as possible to it
        // Compare prev trail and movement, whatever brings you closer, you take
        if (direction === 'U') console.log({ trail, lastMovement, head: knots[i], tail: knots[i + 1] })
        if (direction === 'U') console.log({ trailHD: hammingDistance(trail, knots[i]), movHD: hammingDistance(addLists(knots[i + 1], lastMovement), knots[i])})
        if (hammingDistance(trail, knots[i]) < hammingDistance(addLists(knots[i + 1], lastMovement), knots[i])) {
          if (direction === 'U') console.log('moving to trail')
          if (direction === 'U') console.log({trail})
          // Move to trail
          // Save copy of current location
          const temp = knots[i + 1]
          lastMovement = subtractLists(trail, knots[i + 1]) as [number, number]
          // Need to move the tail
          knots[i + 1] = trail
          // Leave new trail behind
          trail = temp

        } else {
          if (direction === 'U') console.log('taking same prev movement')
          if (direction === 'U') console.log({lastMovement})
          // Update trail
          trail = knots[i + 1]
          // Take the same last movement
          knots[i + 1] = addLists(knots[i + 1], lastMovement) as Coordinate
        }
      }
      if (direction === 'U') console.log({step, knots})
      console.groupEnd()

      // for (let i = 0; i < knotPairs.length - 1; i++) {
      //   const futureHead = i === 0 ? updateCoordinate(knotPairs[0].head, direction) : knotPairs[0].head // was update in prev iteration
      //   const newTail = tailFollowMovement(direction, knotPairs[0].tail, futureHead)
      //   console.table([{direction, knotPairHead: knotPairs[0].head, knotPairTail: knotPairs[0].tail, futureHead, newTail}])
        
      //   // The tail is not going to move, thus any subsequent tails won't either
      //   if (newTail[0] === knotPairs[0].tail[0] && newTail[1] === knotPairs[0].tail[1]) {
      //     knotPairs[0].head = futureHead
      //     break
      //   }

      //   // The tail is going to move  
      //   knotPairs[0].tail = knotPairs[0].head
      //   knotPairs[0].head = futureHead

      //   knotPairs[1].head = knotPairs[0].tail
      // }
    }
    console.table(knots)
    console.groupEnd()

    // console.log(knotPairs)
  }
}

console.log(part2Fn())

export const part1 = ''
export const part2 = ''