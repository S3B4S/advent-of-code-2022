import { sum } from '../utilts.ts'

const lines = (input: string) => input.trim().split('\n')

export const solvePart1 = (input: string) => {
  const commands = lines(input)

  const recordedStrengths = []
  const recordInterval = 40
  let recordAt = 20
  let cycle = 1
  let register = 1

  for (const command of commands) {
    if (command.startsWith('noop')) {
      if (cycle === recordAt) {
        recordedStrengths.push(recordAt * register)
        recordAt += recordInterval
      }
      cycle +=1
      continue
    } else {
      const x = Number(command.split(' ')[1])
      if (recordAt - 2 < cycle && cycle <= recordAt) {
        recordedStrengths.push(recordAt * register)
        recordAt += recordInterval
      }
      cycle += 2
      register += x
    }
  }
  
  return recordedStrengths.reduce(sum, 0)
}

const stdout = (content: string) => {
  const contentBytes = new TextEncoder().encode(content)
  Deno.writeAllSync(Deno.stdout, contentBytes)
}

export const solvePart2 = (input: string) => {
  const commands = lines(input).reverse()

  const recordInterval = 40
  let recordAt = 40
  let cycle = 1
  let register = 1
  let busy = 0
  let toAdd = 0

  while (commands.length !== 0) {
    const spritePosition = [register - 1, register, register + 1]
    
    // CRT drawing
    stdout(spritePosition.includes((cycle % 40) - 1) ? '#' : '.')

    if (cycle === recordAt) {
      stdout('\n')
      recordAt += recordInterval
    }

    if (busy > 0) {
      busy -= 1
      if (busy === 0) {
        register += toAdd
        toAdd = 0
      }
      cycle += 1
      continue
    }

    // Commands is always not empty when entering a loop
    const command = commands.pop()!

    if (command.startsWith('noop')) {
      cycle += 1
      continue
    } else {
      const x = Number(command.split(' ')[1])
      busy = 1
      toAdd = x
      cycle += 1
    }
  }
  
  return 0
}
