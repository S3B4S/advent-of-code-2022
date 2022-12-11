import { parseNumber, parseNumbersWithDelimiter } from '../parsing.ts'
import { monpar } from '../deps.ts'
const { liftAs, sentence, take, char, unpack, sat, many } = monpar

export const parseMonkeyId = unpack(liftAs(
  () => (n: string) => () => Number(n),
  sentence("Monkey "),
  take,
  char(":"),
))

export const parseStartingItems = unpack(liftAs(
  () => (numbers: number[]) => numbers,
  sentence("Starting items: "),
  parseNumbersWithDelimiter(", "),
))

export const parseOperation = unpack(liftAs<(n: number) => number>(
  () => (op: string) => () => (operand: string[]) => {
    if (op === "+") {
      return (n: number) => n + (operand.join('') === "old" ? n : Number(operand.join('')))
    } else if (op === "*") {
      return (n: number) => n * (operand.join('') === "old" ? n : Number(operand.join('')))
    }
  },
  sentence("Operation: new = old "),
  take,
  char(' '),
  many(sat(c => c !== '\n')),
))

export const parseDivisibleBy = unpack(liftAs(
  () => (n: number) => n,
  sentence("Test: divisible by "),
  parseNumber,
))

export const parseIfTrue = unpack(liftAs(
  () => (n: number) => n,
  sentence("If true: throw to monkey "),
  parseNumber,
))

export const parseIfFalse = unpack(liftAs(
  () => (n: number) => n,
  sentence("If false: throw to monkey "),
  parseNumber,
))
