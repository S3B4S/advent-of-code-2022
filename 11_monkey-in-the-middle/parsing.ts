import { parseNumber, parseNumbersWithDelimiter } from '../parsing.ts'
import { monpar } from '../deps.ts'
const { liftAs, sentence, take, char, token, sat, many } = monpar

export const parseMonkeyId = liftAs(
  () => (n: string) => () => Number(n),
  sentence("Monkey "),
  take,
  char(":"),
)

export const parseStartingItems = liftAs(
  () => (numbers: number[]) => numbers,
  sentence("Starting items: "),
  parseNumbersWithDelimiter(", "),
)

export const parseOperation = liftAs<(n: number) => number>(
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
)

export const parseDivisibleBy = liftAs(
  () => (n: number) => n,
  sentence("Test: divisible by "),
  parseNumber,
)

export const parseIfTrue = liftAs(
  () => (n: number) => n,
  sentence("If true: throw to monkey "),
  parseNumber,
)

export const parseIfFalse = liftAs(
  () => (n: number) => n,
  sentence("If false: throw to monkey "),
  parseNumber,
)

export interface Monkey {
  id: number
  items: number[]
  operation: (n: number) => number
  divisor: number
  ifTrue: number
  ifFalse: number
  amountInspects: number
}

export const parseMonkey = liftAs<Monkey>(
  (monkeyId: number) => (startingItems: number[]) => (operation: (x: number) => number) => (divisor: number) => (ifTrue: number) => (ifFalse: number): Monkey => {
    return {
      id: monkeyId,
      items: startingItems,
      operation,
      divisor,
      ifTrue,
      ifFalse,
      amountInspects: 0,
    }
  },
  token(parseMonkeyId),
  token(parseStartingItems),
  token(parseOperation),
  token(parseDivisibleBy),
  token(parseIfTrue),
  token(parseIfFalse),
)

export const parseMonkeys = liftAs<Monkey[]>(
  (monkeys: Monkey[]) => monkeys,
  many(token(parseMonkey)),
)
