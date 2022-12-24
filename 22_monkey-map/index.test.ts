import { assertEquals } from "deps"
import { solvePart1, solvePart2 } from "./index.ts"

const exampleInput = `
...#
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

const fileInput = Deno.readTextFileSync('./22_monkey-map/input.txt')

Deno.test("Day 22 - Part 1 - Example input", () => {
  assertEquals(0, solvePart1(exampleInput))
})

Deno.test("Day 22 - Part 1 - File input", () => {
  assertEquals(0, solvePart1(fileInput))
})

Deno.test("Day 22 - Part 2 - Example input", () => {
  assertEquals(0, solvePart2(exampleInput))
})

Deno.test("Day 22 - Part 2 - File input", () => {
  assertEquals(0, solvePart2(fileInput))
})
