import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts"
import { solvePart1, solvePart2 } from "./index.ts"

const exampleInput = `
vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw
`

const exampleInput2 = `
QJRBMDMtRDCtJzBtJMfjNjhwvmNDvwjLVVgh
TPSNNPZGTjgmSmvfjL
bPlpZZbpsTlTsWprpGFCJtRtzMNdMMBBcWnJQB
`

const fileInput = Deno.readTextFileSync('./03_rucksack-reorganization/input.txt')

Deno.test("Day 03 - Part 1 - File input", () => {
  assertEquals(8252, solvePart1(fileInput))
})

Deno.test("Day 03 - Part 2 - Example input 1", () => {
  assertEquals(70, solvePart2(exampleInput))
})

Deno.test("Day 03 - Part 2 - Example input 2", () => {
  assertEquals(40, solvePart2(exampleInput2))
})

Deno.test("Day 03 - Part 2 - File input", () => {
  assertEquals(2828, solvePart2(fileInput))
})
