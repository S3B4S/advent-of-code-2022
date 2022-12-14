import { assertEquals, monpar } from "deps"
import { parseLine, parseInput, solvePart1, solvePart2 } from "./index.ts"
const { unpack } = monpar

const exampleInput = `
Sensor at x=2, y=18: closest beacon is at x=-2, y=15
Sensor at x=9, y=16: closest beacon is at x=10, y=16
Sensor at x=13, y=2: closest beacon is at x=15, y=3
Sensor at x=12, y=14: closest beacon is at x=10, y=16
Sensor at x=10, y=20: closest beacon is at x=10, y=16
Sensor at x=14, y=17: closest beacon is at x=10, y=16
Sensor at x=8, y=7: closest beacon is at x=2, y=10
Sensor at x=2, y=0: closest beacon is at x=2, y=10
Sensor at x=0, y=11: closest beacon is at x=2, y=10
Sensor at x=20, y=14: closest beacon is at x=25, y=17
Sensor at x=17, y=20: closest beacon is at x=21, y=22
Sensor at x=16, y=7: closest beacon is at x=15, y=3
Sensor at x=14, y=3: closest beacon is at x=15, y=3
Sensor at x=20, y=1: closest beacon is at x=15, y=3
`

const fileInput = Deno.readTextFileSync('./15_beacon-exclusion-zone/input.txt')

Deno.test("Day 15 - Parse input line 1", () => {
  assertEquals({ sensor: { x: 2, y: 18 }, beacon: { x: -2, y: 15 }, manhattanDistance: 7 }, unpack(parseLine)("Sensor at x=2, y=18: closest beacon is at x=-2, y=15"))
})

Deno.test("Day 15 - Parse input line 2", () => {
  assertEquals({ sensor: { x: 2, y: 18 }, beacon: { x: -2, y: -15 }, manhattanDistance: 37 }, unpack(parseLine)("Sensor at x=2, y=18: closest beacon is at x=-2, y=-15"))
})

Deno.test("Day 15 - Parse input line 3", () => {
  assertEquals({ sensor: { x: 2, y: 18 }, beacon: { x: 2, y: 15 }, manhattanDistance: 3 }, unpack(parseLine)("Sensor at x=2, y=18: closest beacon is at x=2, y=15"))
})

Deno.test("Day 15 - Parse input lines", () => {
  const input = `
Sensor at x=2, y=18: closest beacon is at x=2, y=15
Sensor at x=10, y=20: closest beacon is at x=10, y=16
  `
  assertEquals([
    { sensor: { x: 2, y: 18 }, beacon: { x: 2, y: 15 }, manhattanDistance: 3 },
    { sensor: { x: 10, y: 20 }, beacon: { x: 10, y: 16 }, manhattanDistance: 4 },
  ], unpack(parseInput)(input))
})

Deno.test("Day 15 - Part 1 - Example input", () => {
  assertEquals(26, solvePart1(exampleInput, 10))
})

Deno.test("Day 15 - Part 1 - File input", () => {
  assertEquals(4725496, solvePart1(fileInput, 2000000))
})

// Deno.test("Day 15 - Part 2 - Example input", () => {
//   assertEquals(0, solvePart2(exampleInput))
// })

// Deno.test("Day 15 - Part 2 - File input", () => {
//   assertEquals(0, solvePart2(fileInput))
// })
