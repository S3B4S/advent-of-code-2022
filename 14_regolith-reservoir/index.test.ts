import { assertEquals } from "deps"
import { solvePart1, solvePart2 } from "./index.ts"

const exampleInput = `
498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9
`

const fileInput = Deno.readTextFileSync('./14_regolith-reservoir/input.txt')

Deno.test("Day 14 - Part 1 - Example input", {only: true}, () => {
  assertEquals(0, solvePart1(exampleInput))
})

Deno.test("Day 14 - Part 1 - File input", () => {
  assertEquals(0, solvePart1(fileInput))
})

Deno.test("Day 14 - Part 2 - Example input", () => {
  assertEquals(0, solvePart2(exampleInput))
})

Deno.test("Day 14 - Part 2 - File input", () => {
  assertEquals(0, solvePart2(fileInput))
})
