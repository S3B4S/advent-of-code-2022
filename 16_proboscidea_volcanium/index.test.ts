import { monpar } from 'deps'
import { assertEquals } from "deps"
import { parseLine, solvePart1, solvePart2 } from "./index.ts"
const { unpack } = monpar

const exampleInput = `
Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
Valve BB has flow rate=13; tunnels lead to valves CC, AA
Valve CC has flow rate=2; tunnels lead to valves DD, BB
Valve DD has flow rate=20; tunnels lead to valves CC, AA, EE
Valve EE has flow rate=3; tunnels lead to valves FF, DD
Valve FF has flow rate=0; tunnels lead to valves EE, GG
Valve GG has flow rate=0; tunnels lead to valves FF, HH
Valve HH has flow rate=22; tunnel leads to valve GG
Valve II has flow rate=0; tunnels lead to valves AA, JJ
Valve JJ has flow rate=21; tunnel leads to valve II
`

const fileInput = Deno.readTextFileSync('./16_proboscidea_volcanium/input.txt')

Deno.test("Day 16 - Parse line", () => {
  assertEquals({
    source: "AA",
    flowRate: 0,
    leadingTo: ["DD", "II", "BB"],
  }, unpack(parseLine)("Valve AA has flow rate=0; tunnels lead to valves DD, II, BB"))
})

Deno.test("Day 16 - Parse line 2", () => {
  assertEquals({
    source: "DD",
    flowRate: 20,
    leadingTo: ["CC", "AA", "EE"],
  }, unpack(parseLine)("Valve DD has flow rate=20; tunnels lead to valves CC, AA, EE"))
})

Deno.test("Day 16 - Parse line 3", () => {
  assertEquals({
    source: "JJ",
    flowRate: 21,
    leadingTo: ["II"],
  }, unpack(parseLine)("Valve JJ has flow rate=21; tunnel leads to valve II"))
})

Deno.test("Day 16 - Part 1 - Example input", () => {
  assertEquals(1651, solvePart1(exampleInput))
})

Deno.test("Day 16 - Part 1 - File input", {only: true}, () => {
  assertEquals(1754, solvePart1(fileInput))
})

Deno.test("Day 16 - Part 2 - Example input", () => {
  assertEquals(0, solvePart2(exampleInput))
})

Deno.test("Day 16 - Part 2 - File input", () => {
  assertEquals(0, solvePart2(fileInput))
})
