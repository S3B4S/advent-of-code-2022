import { assertEquals } from "../deps.ts"
import { isAtMostOneElevated, solvePart1, solvePart2 } from "./index.ts"

const exampleInput = `
Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi
`

const loop = `
Saaaabuv
aaaaactw
aaaaadsx
jihgfery
klmnopqE
`

const fileInput = Deno.readTextFileSync('./day-12/input.txt')

Deno.test("Day 12 - Is at most one elevated 1", () => {
  assertEquals(true, isAtMostOneElevated("b", "c"))
})

Deno.test("Day 12 - Is at most one elevated 2", () => {
  assertEquals(true, isAtMostOneElevated("b", "b"))
})

Deno.test("Day 12 - Is at most one elevated 3", () => {
  assertEquals(true, isAtMostOneElevated("b", "a"))
})

Deno.test("Day 12 - Is at most one elevated 4", () => {
  assertEquals(true, isAtMostOneElevated("S", "a"))
})

Deno.test("Day 12 - Is at most one elevated 5", () => {
  assertEquals(true, isAtMostOneElevated("S", "b"))
})

Deno.test("Day 12 - Is at most one elevated 6", () => {
  assertEquals(false, isAtMostOneElevated("S", "c"))
})

Deno.test("Day 12 - Is at most one elevated 7", () => {
  assertEquals(true, isAtMostOneElevated("y", "E"))
})

Deno.test("Day 12 - Is at most one elevated 8", () => {
  assertEquals(false, isAtMostOneElevated("x", "E"))
})

Deno.test("Day 12 - Is at most one elevated 9", () => {
  assertEquals(false, isAtMostOneElevated("S", "E"))
})

Deno.test("Day 12 - Is at most one elevated 10", () => {
  assertEquals(true, isAtMostOneElevated("h", "b"))
})

Deno.test("Day 12 - Part 1 - Example input", () => {
  assertEquals(31, solvePart1(exampleInput))
})

Deno.test("Day 12 - Part 1 - Example input with loop of a's", () => {
  assertEquals(29, solvePart1(loop))
})

Deno.test("Day 12 - Part 1 - File input", () => {
  assertEquals(449, solvePart1(fileInput))
})

Deno.test("Day 12 - Part 2 - Example input", () => {
  assertEquals(29, solvePart2(exampleInput))
})

Deno.test("Day 12 - Part 2 - File input", () => {
  assertEquals(443, solvePart2(fileInput))
})
