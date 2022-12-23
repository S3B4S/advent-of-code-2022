import { lines } from '../utilts.ts'

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
  return 0
}
