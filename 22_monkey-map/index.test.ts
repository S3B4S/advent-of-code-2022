import { assertEquals } from "deps"
import { calcScore, solvePart1, solvePart1StartMarker, solvePart2, Direction } from "./index.ts"

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
  assertEquals(6005, solvePart1(exampleInput2, { y: 4, x: 0 }))
})

Deno.test("Day 22 - Part 1 - Wrap around horizontally against wall", () => {
  assertEquals(8017, solvePart1(exampleInput2, { y: 7, x: 3 }))
})

Deno.test("Day 22 - Part 1 - Wrap around horizontally", () => {
  assertEquals(1004, solvePart1(exampleInput3, { y: 0, x: 9 }))
})

Deno.test("Day 22 - Part 1 - Wrap around horizontally against wall", () => {
  assertEquals(1048, solvePart1(exampleInput4, { y: 0, x: 9 }))
})

Deno.test("Day 22 - Part 1 - Give start marker", () => {
  const input = `.....S#...

R1`

  assertEquals(calcScore({ y: 0, x: 5 }, Direction.South), solvePart1StartMarker(input))
})

Deno.test("Day 22 - Part 1 - Example input", () => {
  assertEquals(6032, solvePart1(exampleInput, { y: 0, x: 8 }))
})

Deno.test("Day 22 - Part 1 - File input", () => {
  assertEquals(162186, solvePart1(fileInput, { y: 0, x: 50 }))
})

// Deno.test("Day 22 - Part 2 - Example input", () => {
//   assertEquals(0, solvePart2(exampleInput, { y: 0, x: 8 }))
// })

// Deno.test("Day 22 - Part 2 - File input", () => {
//   assertEquals(0, solvePart2(fileInput, { y: 0, x: 50 }))
// })
