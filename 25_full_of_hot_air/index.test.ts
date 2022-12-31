import { assertEquals } from "deps"
import { solvePart1, solvePart2 } from "./index.ts"

const exampleInput = `
1=-0-2
12111
2=0=
21
2=01
111
20012
112
1=-1=
1-12
12
1=
122
`

const fileInput = Deno.readTextFileSync('./25_full_of_hot_air/input.txt')

Deno.test("Day 25 - Part 1 - Example input", () => {
  assertEquals(0, solvePart1(exampleInput))
})

Deno.test("Day 25 - Part 1 - File input", () => {
  assertEquals(0, solvePart1(fileInput))
})

Deno.test("Day 25 - Part 2 - Example input", () => {
  assertEquals(0, solvePart2(exampleInput))
})

Deno.test("Day 25 - Part 2 - File input", () => {
  assertEquals(0, solvePart2(fileInput))
})
