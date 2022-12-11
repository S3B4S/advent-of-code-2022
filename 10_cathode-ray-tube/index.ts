import { lines, sum } from 'utils'

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
    }

    const x = Number(command.split(' ')[1])
    if (recordAt - 2 < cycle && cycle <= recordAt) {
      recordedStrengths.push(recordAt * register)
      recordAt += recordInterval
    }
    cycle += 2
    register += x
  }
  
  return recordedStrengths.reduce(sum, 0)
}

export const solvePart2 = (input: string) => {
  const commands = lines(input).reverse()

  const recordInterval = 40
  let recordAt = 40
  let cycle = 0
  let register = 1
  let busy = 0
  let toAdd = 0
  let output = ''

  while (commands.length !== 0) {
    cycle++
    const spritePosition = [register - 1, register, register + 1]
    
    // CRT drawing
    output += spritePosition.includes((cycle - 1) % 40) ? '█' : ' '

    if (cycle === recordAt) {
      output += '\n'
      recordAt += recordInterval
    }

    // If busy (because of executing previous addx command) then:
    // - decrement busy counter
    // - add value to register if cpu is no longer busy
    if (busy > 0) {
      busy--
      if (busy === 0) {
        register += toAdd
        toAdd = 0
      }
      continue
    }

    // Commands is always not empty when entering a loop
    const command = commands.pop()!

    if (command.startsWith('noop')) continue

    const x = Number(command.split(' ')[1])
    busy = 1
    toAdd = x
  }
  
  return output
}
