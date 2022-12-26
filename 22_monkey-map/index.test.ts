import { assertEquals } from "deps"
import { calcScore, solvePart1, solvePart1StartMarker, solvePart2, Direction, onRange, moveAcrossDice, DiceBorder, solvePart2StartMarker } from "./index.ts"

const exampleInput = 
`        ...#
        .#..
        #...
        ....
...#.......#
........#...
..#....#....
..........#.
        ...#....
        .....#..
        .#......
        ......#.

10R5L5R10L4R5L5
`

const exampleInputWithStartMarker = 
`        S..#
        .#..
        #...
        ....
...#.......#
........#...
..#....#....
..........#.
        ...#....
        .....#..
        .#......
        ......#.

10R5L5R10L4R5L5
`

const exampleInput2 = 
`        ...#
        .#..
        #...
        ....
...#.......#
........#...
..#....#....
..........#.
        ...#....
        .....#..
        .#......
        ......#.

R5
`

const exampleInput3 =
`........#...

3
`

const exampleInput4 =
`#.......#...

100
`

const fileInput = Deno.readTextFileSync('./22_monkey-map/input.txt')

Deno.test("Day 22 - Part 1 - Wrap around vertically", () => {
  assertEquals(solvePart1(exampleInput2, { y: 4, x: 0 }), 6005)
})

Deno.test("Day 22 - Part 1 - Wrap around horizontally against wall", () => {
  assertEquals(solvePart1(exampleInput2, { y: 7, x: 3 }), 8017)
})

Deno.test("Day 22 - Part 1 - Wrap around horizontally", () => {
  assertEquals(solvePart1(exampleInput3, { y: 0, x: 9 }), 1004)
})

Deno.test("Day 22 - Part 1 - Wrap around horizontally against wall", () => {
  assertEquals(solvePart1(exampleInput4, { y: 0, x: 9 }), 1048)
})

Deno.test("Day 22 - Part 1 - Give start marker", () => {
  const input = `.....S#...

R1`

  assertEquals(solvePart1StartMarker(input), calcScore({ y: 0, x: 5 }, Direction.South))
})

Deno.test("Day 22 - Part 1 - Example input", () => {
  assertEquals(6032, solvePart1(exampleInput, { y: 0, x: 8 }))
})

Deno.test("Day 22 - Part 1 - File input", () => {
  assertEquals(162186, solvePart1(fileInput, { y: 0, x: 50 }))
})

const quadrants = [
  { low: 0, high: 49 },
  { low: 50, high: 99 },
  { low: 100, high: 149 },
  { low: 150, high: 199 },
]

/**
 * Ranges are inclusive on both ends
 * If the coordinate is on the from 
 * The first coordinate of a range should match
 * up with the coordiante of the other range
 */
const diceBordersFileInput: DiceBorder[] = [
  // Light blue border
  {
    from: [{ y: -1, x: quadrants[1].low }, { y: -1, x: quadrants[1].high }, Direction.North, "LB 1"],
    to: [{ y: quadrants[3].low, x: 0 }, { y: quadrants[3].high, x: 0 }, Direction.East]
  },
  {
    from: [{ y: quadrants[3].low, x: -1 }, { y: quadrants[3].high, x: -1 }, Direction.West, "LB 2"],
    to: [{ y: 0, x: quadrants[1].low }, { y: 0, x: quadrants[1].high }, Direction.South],
  },
  // Purple border
  {
    from: [{ y: quadrants[2].low, x: -1 }, { y: quadrants[2].high, x: -1 }, Direction.West, "P 1"],
    to: [{ y: quadrants[0].high, x: 50 }, { y: quadrants[0].low, x: 50 }, Direction.East],
  },
  {
    from: [{ y: quadrants[0].low, x: 49 }, { y: quadrants[0].high, x: 49 }, Direction.West, "P 2"],
    to: [{ y: quadrants[2].high, x: 0 }, { y: quadrants[2].low, x: 0 }, Direction.East],
  },
  // Dark blue border
  {
    from: [{ y: 99, x: quadrants[0].low }, { y: 99, x: quadrants[0].high }, Direction.North, "DB 1"],
    to: [{ y: quadrants[1].low, x: 50 }, { y: quadrants[1].high, x: 50 }, Direction.East],
  },
  {
    from: [{ y: quadrants[1].low, x: 49 }, { y: quadrants[1].high, x: 49 }, Direction.West, "DB 2"],
    to: [{ y: 100, x: quadrants[0].low }, { y: 100, x: quadrants[0].high }, Direction.South],
  },
  // Yellow border
  {
    from: [{ y: -1, x: quadrants[2].low }, { y: -1, x: quadrants[2].high }, Direction.North, "Y 1"],
    to: [{ y: 199, x: quadrants[0].low }, { y: 199, x: quadrants[0].high }, Direction.North],
  },
  {
    from: [{ y: 200, x: quadrants[0].low }, { y: 200, x: quadrants[0].high }, Direction.South, "Y 2"],
    to: [{ y: 0, x: quadrants[2].low }, { y: 0, x: quadrants[2].high }, Direction.South],
  },
  // Crimson border
  {
    from: [{ y: quadrants[2].low, x: 100 }, { y: quadrants[2].high, x: 100 }, Direction.East, "C 1"],
    to: [{ y: quadrants[0].high, x: 149 }, { y: quadrants[0].low, x: 149 }, Direction.West],
  },
  {
    from: [{ y: quadrants[0].high, x: 150 }, { y: quadrants[0].low, x: 150 }, Direction.West, "C 2"],
    to: [{ y: quadrants[2].low, x: 99 }, { y: quadrants[2].high, x: 99 }, Direction.East],
  },
  // Orange border
  {
    from: [{ y: quadrants[1].low, x: 100 }, { y: quadrants[1].high, x: 100 }, Direction.East, "O 1"],
    to: [{ y: 49, x: quadrants[2].low }, { y: 49, x: quadrants[2].high }, Direction.North],
  },
  {
    from: [{ y: 50, x: quadrants[2].low }, { y: 50, x: quadrants[2].high }, Direction.South, "O 2"],
    to: [{ y: quadrants[1].low, x: 99 }, { y: quadrants[1].high, x: 99 }, Direction.West],
  }
]

const diceBordersExampleInput: DiceBorder[] = [
  {
    from: [{ y: 4, x: 12 }, { y: 7, x: 12 }, Direction.East, "X"],
    to: [{ y: 8, x: 15 }, { y: 8, x: 12 }, Direction.South],
  },
  {
    from: [{ y: 12, x: 8 }, { y: 12, x: 11 }, Direction.South, "Y"],
    to: [{ y: 7, x: 3 }, { y: 7, x: 0 }, Direction.North],
  },
  {
    from: [{ y: 3, x: 4 }, { y: 3, x: 7 }, Direction.North, "N"],
    to: [{ y: 0, x: 8 }, { y: 3, x: 8 }, Direction.East],
  }
]

Deno.test("Day 22 - Part 2 - Is on range", () => {
  assertEquals(onRange([{ x: 0, y: 50 }, { x: 0, y: 99 }], { x: 0, y: 66 }), true)
})

Deno.test("Day 22 - Part 2 - Is on lower boundary of range", () => {
  assertEquals(onRange([{ x: 0, y: 50 }, { x: 0, y: 99 }], { x: 0, y: 50 }), true)
})

Deno.test("Day 22 - Part 2 - Is on higher boundary of range", () => {
  assertEquals(onRange([{ x: 0, y: 50 }, { x: 0, y: 99 }], { x: 0, y: 99 }), true)
})

Deno.test("Day 22 - Part 2 - Is not on range", () => {
  assertEquals(onRange([{ x: 0, y: 50 }, { x: 0, y: 99 }], { x: 0, y: 5 }), false)
})

Deno.test("Day 22 - Part 2 - Is not on range, just outside lower boundary", () => {
  assertEquals(onRange([{ x: 0, y: 50 }, { x: 0, y: 99 }], { x: 0, y: 49 }), false)
})

Deno.test("Day 22 - Part 2 - Is not on range, just outside higher boundary", () => {
  assertEquals(onRange([{ x: 0, y: 50 }, { x: 0, y: 99 }], { x: 0, y: 100 }), false)
})

Deno.test("Day 22 - Part 2 - Is on range, x", () => {
  assertEquals(onRange([{ x: 5, y: 50 }, { x: 10, y: 50 }], { x: 5, y: 50 }), true)
})

Deno.test("Day 22 - Part 2 - x is in range, y is not", () => {
  assertEquals(onRange([{ x: 5, y: 50 }, { x: 10, y: 50 }], { x: 5, y: 51 }), false)
})

Deno.test("Day 22 - Part 2 - Moving across dice, crimson border", () => {
  assertEquals(moveAcrossDice({ y: 39, x: 150 }, Direction.West, diceBordersFileInput), { coordinate: { y: 110, x: 99 }, direction: Direction.East })
})

Deno.test("Day 22 - Part 2 - Moving across dice, orange border, lower bound", () => {
  assertEquals(moveAcrossDice({ y: 50, x: 100 }, Direction.South, diceBordersFileInput), { coordinate: { y: 50, x: 99 }, direction: Direction.West })
})

Deno.test("Day 22 - Part 2 - Moving across dice, orange border, higher bound", () => {
  assertEquals(moveAcrossDice({ y: 50, x: 149 }, Direction.South, diceBordersFileInput), { coordinate: { y: 99, x: 99 }, direction: Direction.West })
})

Deno.test("Day 22 - Part 2 - Moving across dice, dark blue border, lower bound", () => {
  assertEquals(moveAcrossDice({ y: 99, x: 0 }, Direction.North, diceBordersFileInput), { coordinate: { y: 50, x: 50 }, direction: Direction.East })
})

Deno.test("Day 22 - Part 2 - Moving across dice, dark blue border, higher bound", () => {
  assertEquals(moveAcrossDice({ y: 99, x: 49 }, Direction.North, diceBordersFileInput), { coordinate: { y: 99, x: 50 }, direction: Direction.East })
})

Deno.test("Day 22 - Part 2 - Moving across dice, purple border 1, lower bound", () => {
  assertEquals(moveAcrossDice({ y: 100, x: -1 }, Direction.West, diceBordersFileInput), { coordinate: { y: 49, x: 50 }, direction: Direction.East })
})

Deno.test("Day 22 - Part 2 - Moving across dice, purple border 1, higher bound", () => {
  assertEquals(moveAcrossDice({ y: 149, x: -1 }, Direction.West, diceBordersFileInput), { coordinate: { y: 0, x: 50 }, direction: Direction.East })
})

Deno.test("Day 22 - Part 2 - Moving across dice, purple border 2, lower bound", () => {
  assertEquals(moveAcrossDice({ y: 0, x: 49 }, Direction.West, diceBordersFileInput), { coordinate: { y: 149, x: 0 }, direction: Direction.East })
})

Deno.test("Day 22 - Part 2 - Moving across dice, purple border 2, higher bound", () => {
  assertEquals(moveAcrossDice({ y: 49, x: 49 }, Direction.West, diceBordersFileInput), { coordinate: { y: 100, x: 0 }, direction: Direction.East })
})

Deno.test("Day 22 - Part 2 - Moving across dice, no move necessary", () => {
  assertEquals(moveAcrossDice({ y: 39, x: 60 }, Direction.North, diceBordersFileInput), { coordinate: { y: 39, x: 60 }, direction: Direction.North })
})

Deno.test("Day 22 - Part 2 - Example input", () => {
  assertEquals(solvePart2(exampleInput, { y: 0, x: 8 }, diceBordersExampleInput), 5031)
})

Deno.test("Day 22 - Part 2 - Example input with start marker", () => {
  assertEquals(solvePart2StartMarker(exampleInputWithStartMarker, diceBordersExampleInput), 5031)
})

Deno.test("Day 22 - Part 2 - Example input going up against wall", () => {
  const input = 
`        ...#
        .#..
        #...
        ....
...#..S....#
........#...
..#....#....
..........#.
        ...#....
        .....#..
        .#......
        ......#.

L10
`
  assertEquals(solvePart2StartMarker(input, diceBordersExampleInput), calcScore({ y: 4, x: 6 }, Direction.North))
})

Deno.test("Day 22 - Part 2 - Example input wrap then go against wall", () => {
  const input = 
`        ...#
        .#..
        #...
        ....
...#S......#
........#...
..#....#....
..........#.
        ...#....
        .....#..
        .#......
        ......#.

L10
`
  assertEquals(solvePart2StartMarker(input, diceBordersExampleInput), calcScore({ y: 0, x: 10 }, Direction.East))
})

Deno.test("Day 22 - Part 2 - Example input going up against wall then go right", () => {
  const input = 
`        ...#
        .#..
        #...
        ....
...#..S....#
........#...
..#....#....
..........#.
        ...#....
        .....#..
        .#......
        ......#.

L10R10
`
  assertEquals(solvePart2StartMarker(input, diceBordersExampleInput), calcScore({ y: 4, x: 10 }, Direction.East))
})

Deno.test("Day 22 - Part 2 - File input", () => {
  // Guesses:
  // 135054, too high
  // 16603, too low
  assertEquals(solvePart2(fileInput, { y: 0, x: 50 }, diceBordersFileInput), 0)
})
