import { monpar } from './deps.ts'
const { liftAs, sentence, some, numeric, alt } = monpar

export const parseNumber = liftAs(
  (numbers: string[]) => Number(numbers.join('')),
  some(numeric),
)

export const parseNumberAndDelimiter = (delimeter: string) => liftAs(
  (number: number) => () => number,
  parseNumber,
  sentence(delimeter),
)

export const parseNumbersWithDelimiter = (delimiter: string) => liftAs(
  (numbers: number[]) => numbers,
  alt(
    liftAs(
      (numbers: number[]) => (lastNumber: number) => numbers.concat(lastNumber),
      some(parseNumberAndDelimiter(delimiter)),
      parseNumber,
    ),
    liftAs(
      (x: number) => [x],
      parseNumber,
    )
  ),
)
