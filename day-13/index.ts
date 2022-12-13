import { parseNumber } from '../parsing.ts'
import { sum } from 'utils'

type RecList<T> = (T | RecList<T>)[]

export const areListsInRightOrder = (left: RecList<number> | number, right: RecList<number> | number): boolean | undefined => {
  // Base cases
  // console.log({left, right})
  if (left === undefined && right !== undefined) return true
  if (left !== undefined && right === undefined) return false
  if (left === undefined && right === undefined) return undefined

  if (typeof left === "number" && typeof right === "number") {
    return left === right ? undefined : left < right
  }
  if (typeof left === "number") return areListsInRightOrder([left], right)
  if (typeof right === "number") return areListsInRightOrder(left, [right])
  
  // if (left.length === 0 && right.length > 0) return false
  
  // console.log({left, right})
  // Recursive, checking all comparisons
  // Get index for biggest list
  const maxLength = Math.max(left.length, right.length);
  for (let i = 0; i < maxLength; i++) {
    const res = areListsInRightOrder(left[i], right[i])
    if (res === undefined) continue
    return res
  }
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
  const pairs = input
    .trim()
    .split('\n\n')
    .map(p => p.split('\n').map(x => {
      const [res] = parseList(x.trim())
      return res
    }))

  const res = pairs.map(([xs, ys]) => areListsInRightOrder(xs, ys))
  
  let count = 0
  for (let i = 0; i < res.length; i++) {
    const element = res[i];
    if (element) count += i + 1
  }

  return count
}

export const solvePart2 = (input: string) => {
  return 0
}
