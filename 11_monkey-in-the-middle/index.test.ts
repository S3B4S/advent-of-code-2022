import { assertEquals, monpar } from "../deps.ts"
import { 
  parseMonkeyId,
  parseStartingItems,
  parseOperation,
  parseDivisibleBy,
  parseIfTrue,
  parseIfFalse,
  parseMonkey,
  parseMonkeys,
  Monkey,
} from "./parsing.ts"
import { solvePart1, solvePart2 } from "./index.ts"
const { unpack } = monpar

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

Deno.test("Day 11 - Parsing tests - Monkey id", () => {
  assertEquals(0, unpack(parseMonkeyId)("Monkey 0:"))
})

Deno.test("Day 11 - Parsing tests - Starting items, 1 elements", () => {
  assertEquals([74], unpack(parseStartingItems)("Starting items: 74"))
})

Deno.test("Day 11 - Parsing tests - Starting items, 4 elements", () => {
  assertEquals([54, 65, 75, 74], unpack(parseStartingItems)("Starting items: 54, 65, 75, 74"))
})

Deno.test("Day 11 - Parsing tests - Operation +", () => {
  assertEquals(4, unpack(parseOperation)("Operation: new = old + 3")!(1))
})

Deno.test("Day 11 - Parsing tests - Operation *", () => {
  assertEquals(10, unpack(parseOperation)("Operation: new = old * 10")!(1))
})

Deno.test("Day 11 - Parsing tests - Operation * old", () => {
  assertEquals(16, unpack(parseOperation)("Operation: new = old * old")!(4))
})

Deno.test("Day 11 - Parsing tests - Divisible by", () => {
  assertEquals(17, unpack(parseDivisibleBy)("Test: divisible by 17"))
})

Deno.test("Day 11 - Parsing tests - If true", () => {
  assertEquals(3, unpack(parseIfTrue)("If true: throw to monkey 3"))
})

Deno.test("Day 11 - Parsing tests - If false", () => {
  assertEquals(1, unpack(parseIfFalse)("If false: throw to monkey 1"))
})

Deno.test("Day 11 - Parse monkey block", () => {
  const { operation, ...monkey } = unpack(parseMonkey)(`
    Monkey 0:
      Starting items: 79, 98
      Operation: new = old * 19
      Test: divisible by 23
        If true: throw to monkey 2
        If false: throw to monkey 3
    `.trim()
  )!

  assertEquals({
    id: 0,
    items: [79, 98],
    divisor: 23,
    ifTrue: 2,
    ifFalse: 3,
    amountInspects: 0,
  }, monkey)
  assertEquals(38, operation(2))
})

Deno.test("Day 11 - Parse monkeys", () => {
  const monkeys: Monkey[] = unpack(parseMonkeys)(`
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

`)!

  const ms = monkeys.map(({ operation, ...m}) => m )

  const monkey0 = {
    id: 0,
    items: [79, 98],
    divisor: 23,
    ifTrue: 2,
    ifFalse: 3,
    amountInspects: 0,
  }
  const monkey1 = {
    id: 1,
    items: [54, 65, 75, 74],
    divisor: 19,
    ifTrue: 2,
    ifFalse: 0,
    amountInspects: 0,
  }
  const monkey2 = {
    id: 2,
    items: [79, 68, 97],
    divisor: 13,
    ifTrue: 1,
    ifFalse: 3,
    amountInspects: 0,
  }
  assertEquals(3, monkeys.length)
  assertEquals([monkey0, monkey1, monkey2], ms)
})

const fileInput = Deno.readTextFileSync('./11_monkey-in-the-middle/input.txt')

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
