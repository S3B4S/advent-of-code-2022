import { assertEquals } from "deps"
import { solvePart1, solvePart2 } from "./index.ts"

const exampleInput = `
root: pppw + sjmn
dbpl: 5
cczh: sllz + lgvd
zczc: 2
ptdq: humn - dvpt
dvpt: 3
lfqf: 4
humn: 5
ljgn: 2
sjmn: drzm * dbpl
sllz: 4
pppw: cczh / lfqf
lgvd: ljgn * ptdq
drzm: hmdt - zczc
hmdt: 32
`

const fileInput = Deno.readTextFileSync('./21_monkey-math/input.txt')

Deno.test("Day 21 - Part 1 - Example input", () => {
  assertEquals(152, solvePart1(exampleInput))
})

Deno.test("Day 21 - Part 1 - File input", () => {
  assertEquals(158661812617812, solvePart1(fileInput))
})

// Deno.test("Day 21 - Part 2 - Example input", () => {
//   assertEquals(0, solvePart2(exampleInput))
// })

// Deno.test("Day 21 - Part 2 - File input", () => {
//   assertEquals(0, solvePart2(fileInput))
// })
