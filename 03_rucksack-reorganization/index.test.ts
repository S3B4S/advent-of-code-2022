import {
  assertEquals,
} from "https://deno.land/std/testing/asserts.ts"
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

Deno.test("Input file part 1", () => {
  assertEquals(8252, solvePart1(Deno.readTextFileSync('./03_rucksack-reorganization/input.txt')))
})

Deno.test("Test part 2 example input", () => {
  assertEquals(70, solvePart2(exampleInput))
})

Deno.test("Test part 2 example input 2", () => {
  assertEquals(40, solvePart2(exampleInput2))
})

Deno.test("Input file part 2", () => {
  assertEquals(2828, solvePart2(Deno.readTextFileSync('./03_rucksack-reorganization/input.txt')))
})
