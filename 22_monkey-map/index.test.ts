import { assertEquals } from "deps"
import { 
  calcScore,
  solvePart1,
  solvePart1StartMarker,
  solvePart2,
  Direction,
  onRange,
  solvePart2StartMarker,
  takePortal,
  leavesAt,
  arrivesAt,
  outerBorder,
  Quadrant,
  PortalJumps,
  innerBorder,
} from "./index.ts"

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

const exampleInputShorterInstructions = 
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

const fileInput = Deno.readTextFileSync('./22_monkey-map/input.txt')

Deno.test("Day 22 - Part 1 - Wrap around vertically", () => {
  assertEquals(solvePart1(exampleInputShorterInstructions, { y: 4, x: 0 }), 6005)
})

Deno.test("Day 22 - Part 1 - Wrap around horizontally against wall", () => {
  assertEquals(solvePart1(exampleInputShorterInstructions, { y: 7, x: 3 }), 8017)
})

Deno.test("Day 22 - Part 1 - Wrap around horizontally", () => {
  const input = `........#...

3
`
  assertEquals(solvePart1(input, { y: 0, x: 9 }), 1004)
})

Deno.test("Day 22 - Part 1 - Wrap around horizontally against wall", () => {
  const input = 
`#.......#...

100
`

  assertEquals(solvePart1(input, { y: 0, x: 9 }), 1048)
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

const exampleInputQuadrants: (Quadrant | undefined)[] = [
  undefined, // To make the ids line up with the index
  { id: 1, y: 0, x: 8, width: 4, height: 4 },
  { id: 2, y: 4, x: 0, width: 4, height: 4 },
  { id: 3, y: 4, x: 4, width: 4, height: 4 },
  { id: 4, y: 4, x: 8, width: 4, height: 4 },
  { id: 5, y: 8, x: 8, width: 4, height: 4 },
  { id: 6, y: 8, x: 12, width: 4, height: 4 },
]

const portalsExampleInput: PortalJumps[] = [
  {
    blue: leavesAt(exampleInputQuadrants[3]!, Direction.North),
    orange: arrivesAt(exampleInputQuadrants[1]!, Direction.West),
  },
  {
    blue: leavesAt(exampleInputQuadrants[4]!, Direction.East),
    orange: arrivesAt(exampleInputQuadrants[6]!, Direction.North, true),
  },
  {
    blue: leavesAt(exampleInputQuadrants[5]!, Direction.South),
    orange: arrivesAt(exampleInputQuadrants[2]!, Direction.South, true),
  },
  {
    blue: leavesAt(exampleInputQuadrants[1]!, Direction.North),
    orange: arrivesAt(exampleInputQuadrants[2]!, Direction.North, true),
  }
]

const fileInputQuadrants: Quadrant[] = [
  { id: 0, y: 150, x: 0, width: 50, height: 50 },
  { id: 1, y: 100, x: 0, width: 50, height: 50 },
  { id: 2, y: 100, x: 50, width: 50, height: 50 },
  { id: 3, y: 50, x: 50, width: 50, height: 50 },
  { id: 4, y: 0, x: 50, width: 50, height: 50 },
  { id: 5, y: 0, x: 100, width: 50, height: 50 },
]

const portalsFileInput: PortalJumps[] = [
  {
    blue: leavesAt(fileInputQuadrants[1], Direction.North),
    orange: arrivesAt(fileInputQuadrants[3], Direction.West)
  },
  {
    blue: leavesAt(fileInputQuadrants[3], Direction.West),
    orange: arrivesAt(fileInputQuadrants[1], Direction.North)
  },
  {
    blue: leavesAt(fileInputQuadrants[4], Direction.West),
    orange: arrivesAt(fileInputQuadrants[1], Direction.West, true)
  },
  {
    blue: leavesAt(fileInputQuadrants[4], Direction.North),
    orange: arrivesAt(fileInputQuadrants[0], Direction.West)
  },
  {
    blue: leavesAt(fileInputQuadrants[5], Direction.North),
    orange: arrivesAt(fileInputQuadrants[0], Direction.South)
  },
  {
    blue: leavesAt(fileInputQuadrants[5], Direction.East),
    orange: arrivesAt(fileInputQuadrants[2], Direction.East, true)
  },
  {
    blue: leavesAt(fileInputQuadrants[5], Direction.South),
    orange: arrivesAt(fileInputQuadrants[3], Direction.East),
  },
  {
    blue: leavesAt(fileInputQuadrants[3], Direction.East),
    orange: arrivesAt(fileInputQuadrants[5], Direction.South),
  },
  {
    blue: leavesAt(fileInputQuadrants[2], Direction.East),
    orange: arrivesAt(fileInputQuadrants[5], Direction.East, true),
  },
  {
    blue: leavesAt(fileInputQuadrants[2], Direction.South),
    orange: arrivesAt(fileInputQuadrants[0], Direction.East),
  },
  {
    blue: leavesAt(fileInputQuadrants[0], Direction.East),
    orange: arrivesAt(fileInputQuadrants[2], Direction.South),
  },
  {
    blue: leavesAt(fileInputQuadrants[0], Direction.South),
    orange: arrivesAt(fileInputQuadrants[5], Direction.North),
  },
  {
    blue: leavesAt(fileInputQuadrants[0], Direction.West),
    orange: arrivesAt(fileInputQuadrants[4], Direction.North),
  },
  {
    blue: leavesAt(fileInputQuadrants[1], Direction.West),
    orange: arrivesAt(fileInputQuadrants[4], Direction.West, true),
  },
]

Deno.test("Day 22 - Part 2 - Generate north outer border", () => {
  assertEquals(outerBorder(exampleInputQuadrants[1]!, Direction.North), [
    { y: -1, x: 8 }, { y: -1, x: 9 }, { y: -1, x: 10 }, { y: -1, x: 11 },
  ])
})

Deno.test("Day 22 - Part 2 - Generate north inner border", () => {
  assertEquals(innerBorder(exampleInputQuadrants[1]!, Direction.North), [
    { y: 0, x: 8 }, { y: 0, x: 9 }, { y: 0, x: 10 }, { y: 0, x: 11 },
  ])
})

Deno.test("Day 22 - Part 2 - Generate east outer border", () => {
  assertEquals(outerBorder(exampleInputQuadrants[1]!, Direction.East), [
    { y: 0, x: 12 }, { y: 1, x: 12 }, { y: 2, x: 12 }, { y: 3, x: 12 },
  ])
})

Deno.test("Day 22 - Part 2 - Generate east inner border", () => {
  assertEquals(innerBorder(exampleInputQuadrants[1]!, Direction.East), [
    { y: 0, x: 11 }, { y: 1, x: 11 }, { y: 2, x: 11 }, { y: 3, x: 11 },
  ])
})

Deno.test("Day 22 - Part 2 - Generate south outer border", () => {
  assertEquals(outerBorder(exampleInputQuadrants[1]!, Direction.South), [
    { y: 4, x: 8 }, { y: 4, x: 9 }, { y: 4, x: 10 }, { y: 4, x: 11 },
  ])
})

Deno.test("Day 22 - Part 2 - Generate west outer border", () => {
  assertEquals(outerBorder(exampleInputQuadrants[1]!, Direction.West), [
    { y: 0, x: 7 }, { y: 1, x: 7 }, { y: 2, x: 7 }, { y: 3, x: 7 },
  ])
})

Deno.test("Day 22 - Part 2 - Generate north outer border reverse", () => {
  assertEquals(outerBorder(exampleInputQuadrants[1]!, Direction.North, true), [
    { y: -1, x: 11 }, { y: -1, x: 10 }, { y: -1, x: 9 }, { y: -1, x: 8 },
  ])
})

Deno.test("Day 22 - Part 2 - Generate east outer border reverse", () => {
  assertEquals(outerBorder(exampleInputQuadrants[1]!, Direction.East, true), [
    { y: 3, x: 12 }, { y: 2, x: 12 }, { y: 1, x: 12 }, { y: 0, x: 12 },
  ])
})

Deno.test("Day 22 - Part 2 - Generate south outer border reverse", () => {
  assertEquals(outerBorder(exampleInputQuadrants[1]!, Direction.South, true), [
    { y: 4, x: 11 }, { y: 4, x: 10 }, { y: 4, x: 9 }, { y: 4, x: 8 },
  ])
})

Deno.test("Day 22 - Part 2 - Generate west outer border reverse", () => {
  assertEquals(outerBorder(exampleInputQuadrants[1]!, Direction.West, true), [
    { y: 3, x: 7 }, { y: 2, x: 7 }, { y: 1, x: 7 }, { y: 0, x: 7 },
  ])
})

Deno.test("Day 22 - Calculate score", () => {
  assertEquals(calcScore({ y: 5, x: 7 }, Direction.East), 6032)
})

Deno.test("Day 22 - Calculate score 2", () => {
  assertEquals(calcScore({ y: 4, x: 6 }, Direction.North), 5031)
})

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
  assertEquals(takePortal({ y: 39, x: 150 }, Direction.East, portalsFileInput), { coordinate: { y: 110, x: 99 }, direction: Direction.West })
})

Deno.test("Day 22 - Part 2 - Moving across dice, orange border, lower bound", () => {
  assertEquals(takePortal({ y: 50, x: 100 }, Direction.South, portalsFileInput), { coordinate: { y: 50, x: 99 }, direction: Direction.West })
})

Deno.test("Day 22 - Part 2 - Moving across dice, orange border, higher bound", () => {
  assertEquals(takePortal({ y: 50, x: 149 }, Direction.South, portalsFileInput), { coordinate: { y: 99, x: 99 }, direction: Direction.West })
})

Deno.test("Day 22 - Part 2 - Moving across dice, dark blue border, lower bound", () => {
  assertEquals(takePortal({ y: 99, x: 0 }, Direction.North, portalsFileInput), { coordinate: { y: 50, x: 50 }, direction: Direction.East })
})

Deno.test("Day 22 - Part 2 - Moving across dice, dark blue border, higher bound", () => {
  assertEquals(takePortal({ y: 99, x: 49 }, Direction.North, portalsFileInput), { coordinate: { y: 99, x: 50 }, direction: Direction.East })
})

Deno.test("Day 22 - Part 2 - Moving across dice, purple border 1, lower bound", () => {
  assertEquals(takePortal({ y: 100, x: -1 }, Direction.West, portalsFileInput), { coordinate: { y: 49, x: 50 }, direction: Direction.East })
})

Deno.test("Day 22 - Part 2 - Moving across dice, purple border 1, higher bound", () => {
  assertEquals(takePortal({ y: 149, x: -1 }, Direction.West, portalsFileInput), { coordinate: { y: 0, x: 50 }, direction: Direction.East })
})

Deno.test("Day 22 - Part 2 - Moving across dice, purple border 2, lower bound", () => {
  assertEquals(takePortal({ y: 0, x: 49 }, Direction.West, portalsFileInput), { coordinate: { y: 149, x: 0 }, direction: Direction.East })
})

Deno.test("Day 22 - Part 2 - Moving across dice, purple border 2, higher bound", () => {
  assertEquals(takePortal({ y: 49, x: 49 }, Direction.West, portalsFileInput), { coordinate: { y: 100, x: 0 }, direction: Direction.East })
})

Deno.test("Day 22 - Part 2 - Moving across dice, no move necessary", () => {
  assertEquals(takePortal({ y: 39, x: 60 }, Direction.North, portalsFileInput), { coordinate: { y: 39, x: 60 }, direction: Direction.North })
})

Deno.test("Day 22 - Part 2 - Example input", () => {
  assertEquals(solvePart2(exampleInput, { y: 0, x: 8 }, portalsExampleInput), 5031)
})

Deno.test("Day 22 - Part 2 - Example input with start marker", () => {
  const input = 
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
  assertEquals(solvePart2StartMarker(input, portalsExampleInput), 5031)
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
  assertEquals(solvePart2StartMarker(input, portalsExampleInput), calcScore({ y: 4, x: 6 }, Direction.North))
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
  assertEquals(solvePart2StartMarker(input, portalsExampleInput), calcScore({ y: 0, x: 10 }, Direction.East))
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
  assertEquals(solvePart2StartMarker(input, portalsExampleInput), calcScore({ y: 4, x: 10 }, Direction.East))
})

Deno.test("Day 22 - Part 2 - Example input trip", () => {
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

L10R10R1LL1RR10L3
`
  assertEquals(solvePart2StartMarker(input, portalsExampleInput), calcScore({ y: 8, x: 13 }, Direction.South))
})

Deno.test("Day 22 - Part 2 - Example input trip 2", () => {
  const input = 
`        ...#
        .#..
        #...
        ....
...#.......#
........#...
..#....#..S.
..........#.
        ...#....
        .....#..
        .#......
        ......#.

3
`
  assertEquals(solvePart2StartMarker(input, portalsExampleInput), calcScore({ y: 8, x: 13 }, Direction.South))
})

Deno.test("Day 22 - Part 2 - Example input trip 3", () => {
  const input = 
`        ...#
        .#..
        #...
        ....
...#.......#
........#.S.
..#....#....
..........#.
        ...#....
        .....#..
        .#......
        ......#.

L8
`
  assertEquals(solvePart2StartMarker(input, portalsExampleInput), calcScore({ y: 6, x: 1 }, Direction.South))
})

Deno.test("Day 22 - Part 2 - File input", () => {
  assertEquals(solvePart2(fileInput, { y: 0, x: 50 }, portalsFileInput), 55267)
})
