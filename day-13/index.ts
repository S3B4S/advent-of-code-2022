import { parseNumber } from '../parsing.ts'

type RecList<T> = (T | RecList<T>)[]

export const areListsInRightOrder = (xs: RecList<number>, ys: RecList<number>) => {
  return false
}

const c = {
  LIST_DELIMITER: ",",
  LIST_START: "[",
  LIST_END: "]",
}

export const parseList = (input: string): [RecList<number>, string] => {
  const currentList = []
  let firstListStartFound = false
  let remainingInput = input
  while (remainingInput.length !== 0) {
    const char = remainingInput[0]
    // Skip the first list opener we see
    if (!firstListStartFound && char === c.LIST_START) {
      remainingInput = remainingInput.slice(1)
      firstListStartFound = true
      continue  
    }
    if (char === c.LIST_DELIMITER) {
      remainingInput = remainingInput.slice(1)
      continue
    }
    if (char === c.LIST_START) {
      const [parsed, ri] = parseList(remainingInput)
      remainingInput = ri
      currentList.push(parsed)
      continue
    }
    if (char === c.LIST_END) {
      remainingInput = remainingInput.slice(1)
      return [currentList, remainingInput]
    }
    
    // Must be a number
    const [[number, ri]] = parseNumber(remainingInput)
    currentList.push(number)
    remainingInput = ri
  }

  return [[], ""]
}

export const solvePart1 = (input: string) => {
  console.log(parseList(input))
  return 0
}

export const solvePart2 = (input: string) => {
  return 0
}
