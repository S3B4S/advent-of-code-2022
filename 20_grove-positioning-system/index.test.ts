import { assertEquals } from "deps"
import { solvePart1, solvePart2 } from "./index.ts"

const exampleInput = `
1
2
-3
3
-2
0
4
`

const fileInput = Deno.readTextFileSync('./20_grove-positioning-system/input.txt')

Deno.test("Day 20 - Part 1 - Example input", {only: true}, () => {
  assertEquals(3, solvePart1(exampleInput))
})

Deno.test("Day 20 - Part 1 - File input", () => {
  assertEquals(0, solvePart1(fileInput))
})

Deno.test("Day 20 - Part 2 - Example input", () => {
  assertEquals(0, solvePart2(exampleInput))
})

Deno.test("Day 20 - Part 2 - File input", () => {
  assertEquals(0, solvePart2(fileInput))
})
