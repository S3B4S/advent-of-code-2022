import { assertEquals } from "../deps.ts"
import { solvePart1, solvePart2 } from "./index.ts"

const exampleInput = `
2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8
`

const fileInput = Deno.readTextFileSync('./04_camp-cleanup/input.txt')

Deno.test("Day 04 - Part 1 - Example input", () => {
  assertEquals(2, solvePart1(exampleInput))
})

Deno.test("Day 04 - Part 1 - File input", () => {
  assertEquals(466, solvePart1(fileInput))
})

Deno.test("Day 04 - Part 2 - Example input", () => {
  assertEquals(4, solvePart2(exampleInput))
})

Deno.test("Day 04 - Part 2 - File input", () => {
  assertEquals(865, solvePart2(fileInput))
})
