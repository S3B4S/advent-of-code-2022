import { assertEquals } from "deps"
import { C, Move, moveShape, Shape, solvePart1, solvePart2 } from "./index.ts"

const exampleInput = `>>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>`

const fileInput = Deno.readTextFileSync('./17_pyroclastic_flow/input.txt')

Deno.test("Day 17 - Part 1 - Example input", () => {
  assertEquals(0, solvePart1(exampleInput))
})

Deno.test("Day 17 - Part 1 - File input", () => {
  assertEquals(0, solvePart1(fileInput))
})

Deno.test("Day 17 - Test move - Blocking on right by boundaries", () => {
  assertEquals(
    [
      [C.Open, C.Open, C.Open, C.Open, C.Open, C.Move, C.Move],
      [C.Open, C.Open, C.Open, C.Open, C.Open, C.Move, C.Move],
      [C.Open, C.Open, C.Open, C.Open, C.Open, C.Open, C.Open],
    ],
    moveShape([
      [C.Open, C.Open, C.Open, C.Open, C.Open, C.Move, C.Move],
      [C.Open, C.Open, C.Open, C.Open, C.Open, C.Move, C.Move],
      [C.Open, C.Open, C.Open, C.Open, C.Open, C.Open, C.Open],
    ], [0, 5], Shape.Square, Move.Right)
  )
})

Deno.test("Day 17 - Test move - Blocking on left by boundaries", () => {
  assertEquals(
    [
      [C.Move, C.Open, C.Open, C.Open, C.Open, C.Open, C.Open],
      [C.Move, C.Open, C.Open, C.Open, C.Open, C.Open, C.Open],
      [C.Move, C.Open, C.Open, C.Open, C.Open, C.Open, C.Open],
      [C.Move, C.Open, C.Open, C.Open, C.Open, C.Open, C.Open],
    ],
    moveShape([
      [C.Move, C.Open, C.Open, C.Open, C.Open, C.Open, C.Open],
      [C.Move, C.Open, C.Open, C.Open, C.Open, C.Open, C.Open],
      [C.Move, C.Open, C.Open, C.Open, C.Open, C.Open, C.Open],
      [C.Move, C.Open, C.Open, C.Open, C.Open, C.Open, C.Open],
    ], [0, 0], Shape.VerticalLine, Move.Left)
  )
})

Deno.test("Day 17 - Test move - Legal move to right", () => {
  assertEquals(
    [
      [C.Open, C.Move, C.Open, C.Open, C.Open, C.Open, C.Open],
      [C.Open, C.Move, C.Open, C.Open, C.Open, C.Open, C.Open],
      [C.Open, C.Move, C.Open, C.Open, C.Open, C.Open, C.Open],
      [C.Open, C.Move, C.Open, C.Open, C.Open, C.Open, C.Open],
    ],
    moveShape([
      [C.Move, C.Open, C.Open, C.Open, C.Open, C.Open, C.Open],
      [C.Move, C.Open, C.Open, C.Open, C.Open, C.Open, C.Open],
      [C.Move, C.Open, C.Open, C.Open, C.Open, C.Open, C.Open],
      [C.Move, C.Open, C.Open, C.Open, C.Open, C.Open, C.Open],
    ], [0, 0], Shape.VerticalLine, Move.Right)
  )
})

Deno.test("Day 17 - Test move - Legal move to left", () => {
  assertEquals(
    [
      [C.Open, C.Open, C.Move, C.Open, C.Open, C.Open, C.Open],
      [C.Open, C.Move, C.Move, C.Move, C.Open, C.Open, C.Open],
      [C.Open, C.Open, C.Move, C.Open, C.Open, C.Open, C.Open],
      [C.Open, C.Open, C.Open, C.Open, C.Open, C.Open, C.Open],
    ],
    moveShape([
      [C.Open, C.Open, C.Open, C.Move, C.Open, C.Open, C.Open],
      [C.Open, C.Open, C.Move, C.Move, C.Move, C.Open, C.Open],
      [C.Open, C.Open, C.Open, C.Move, C.Open, C.Open, C.Open],
      [C.Open, C.Open, C.Open, C.Open, C.Open, C.Open, C.Open],
    ], [0, 2], Shape.Plus, Move.Left)
  )
})

Deno.test("Day 17 - Test move - Blocked on left by wall", () => {
  assertEquals(
    [
      [C.Open, C.Open, C.Wall, C.Move, C.Open, C.Open, C.Open],
      [C.Open, C.Open, C.Open, C.Move, C.Open, C.Open, C.Open],
      [C.Open, C.Move, C.Move, C.Move, C.Open, C.Open, C.Open],
      [C.Open, C.Open, C.Open, C.Open, C.Open, C.Open, C.Open],
    ],
    moveShape([
      [C.Open, C.Open, C.Wall, C.Move, C.Open, C.Open, C.Open],
      [C.Open, C.Open, C.Open, C.Move, C.Open, C.Open, C.Open],
      [C.Open, C.Move, C.Move, C.Move, C.Open, C.Open, C.Open],
      [C.Open, C.Open, C.Open, C.Open, C.Open, C.Open, C.Open],
    ], [0, 1], Shape.MirroredL, Move.Left)
  )
})

Deno.test("Day 17 - Test move - Blocked on right by wall", () => {
  assertEquals(
    [
      [C.Open, C.Open, C.Wall, C.Move, C.Wall, C.Open, C.Open],
      [C.Open, C.Open, C.Move, C.Move, C.Move, C.Open, C.Open],
      [C.Open, C.Open, C.Open, C.Move, C.Open, C.Open, C.Open],
      [C.Open, C.Open, C.Open, C.Open, C.Open, C.Open, C.Open],
    ],
    moveShape([
      [C.Open, C.Open, C.Wall, C.Move, C.Wall, C.Open, C.Open],
      [C.Open, C.Open, C.Move, C.Move, C.Move, C.Open, C.Open],
      [C.Open, C.Open, C.Open, C.Move, C.Open, C.Open, C.Open],
      [C.Open, C.Open, C.Open, C.Open, C.Open, C.Open, C.Open],
    ], [0, 2], Shape.Plus, Move.Right)
  )
})

Deno.test("Day 17 - Part 2 - Example input", () => {
  assertEquals(0, solvePart2(exampleInput))
})

Deno.test("Day 17 - Part 2 - File input", () => {
  assertEquals(0, solvePart2(fileInput))
})
