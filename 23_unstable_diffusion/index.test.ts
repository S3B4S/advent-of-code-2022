import { assertEquals } from "deps"
import { solvePart1, solvePart2 } from "./index.ts"

const smallerExampleInput = `
.....
..##.
..#..
.....
..##.
.....
`

const exampleInput = `
....#..
..###.#
#...#.#
.#...##
#.###..
##.#.##
.#..#..
`

const fileInput = Deno.readTextFileSync('./23_unstable_diffusion/input.txt')

Deno.test("Day 23 - Part 1 - Smaller example input" , () => {
  assertEquals(110, solvePart1(smallerExampleInput))
})

Deno.test("Day 23 - Part 1 - Example input", () => {
  assertEquals(110, solvePart1(exampleInput))
})

Deno.test("Day 23 - Part 1 - File input", () => {
  assertEquals(4249, solvePart1(fileInput))
})

Deno.test("Day 23 - Part 2 - Example input", () => {
  assertEquals(20, solvePart2(exampleInput))
})

Deno.test("Day 23 - Part 2 - File input", () => {
  assertEquals(980, solvePart2(fileInput))
})
