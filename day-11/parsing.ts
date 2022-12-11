import { parseNumbersWithDelimiter } from '../parsing.ts'
import { monpar } from '../deps.ts'
const { liftAs, sentence, take, char, unpack, many, some, numeric } = monpar

export const parseMonkeyId = unpack(liftAs(
  () => (n: string) => () => Number(n),
  sentence("Monkey "),
  take,
  char(":"),
))



export const parseStartingItems = unpack(liftAs(
  () => (numbers: number[]) => (number: number) => numbers.concat(number),
  sentence("Starting items: "),
  parseNumbersWithDelimiter(", "),
))

export const parseOperation = (input: string) => input

export const parseDivisibleBy = (input: string) => 0

export const parseIfTrue = (input: string) => 0

export const parseIfFalse = (input: string) => 0
