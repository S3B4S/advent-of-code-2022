import { assertEquals } from "deps"
import { solvePart1, solvePart2 } from "./index.ts"

const exampleInput = `
498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9
`

const fileInput = Deno.readTextFileSync('./14_regolith-reservoir/input.txt')

Deno.test("Day 14 - Part 1 - Example input", () => {
  assertEquals(24, solvePart1(exampleInput))
})

Deno.test("Day 14 - Part 1 - Example input 2 - Falls off to abyss on the right", () => {
  assertEquals(100, solvePart1("496,97 -> 496,99 -> 488,99 -> 488,103 -> 508,103 -> 508,99 -> 502,99 -> 502,97"))
})

Deno.test("Day 14 - Part 1 - Example input with loops", () => {
  assertEquals(100, solvePart1("496,97 -> 496,99 -> 496,97 -> 496,99 -> 496,97 -> 496,99 -> 488,99 -> 488,103 -> 508,103 -> 508,99 -> 502,99 -> 502,97"))
})

Deno.test("Day 14 - Part 1 - Build trap that misses the sand", () => {
  assertEquals(0, solvePart1("530,50 -> 530,53 -> 523,53 -> 523,57 -> 541,57 -> 541,53 -> 534,53 -> 534,50"))
})

Deno.test("Day 14 - Part 1 - Longer rock building",() => {
  assertEquals(135, solvePart1("491,23 -> 491,15 -> 491,23 -> 493,23 -> 493,18 -> 493,23 -> 495,23 -> 495,15 -> 495,23 -> 497,23 -> 497,15 -> 497,23 -> 499,23 -> 499,18 -> 499,23 -> 501,23 -> 501,14 -> 501,23 -> 503,23 -> 503,21 -> 503,23 -> 505,23 -> 505,19 -> 505,23 -> 507,23 -> 507,15 -> 507,23"))
})

Deno.test("Day 14 - Part 1 - Two platforms not catching any sand", () => {
  assertEquals(0, solvePart1(`
    480,2 -> 490,2
    510,2 -> 520,2
  `))
})

Deno.test("Day 14 - Part 1 - File input", () => {
  assertEquals(1406, solvePart1(fileInput))
})

Deno.test("Day 14 - Part 2 - Example input", () => {
  assertEquals(93, solvePart2(exampleInput))
})

Deno.test("Day 14 - Part 2 - File input", () => {
  assertEquals(20870, solvePart2(fileInput))
})
