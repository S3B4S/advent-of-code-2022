import { assertEquals } from "deps"
import { areListsInRightOrder, parseList, solvePart1, solvePart2 } from "./index.ts"

const exampleInput = `
[1,1,3,1,1]
[1,1,5,1,1]

[[1],[2,3,4]]
[[1],4]

[9]
[[8,7,6]]

[[4,4],4,4]
[[4,4],4,4,4]

[7,7,7,7]
[7,7,7]

[]
[3]

[[[]]]
[[]]

[1,[2,[3,[4,[5,6,7]]]],8,9]
[1,[2,[3,[4,[5,6,0]]]],8,9]
`

const fileInput = Deno.readTextFileSync('./13_distress-signal/input.txt')

Deno.test("Day 13 - Part 1 - Parsing 1", () => {
  assertEquals([1,1,3,1,1], parseList("[1,1,3,1,1]")[0])
})

Deno.test("Day 13 - Part 1 - Parsing 2", () => {
  assertEquals([[1],[2,3,4]], parseList("[[1],[2,3,4]]")[0])
})

Deno.test("Day 13 - Part 1 - Parsing 3", () => {
  assertEquals([[8,7,6]], parseList("[[8,7,6]]")[0])
})

Deno.test("Day 13 - Part 1 - Parsing 4", () => {
  assertEquals([[8, 7, 100], [5, [6]]], parseList("[[8,7,100],[5,[6]]]")[0])
})

Deno.test("Day 13 - Part 1 - Compare 1", () => {
  assertEquals(true, areListsInRightOrder([1,1,3,1,1], [1,1,5,1,1]))
})

Deno.test("Day 13 - Part 1 - Compare 2", () => {
  assertEquals(true, areListsInRightOrder([[1],[2,3,4]], [[1],4]))
})

Deno.test("Day 13 - Part 1 - Compare 3", () => {
  assertEquals(false, areListsInRightOrder([9], [[8,7,6]]))
})

Deno.test("Day 13 - Part 1 - Compare 4 - empty list", () => {
  assertEquals(true, areListsInRightOrder([], [3]))
})

Deno.test("Day 13 - Part 1 - Compare 4 - empty list 2", () => {
  assertEquals(false, areListsInRightOrder([3], []))
})

Deno.test("Day 13 - Part 1 - Example input", () => {
  assertEquals(13, solvePart1(exampleInput))
})

Deno.test("Day 13 - Part 1 - File input", () => {
  assertEquals(6240, solvePart1(fileInput))
})

Deno.test("Day 13 - Part 2 - Example input", () => {
  assertEquals(140, solvePart2(exampleInput))
})

Deno.test("Day 13 - Part 2 - File input", () => {
  assertEquals(23142, solvePart2(fileInput))
})
