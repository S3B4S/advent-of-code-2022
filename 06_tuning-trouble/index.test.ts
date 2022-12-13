import { assertEquals } from "deps"
import { solve } from "./index.ts"

const exampleInput = "mjqjpqmgbljsphdztnvjfqwrcgsmlb"

const fileInput = Deno.readTextFileSync('./06_tuning-trouble/input.txt')

Deno.test("Day 06 - Part 1 - Example input", () => {
  assertEquals(7, solve(exampleInput, 4))
})

Deno.test("Day 06 - Part 1 - File input", () => {
  assertEquals(1876, solve(fileInput, 4))
})

Deno.test("Day 06 - Part 2 - Example input", () => {
  assertEquals(19, solve(exampleInput, 14))
})

Deno.test("Day 06 - Part 2 - File input", () => {
  assertEquals(2202, solve(fileInput, 14))
})
