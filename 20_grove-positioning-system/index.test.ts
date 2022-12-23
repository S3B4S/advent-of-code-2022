import { assertEquals } from "deps"
import { Node, CyclicLinkedList, solvePart1, solvePart2 } from "./index.ts"

const exampleInput = `
1
2
-3
3
-2
0
4
`

const exampleInput2 = `
-7137
961
2730
-9459
1828
591
0
-2554
9726
`

/* End result
-7137 - 0, 0
-9459 - 3, 0
1828 - 4, 1
9726 - 8, 6
2730 - 2, 3
0 - 6, 0
-2554 - 7, -7
961 - 1, 7
591 - 5, 6

1000 mod 9 = 1, -2554
2000 mod 9 = 2, 961
3000 mod 9 = 3, 591
SUM = -2554 + 961 + 591 = -1002
*/

const exampleInput3 = `
632
1386
-9289
5486
-1156
-5211
5569
-7925
9579
4987
7889
0
-3931
-9799
-8438
`

/* End result, n = 15
632 - 2X
-1156 - -14X
-9289 - -11X
5569 - 4
1386 - 6X
-7925 - -10
9579 - 9
4987 - 7
-5211 - -9X
7889 - 14
0 - 0
-3931 - -14
5486 - 11X
-9799 - -11
-8438 - -7
*/

const fileInput = Deno.readTextFileSync('./20_grove-positioning-system/input.txt')

Deno.test("Day 20 - Linked list move up", () => {
  const ll = new CyclicLinkedList()
  const a = new Node(5)
  const b = new Node(3)
  const c = new Node(-1)

  a.next = b
  a.previous = c

  b.next = c
  b.previous = a

  c.next = a
  c.previous = b
  ll.addNode(0, a)
  ll.addNode(1, b)
  ll.addNode(2, c)

  ll.moveUp(1)

  assertEquals(a.next, c)
  assertEquals(a.previous, b)
  assertEquals(b.next, a)
  assertEquals(b.previous, c)
  assertEquals(c.next, b)
  assertEquals(c.previous, a)
})

Deno.test("Day 20 - Linked list move up wrapping list", () => {
  const ll = new CyclicLinkedList()
  const a = new Node(5)
  const b = new Node(3)
  const c = new Node(-1)
  const d = new Node(-6)

  a.previous = d
  a.next = b
  b.previous = a
  b.next = c
  c.previous = b
  c.next = d
  d.previous = c
  d.next = a

  ll.addNode(0, a)
  ll.addNode(1, b)
  ll.addNode(2, c)
  ll.addNode(3, d)

  ll.move(2, 10)

  assertEquals(a.next, c)
  assertEquals(a.previous, d)
  assertEquals(b.next, d)
  assertEquals(b.previous, c)
  assertEquals(c.next, b)
  assertEquals(c.previous, a)
  assertEquals(d.next, a)
  assertEquals(d.previous, b)
})

Deno.test("Day 20 - Linked list move down", () => {
  const ll = new CyclicLinkedList()
  const a = new Node(5)
  const b = new Node(3)
  const c = new Node(-1)

  a.next = b
  a.previous = c

  b.next = c
  b.previous = a

  c.next = a
  c.previous = b
  ll.addNode(0, a)
  ll.addNode(1, b)
  ll.addNode(2, c)

  ll.moveDown(1)

  assertEquals(a.next, c)
  assertEquals(a.previous, b)
  assertEquals(b.next, a)
  assertEquals(b.previous, c)
  assertEquals(c.next, b)
  assertEquals(c.previous, a)
})

Deno.test("Day 20 - Linked list move down wrapping list", () => {
  const ll = new CyclicLinkedList()
  const a = new Node(5)
  const b = new Node(3)
  const c = new Node(-1)
  const d = new Node(-6)

  a.previous = d
  a.next = b
  b.previous = a
  b.next = c
  c.previous = b
  c.next = d
  d.previous = c
  d.next = a

  ll.addNode(0, a)
  ll.addNode(1, b)
  ll.addNode(2, c)
  ll.addNode(3, d)

  ll.move(2, -10)

  assertEquals(a.next, b)
  assertEquals(a.previous, c)
  assertEquals(b.next, d)
  assertEquals(b.previous, a)
  assertEquals(c.next, a)
  assertEquals(c.previous, d)
  assertEquals(d.next, c)
  assertEquals(d.previous, b)
})

Deno.test("Day 20 - Part 1 - Example input", () => {
  assertEquals(3, solvePart1(exampleInput))
})

Deno.test("Day 20 - Part 1 - Example input 2", () => {
  assertEquals(-1002, solvePart1(exampleInput2))
})

Deno.test("Day 20 - Part 1 - File input", () => {
  // Guesses:
  // -3329, not the right answer
  // 3329, too low
  assertEquals(0, solvePart1(fileInput))
})

Deno.test("Day 20 - Part 2 - Example input", () => {
  assertEquals(0, solvePart2(exampleInput))
})

Deno.test("Day 20 - Part 2 - File input", () => {
  assertEquals(0, solvePart2(fileInput))
})
