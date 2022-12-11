import { assertEquals } from "../deps.ts"
import { solvePart1, solvePart2 } from "./index.ts"

const exampleInput = `
  Monkey 0:
    Starting items: 79, 98
    Operation: new = old * 19
    Test: divisible by 23
      If true: throw to monkey 2
      If false: throw to monkey 3

Monkey 1:
  Starting items: 54, 65, 75, 74
  Operation: new = old + 6
  Test: divisible by 19
    If true: throw to monkey 2
    If false: throw to monkey 0

Monkey 2:
  Starting items: 79, 60, 97
  Operation: new = old * old
  Test: divisible by 13
    If true: throw to monkey 1
    If false: throw to monkey 3

Monkey 3:
  Starting items: 74
  Operation: new = old + 3
  Test: divisible by 17
    If true: throw to monkey 0
    If false: throw to monkey 1
`

const fileInput = Deno.readTextFileSync('./day-11/input.txt')

Deno.test("Day 11 - Part 1 - Example input", () => {
  assertEquals(10605, solvePart1(exampleInput))
})

Deno.test("Day 11 - Part 1 - File input", () => {
  assertEquals(54752, solvePart1(fileInput))
})

Deno.test("Day 11 - Part 2 - Example input", () => {
  assertEquals(2713310158, solvePart2(exampleInput))
})

Deno.test("Day 11 - Part 2 - File input", () => {
  assertEquals(13606755504, solvePart2(fileInput))
})
