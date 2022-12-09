import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts"
import { solvePart1, solvePart2 } from "./index.ts"

const exampleInput = `

`

const fileInput = Deno.readTextFileSync('./day-17/input.txt')

Deno.test("Day 17 - Part 1 - Example input", () => {
  assertEquals(0, solvePart1(exampleInput))
})

Deno.test("Day 17 - Part 1 - File input", () => {
  assertEquals(0, solvePart1(fileInput))
})

Deno.test("Day 17 - Part 2 - File input", () => {
  assertEquals(0, solvePart2(fileInput))
})
