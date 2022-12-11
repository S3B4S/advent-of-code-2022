import { monpar } from '../deps.ts'
const { liftAs, sentence, take, char, unpack, many, some, numeric } = monpar

export const parseMonkeyId = unpack(liftAs(
  () => (n: string) => () => Number(n),
  sentence("Monkey "),
  take,
  char(":"),
))

export const parseNumberSequence = liftAs(
  (numbers: string[]) => Number(numbers.join('')),
  some(numeric),
)

export const parseNumbersSeparatedBy = (delimeter: string) => liftAs(
  (digits: number[]) => digits,
  many(
    liftAs(
      (number: number) => () => number,
      parseNumberSequence,
      sentence(delimeter),
    )
  )
  ,
)

export const parseStartingItems = unpack(liftAs(
  () => (numbers: number[]) => (number: number) => numbers.concat(number),
  sentence("Starting items: "),
  parseNumbersSeparatedBy(", "),
  parseNumberSequence,
))

export const parseOperation = (input: string) => input

export const parseDivisibleBy = (input: string) => 0

export const parseIfTrue = (input: string) => 0

export const parseIfFalse = (input: string) => 0
