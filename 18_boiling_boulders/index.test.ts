import { assertEquals } from "deps"
import { solvePart1, solvePart2 } from "./index.ts"

const exampleInput = `
2,2,2
1,2,2
3,2,2
2,1,2
2,3,2
2,2,1
2,2,3
2,2,4
2,2,6
1,2,5
3,2,5
2,1,5
2,3,5
`

const fileInput = Deno.readTextFileSync('./18_boiling_boulders/input.txt')

Deno.test("Day 18 - Part 1 - Example input", () => {
  assertEquals(64, solvePart1(exampleInput))
})

Deno.test("Day 18 - Part 1 - File input", () => {
  assertEquals(4282, solvePart1(fileInput))
})

Deno.test("Day 18 - Part 2 - Example input", () => {
  assertEquals(0, solvePart2(exampleInput))
})

Deno.test("Day 18 - Part 2 - File input", () => {
  assertEquals(0, solvePart2(fileInput))
})
