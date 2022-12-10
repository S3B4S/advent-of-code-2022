import { assertEquals } from "../deps.ts"
import { solvePart1, solvePart2 } from "./index.ts"

const exampleInput = Deno.readTextFileSync('./day-10/large-example-input.txt')
const fileInput = Deno.readTextFileSync('./day-10/input.txt')

Deno.test("Day 10 - Part 1 - Example input", {only: true}, () => {
  assertEquals(13140, solvePart1(exampleInput))
})

Deno.test("Day 10 - Part 1 - File input",{only: true}, () => {
  assertEquals(17840, solvePart1(fileInput))
})

Deno.test("Day 10 - Part 2 - Example input", () => {
  assertEquals(0, solvePart2(exampleInput))
})

Deno.test("Day 10 - Part 2 - File input", () => {
  assertEquals(0, solvePart2(fileInput))
})
