import { assertEquals } from 'deps'
import { Board, eastColumn, northRow, southRow, westColumn } from './utilts.ts'

const boardInput = `
..#
.#.
#..
`

Deno.test("Utils - Board adjacent coordinates", () => {
  const board = new Board(boardInput.trim())
  assertEquals(board.adjacentCoordinates({ y: 1, x: 1 }), [
    { y: 0, x: 0 },
    { y: 0, x: 1 },
    { y: 0, x: 2 },
    { y: 1, x: 2 },
    { y: 2, x: 2 },
    { y: 2, x: 1 },
    { y: 2, x: 0 },
    { y: 1, x: 0 },
  ])
})

Deno.test("Utils - Board adjacent tiles", () => {
  const board = new Board(boardInput.trim())
  assertEquals(board.adjacentTiles({ y: 1, x: 1 }), [
    ".", ".", "#", ".", ".", ".", "#", "."
  ])
})

Deno.test("Utils - Board adjacent tiles and coordinates", () => {
  const board = new Board(boardInput.trim())
  assertEquals(board.adjacentTilesWithCoordinates({ y: 1, x: 1 }), [
    { y: 0, x: 0, tile: "." },
    { y: 0, x: 1, tile: "." },
    { y: 0, x: 2, tile: "#" },
    { y: 1, x: 2, tile: "." },
    { y: 2, x: 2, tile: "." },
    { y: 2, x: 1, tile: "." },
    { y: 2, x: 0, tile: "#" },
    { y: 1, x: 0, tile: "." },
  ])
})

Deno.test("Utils - Board adjacent tiles on north row", () => {
  const board = new Board(boardInput.trim())
  assertEquals(board.adjacentTiles({ y: 1, x: 1 }, northRow), [".", ".", "#"])
})

Deno.test("Utils - Board adjacent tiles on east column", () => {
  const board = new Board(boardInput.trim())
  assertEquals(board.adjacentTiles({ y: 1, x: 1 }, eastColumn), ["#", ".", "."])
})

Deno.test("Utils - Board adjacent tiles on south row", () => {
  const board = new Board(boardInput.trim())
  assertEquals(board.adjacentTiles({ y: 1, x: 1 }, southRow), ["#", ".", "."])
})

Deno.test("Utils - Board adjacent tiles on west column", () => {
  const board = new Board(boardInput.trim())
  assertEquals(board.adjacentTiles({ y: 1, x: 1 }, westColumn), [".", ".", "#"])
})

Deno.test("Utils - Board adjacent tiles and coordinates on north row", () => {
  const board = new Board(boardInput.trim())
  assertEquals(board.adjacentTilesWithCoordinates({ y: 1, x: 1 }, northRow), [
    { y: 0, x: 0, tile: "." },
    { y: 0, x: 1, tile: "." },
    { y: 0, x: 2, tile: "#" },
  ])
})

Deno.test("Utils - Board adjacent tiles and coordinates on east column", () => {
  const board = new Board(boardInput.trim())
  assertEquals(board.adjacentTilesWithCoordinates({ y: 1, x: 1 }, eastColumn), [
    { y: 0, x: 2, tile: "#" },
    { y: 1, x: 2, tile: "." },
    { y: 2, x: 2, tile: "." },
  ])
})

Deno.test("Utils - Board adjacent tiles and coordinates on south row", () => {
  const board = new Board(boardInput.trim())
  assertEquals(board.adjacentTilesWithCoordinates({ y: 1, x: 1 }, southRow), [
    { y: 2, x: 0, tile: "#" },
    { y: 2, x: 1, tile: "." },
    { y: 2, x: 2, tile: "." },
  ])
})

Deno.test("Utils - Board adjacent tiles and coordinates on west column", () => {
  const board = new Board(boardInput.trim())
  assertEquals(board.adjacentTilesWithCoordinates({ y: 1, x: 1 }, westColumn), [
    { y: 0, x: 0, tile: "." },
    { y: 1, x: 0, tile: "." },
    { y: 2, x: 0, tile: "#" },
  ])
})
