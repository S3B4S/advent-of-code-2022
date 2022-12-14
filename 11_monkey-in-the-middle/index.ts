import { lines, range } from '../utilts.ts'
import { parseMonkeys } from './parsing.ts'
import { monpar } from "deps"
const { unpack } = monpar

interface Monkey {
  startingItems: number[]
  operation: (n: number) => number
  divisor: number
  ifTrue: number
  ifFalse: number
  amountInspects: number
}

export const solvePart1 = (input: string) => {
  const DIVIDE_BY = 3
  const monkeys = unpack(parseMonkeys)(input)!

  // # Order of monkey operations
  // Every round is every monkey taking a single turn
  // In every round:
  //  If monkey has no items, turn ends
  //  Inspect item
  //  Worry level increases by monkey.operation
  //  Relief, divide by DIVIDE_BY then round down to nearest integer
  //  Then perform test, then throw to next monkey

  // In every round, every monkey takes a single turn
  for (const _round of range(0, 20)) {
    for (const monkey of monkeys) {
      if (monkey.items.length === 0) continue

      for (const item of monkey.items) {
        monkey.amountInspects += 1
        const wl1 = monkey.operation(item)
        const wl2 = Math.floor(wl1 / DIVIDE_BY)
        if (wl2 % monkey.divisor === 0) {
          monkeys[monkey.ifTrue].items.push(wl2)
        } else {
          monkeys[monkey.ifFalse].items.push(wl2)
        }
      }

      monkey.items = []
    }
  }

  // Get most active monkeys
  const sortedByActivity = monkeys.sort((a, b) => b.amountInspects - a.amountInspects)
  return sortedByActivity.slice(0, 2).reduce((a, b) => a * b.amountInspects, 1)
}

export const solvePart2 = (input: string) => {
  const monkeys = unpack(parseMonkeys)(input)!

  // Find least common multiple (lcm) from the monkey divisors
  // https://en.wikipedia.org/wiki/Least_common_multiple
  // This is not _the_ lcm, but rather _a_ common multiple. As long
  // as it makes the worry levels small enough
  const cm = monkeys.map(m => m.divisor).reduce((a, b) => a * b, 1)

  // In every round, every monkey takes a single turn
  for (const _round of range(0, 10000)) {
    for (const monkey of monkeys) {
      if (monkey.items.length === 0) continue

      for (const item of monkey.items) {
        monkey.amountInspects += 1
        const wl1 = monkey.operation(item)
        if (wl1 % monkey.divisor === 0) {
          monkeys[monkey.ifTrue].items.push(wl1 % cm)
        } else {
          monkeys[monkey.ifFalse].items.push(wl1 % cm)
        }
      }

      monkey.items = []
    }
  }

  // Get most active monkeys
  const sortedByActivity = monkeys.sort((a, b) => b.amountInspects - a.amountInspects)
  return sortedByActivity.slice(0, 2).reduce((a, b) => a * b.amountInspects, 1)
}

/**
 * This is the old parsing I used before I rewrote it using monpar,
 * my monadic parser
 * @param input the raw input string that's the puzzle input
 * @returns an array of parsed monkey objects ready to be used for further procesing
 */
const _parseMonkeys = (input: string) => input
  .trim()
  .split('\n\n')
  .map(group => {
    const monkeyLines = lines(group)
    const monkeyParsed: Monkey = {
      amountInspects: 0,
    } as Monkey
    monkeyLines.forEach(line => {
      const trimmedLine = line.trim()
      if (trimmedLine.startsWith('Monkey')) {
        return // go to next line
      } else if (trimmedLine.startsWith('Starting items:')) {
        const items = trimmedLine.split(': ')[1].split(', ').map(Number)
        monkeyParsed.startingItems = items
      } else if (trimmedLine.startsWith('Operation:')) {
        const [_1, _2, _3, _4, op, operand] = trimmedLine.split(' ')
        if (op === "*") {
          if (operand === "old") {
            monkeyParsed.operation = (n: number) => n * n
          } else {
            const number = Number(operand)
            monkeyParsed.operation = (n: number) => n * number
          }
        } else if (op === "+") {
          if (operand === "old") {
            monkeyParsed.operation = (n: number) => n + n
          } else {
            const number = Number(operand)
            monkeyParsed.operation = (n: number) => n + number
          }
        }
      } else if (trimmedLine.startsWith('Test:')) {
        const number = Number(trimmedLine.split('divisible by ')[1])
        monkeyParsed.divisor = number
      } else if (trimmedLine.startsWith('If true: ')) {
        const to = Number(trimmedLine.split('throw to monkey ')[1])
        monkeyParsed.ifTrue = to
      } else if (trimmedLine.startsWith('If false: ')) {
        const to = Number(trimmedLine.split('throw to monkey ')[1])
        monkeyParsed.ifFalse = to
      }
    })
    return monkeyParsed
  })
