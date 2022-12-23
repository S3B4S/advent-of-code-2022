import { monpar } from 'deps'
import { parseNumber } from '../parsing.ts'
import { lines } from '../utilts.ts'

const { char, unpack } = monpar

export const solvePart1 = (input: string) => {
  const monkeysInstructions = lines(input)
  const monkeys = monkeysInstructions.reduce((acc, monkeyInstruction) => {
    const [name, instruction] = monkeyInstruction.split(': ')
    return {
      ...acc,
      [name]: instruction
    }
  }, {} as Record<string, string>)

  let rootInstruction = monkeys.root
  
  while(true) {
    // Find names and replace them by their instruction, a name being a word consisting of 4 letters
    const toReplace = rootInstruction.match(/[a-z]{4}/g)
    if (!toReplace || toReplace.length === 0) break
    toReplace?.forEach(target => {
      rootInstruction = rootInstruction.replace(target, "(" + monkeys[target] + ")")
    })
  }
  
  return eval(rootInstruction)
}

export const solvePart2 = (input: string) => {
  const monkeysInstructions = lines(input)
  const monkeys = monkeysInstructions.reduce((acc, monkeyInstruction) => {
    const [name, instruction] = monkeyInstruction.split(': ')
    return {
      ...acc,
      [name]: instruction
    }
  }, {} as Record<string, string>)

  monkeys["root"] = monkeys["root"].replace("+", "===")
  monkeys["humn"] = "X"


  const solve = (instructions: string): string => {
    // Base cases, finding number or X
    if (!isNaN(Number(instructions)) || instructions === "X") {
      return instructions
    }

    const operator = instructions[5]
    const [l, r] = instructions.split(/ [\/\+\*\-] /)
    const left = solve(monkeys[l])
    const right = solve(monkeys[r])

    if (left?.includes('X') || right?.includes('X')) {
      return "(" + left + operator + right + ")"
    }

    return String(eval(left + operator + right))
  }

  const [l, r] = monkeys.root.split(' === ')

  const leftSolved = solve(monkeys[l])
  const rightSolved = solve(monkeys[r])
  // This gives me a relatively small expression that I can solve
  // by hand
  console.log(leftSolved)
  console.log(rightSolved)
  Deno.exit()
}
