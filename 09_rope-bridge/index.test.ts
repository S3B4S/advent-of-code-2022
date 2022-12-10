import { assertEquals } from "../deps.ts"
import { solvePart1, solvePart2 } from "./index.ts"

const exampleInput = `
R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2
`

const exampleInput2 = `
R 5
U 8
L 8
D 3
R 17
D 10
L 25
U 20
`

const fileInput = Deno.readTextFileSync('./09_rope-bridge/input.txt')

Deno.test("Day 10 - Part 1 - Example input", () => {
  assertEquals(13, solvePart1(exampleInput))
})

Deno.test("Day 10 - Part 1 - File input", () => {
  assertEquals(6090, solvePart1(fileInput))
})

Deno.test("Day 10 - Part 2 - Example input", () => {
  assertEquals(1, solvePart2(exampleInput, 10))
})

Deno.test("Day 10 - Part 2 - Example input 2", () => {
  assertEquals(36, solvePart2(exampleInput2, 10))
})

Deno.test("Day 10 - Part 2 - File input", () => {
  assertEquals(2566, solvePart2(fileInput, 10))
})
