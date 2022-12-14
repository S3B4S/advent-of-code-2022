import { assertEquals } from "deps"
import { solvePart1, solvePart2 } from "./index.ts"

const exampleInput = `

`

const fileInput = Deno.readTextFileSync('./24_blizzard_basin/input.txt')

Deno.test("Day 24 - Part 1 - Example input", () => {
  assertEquals(0, solvePart1(exampleInput))
})

Deno.test("Day 24 - Part 1 - File input", () => {
  assertEquals(0, solvePart1(fileInput))
})

Deno.test("Day 24 - Part 2 - Example input", () => {
  assertEquals(0, solvePart2(exampleInput))
})

Deno.test("Day 24 - Part 2 - File input", () => {
  assertEquals(0, solvePart2(fileInput))
})
