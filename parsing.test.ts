import { assertEquals } from "./deps.ts"
import { parseNumber, parseNumberAndDelimiter, parseNumbersWithDelimiter } from './parsing.ts'

Deno.test("Parsing - sequence of numbers", () => {
  assertEquals([[54, ", 65, 100"]], parseNumber("54, 65, 100"))
})

Deno.test("Parsing - sequence of numbers - failing", () => {
  assertEquals([], parseNumber(" 54, 65, 100"))
})

Deno.test("Parsing - sequence of numbers with delimiter", () => {
  assertEquals([[54, "65, 100"]], parseNumberAndDelimiter(", ")("54, 65, 100"))
})

Deno.test("Parsing - sequence of numbers with delimiter - failing", () => {
  assertEquals([], parseNumberAndDelimiter(", ")(" 54, 65, 100"))
})

Deno.test("Parsing - sequence of numbers with delimiter including last - 3 elements", () => {
  const x = parseNumbersWithDelimiter(", ")("54, 65, 100")
  console.log(x)
  assertEquals([[[54, 65, 100], ""]], x)
})

Deno.test("Parsing - sequence of numbers with delimiter including last - 1 element", () => {
  assertEquals([[[54], ""]], parseNumbersWithDelimiter(", ")("54"))
})

Deno.test("Parsing - sequence of numbers with delimiter including last - failing", () => {
  assertEquals([], parseNumbersWithDelimiter(", ")(" 54, 65, 100"))
})
