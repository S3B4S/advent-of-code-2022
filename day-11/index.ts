import { lines, range } from '../utilts.ts'

interface Monkey {
  startingItems: number[]
  operation: (n: number) => number
  test: (n: number) => number
  ifTrue: number
  ifFalse: number
  amountInspects: number
}

interface Monkey2 {
  startingItems: number[]
  operation: (n: number) => number
  divisor: number
  ifTrue: number
  ifFalse: number
  amountInspects: number
}

export const solvePart1 = (input: string) => {
  const DIVIDE_BY = 3

  const monkeys = input
    .trim()
    .split('\n\n')
    // @FIX for some reason lines is not being inferred by the LSP
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
          monkeyParsed.test = (n: number) => n % number
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

  // # Order of monkey operations
  // Every round is every monkey taking a single turn
  // In every round:
  //  If monkey has no items, turn ends
  //  Inspect item
  //  Worry level increases by monkey.operation
  //  Relief, divide by DIVIDE_BY then round down to nearest integer
  //  Then perform test, then throw to next monkey
  

  // console.log(monkeys)
  // In every round, every monkey takes a single turn
  for (const _round of range(0, 20)) {
    for (const monkey of monkeys) {
      if (monkey.startingItems.length === 0) continue

      for (const item of monkey.startingItems) {
        monkey.amountInspects += 1
        const wl1 = monkey.operation(item)
        const wl2 = Math.floor(wl1 / DIVIDE_BY)
        if (monkey.test(wl2) === 0) {
          // console.log({wl1, wl2, throw: monkey.ifTrue})
          monkeys[monkey.ifTrue].startingItems.push(wl2)
        } else {
          // console.log({wl1, wl2, throw: monkey.ifFalse})
          monkeys[monkey.ifFalse].startingItems.push(wl2)
        }
      }

      monkey.startingItems = []
    }
    // console.log("======")
    // console.log(monkeys)
  }

  // Get most active monkeys
  const sortedByActivity = monkeys.sort((a, b) => b.amountInspects - a.amountInspects)
  return sortedByActivity.slice(0, 2).reduce((a, b) => a * b.amountInspects, 1)
}

export const solvePart2 = (input: string) => {
  const monkeys = input
    .trim()
    .split('\n\n')
    // @FIX for some reason lines is not being inferred by the LSP
    .map(group => {
      const monkeyLines = lines(group)
      const monkeyParsed: Monkey2 = {
        amountInspects: 0,
      } as Monkey2
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

  // Find least common multiple (lcm) from the monkey divisors
  // This is not _the_ lcm, but rather _a_ lcm to put it in a way
  // to make things simpler
  const lcm = monkeys.map(m => m.divisor).reduce((a, b) => a * b, 1)

  // # Order of monkey operations
  // Every round is every monkey taking a single turn
  // In every round:
  //  If monkey has no items, turn ends
  //  Inspect item
  //  Worry level increases by monkey.operation
  //  Relief, divide by DIVIDE_BY then round down to nearest integer
  //  Then perform test, then throw to next monkey
  

  // console.log(monkeys)
  // In every round, every monkey takes a single turn
  for (const _round of range(0, 10000)) {
    for (const monkey of monkeys) {
      if (monkey.startingItems.length === 0) continue

      for (const item of monkey.startingItems) {
        monkey.amountInspects += 1
        const wl1 = monkey.operation(item)
        if (wl1 % monkey.divisor === 0) {
          // console.log({wl1, throw: monkey.ifTrue})
          monkeys[monkey.ifTrue].startingItems.push(wl1 % lcm)
        } else {
          // console.log({wl1, throw: monkey.ifFalse})
          monkeys[monkey.ifFalse].startingItems.push(wl1 % lcm)
        }
      }

      monkey.startingItems = []
    }
    // if (_round < 3) {console.log(monkeys)}
    // console.log("======")
    // console.log(monkeys)
  }

  // Get most active monkeys
  const sortedByActivity = monkeys.sort((a, b) => b.amountInspects - a.amountInspects)
  return sortedByActivity.slice(0, 2).reduce((a, b) => a * b.amountInspects, 1)
}