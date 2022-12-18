import { assertEquals } from "deps"
import { C, Move, moveShape, Shape, solvePart1, solvePart2 } from "./index.ts"

const exampleInput = `>>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>`

const fileInput = Deno.readTextFileSync('./17_pyroclastic_flow/input.txt')

Deno.test("Day 17 - Test move - Blocking on right by boundaries", () => {
  const map = [
    [C.Open, C.Open, C.Open, C.Open, C.Open, C.Move, C.Move],
    [C.Open, C.Open, C.Open, C.Open, C.Open, C.Move, C.Move],
    [C.Open, C.Open, C.Open, C.Open, C.Open, C.Open, C.Open],
  ]

  const didMove = moveShape(map, [1, 5], Shape.Square, Move.Right)

  assertEquals([
    [C.Open, C.Open, C.Open, C.Open, C.Open, C.Move, C.Move],
    [C.Open, C.Open, C.Open, C.Open, C.Open, C.Move, C.Move],
    [C.Open, C.Open, C.Open, C.Open, C.Open, C.Open, C.Open],
  ], map)
  assertEquals(didMove, false)
})

Deno.test("Day 17 - Test move - Blocking on left by boundaries", () => {
  const map = [
    [C.Move, C.Open, C.Open, C.Open, C.Open, C.Open, C.Open],
    [C.Move, C.Open, C.Open, C.Open, C.Open, C.Open, C.Open],
    [C.Move, C.Open, C.Open, C.Open, C.Open, C.Open, C.Open],
    [C.Move, C.Open, C.Open, C.Open, C.Open, C.Open, C.Open],
  ]

  const didMove = moveShape(map, [3, 0], Shape.VerticalLine, Move.Left)

  assertEquals([
    [C.Move, C.Open, C.Open, C.Open, C.Open, C.Open, C.Open],
    [C.Move, C.Open, C.Open, C.Open, C.Open, C.Open, C.Open],
    [C.Move, C.Open, C.Open, C.Open, C.Open, C.Open, C.Open],
    [C.Move, C.Open, C.Open, C.Open, C.Open, C.Open, C.Open],
  ], map)
  assertEquals(didMove, false)
})

Deno.test("Day 17 - Test move - Legal move to right", () => {
  const map = [
    [C.Move, C.Open, C.Open, C.Open, C.Open, C.Open, C.Open],
    [C.Move, C.Open, C.Open, C.Open, C.Open, C.Open, C.Open],
    [C.Move, C.Open, C.Open, C.Open, C.Open, C.Open, C.Open],
    [C.Move, C.Open, C.Open, C.Open, C.Open, C.Open, C.Open],
  ]

  const didMove = moveShape(map, [3, 0], Shape.VerticalLine, Move.Right)

  assertEquals([
    [C.Open, C.Move, C.Open, C.Open, C.Open, C.Open, C.Open],
    [C.Open, C.Move, C.Open, C.Open, C.Open, C.Open, C.Open],
    [C.Open, C.Move, C.Open, C.Open, C.Open, C.Open, C.Open],
    [C.Open, C.Move, C.Open, C.Open, C.Open, C.Open, C.Open],
  ], map)
  assertEquals(didMove, true)
})

Deno.test("Day 17 - Test move - Legal move to left", () => {
  const map = [
    [C.Open, C.Open, C.Open, C.Move, C.Open, C.Open, C.Open],
    [C.Open, C.Open, C.Move, C.Move, C.Move, C.Open, C.Open],
    [C.Open, C.Open, C.Open, C.Move, C.Open, C.Open, C.Open],
    [C.Open, C.Open, C.Open, C.Open, C.Open, C.Open, C.Open],
  ]

  const didMove = moveShape(map, [2, 2], Shape.Plus, Move.Left)
  
  assertEquals([
    [C.Open, C.Open, C.Move, C.Open, C.Open, C.Open, C.Open],
    [C.Open, C.Move, C.Move, C.Move, C.Open, C.Open, C.Open],
    [C.Open, C.Open, C.Move, C.Open, C.Open, C.Open, C.Open],
    [C.Open, C.Open, C.Open, C.Open, C.Open, C.Open, C.Open],
  ], map)
  assertEquals(didMove, true)
})

Deno.test("Day 17 - Test move - Blocked on left by wall", () => {
  const map = [
    [C.Open, C.Open, C.Wall, C.Move, C.Open, C.Open, C.Open],
    [C.Open, C.Open, C.Open, C.Move, C.Open, C.Open, C.Open],
    [C.Open, C.Move, C.Move, C.Move, C.Open, C.Open, C.Open],
    [C.Open, C.Open, C.Open, C.Open, C.Open, C.Open, C.Open],
  ]
  
  const didMove = moveShape(map, [2, 1], Shape.MirroredL, Move.Left)

  assertEquals([
    [C.Open, C.Open, C.Wall, C.Move, C.Open, C.Open, C.Open],
    [C.Open, C.Open, C.Open, C.Move, C.Open, C.Open, C.Open],
    [C.Open, C.Move, C.Move, C.Move, C.Open, C.Open, C.Open],
    [C.Open, C.Open, C.Open, C.Open, C.Open, C.Open, C.Open],
  ], map)
  assertEquals(didMove, false)
})

Deno.test("Day 17 - Test move - Blocked on right by wall", () => {
  const map = [
    [C.Open, C.Open, C.Wall, C.Move, C.Wall, C.Open, C.Open],
    [C.Open, C.Open, C.Move, C.Move, C.Move, C.Open, C.Open],
    [C.Open, C.Open, C.Open, C.Move, C.Open, C.Open, C.Open],
    [C.Open, C.Open, C.Open, C.Open, C.Open, C.Open, C.Open],
  ]

  const didMove = moveShape(map, [2, 2], Shape.Plus, Move.Right)

  assertEquals([
    [C.Open, C.Open, C.Wall, C.Move, C.Wall, C.Open, C.Open],
    [C.Open, C.Open, C.Move, C.Move, C.Move, C.Open, C.Open],
    [C.Open, C.Open, C.Open, C.Move, C.Open, C.Open, C.Open],
    [C.Open, C.Open, C.Open, C.Open, C.Open, C.Open, C.Open],
  ], map)
  assertEquals(didMove, false)
})

Deno.test("Day 17 - Test move - Legal move upwards", () => {
  const map = [
    [C.Open, C.Open, C.Open, C.Open, C.Open, C.Open, C.Open],
    [C.Open, C.Open, C.Move, C.Move, C.Move, C.Move, C.Open],
  ]

  const didMove = moveShape(map, [1, 2], Shape.HorizontalLine, Move.Up)

  assertEquals([
    [C.Open, C.Open, C.Move, C.Move, C.Move, C.Move, C.Open],
    [C.Open, C.Open, C.Open, C.Open, C.Open, C.Open, C.Open],
  ], map)
  assertEquals(didMove, true)
})

Deno.test("Day 17 - Test move - Blocked upwards by floor", () => {
  const map = [
    [C.Open, C.Open, C.Move, C.Move, C.Move, C.Move, C.Open],
    [C.Open, C.Open, C.Open, C.Open, C.Open, C.Open, C.Open],
  ]

  const didMove = moveShape(map, [0, 2], Shape.HorizontalLine, Move.Up)

  assertEquals([
    [C.Open, C.Open, C.Wall, C.Wall, C.Wall, C.Wall, C.Open],
    [C.Open, C.Open, C.Open, C.Open, C.Open, C.Open, C.Open],
  ], map)
  assertEquals(didMove, false)
})

Deno.test("Day 17 - Test move - Blocked by other block on up, turn into wall", () => {
  const map = [
    [C.Open, C.Open, C.Wall, C.Wall, C.Wall, C.Wall, C.Open],
    [C.Open, C.Open, C.Open, C.Move, C.Open, C.Open, C.Open],
    [C.Open, C.Open, C.Move, C.Move, C.Move, C.Open, C.Open],
    [C.Open, C.Open, C.Open, C.Move, C.Open, C.Open, C.Open],
  ]

  const didMove = moveShape(map, [3, 2], Shape.Plus, Move.Up)

  assertEquals([
    [C.Open, C.Open, C.Wall, C.Wall, C.Wall, C.Wall, C.Open],
    [C.Open, C.Open, C.Open, C.Wall, C.Open, C.Open, C.Open],
    [C.Open, C.Open, C.Wall, C.Wall, C.Wall, C.Open, C.Open],
    [C.Open, C.Open, C.Open, C.Wall, C.Open, C.Open, C.Open],
  ], map)
  assertEquals(didMove, false)
})

Deno.test("Day 17 - Part 1 - Only going left", () => {
  assertEquals(4448, solvePart1("<"))
})

Deno.test("Day 17 - Part 1 - Example input", () => {
  assertEquals(3068, solvePart1(exampleInput))
})

Deno.test("Day 17 - Part 1 - File input", () => {
  assertEquals(3127, solvePart1(fileInput))
})

Deno.test("Day 17 - Part 2 - Example input", () => {
  assertEquals(0, solvePart2(exampleInput))
})

Deno.test("Day 17 - Part 2 - File input", () => {
  assertEquals(0, solvePart2(fileInput))
})
