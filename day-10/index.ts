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
        // console.log({command, cycle, recordAt, register, multiplied: recordAt * register})
        recordedStrengths.push(recordAt * register)
        recordAt += recordInterval
      }
      cycle +=1
      continue
    } else {
      const x = Number(command.split(' ')[1])
      if (recordAt - 2 < cycle && cycle <= recordAt) {
        // console.log({command, cycle, recordAt, register, multiplied: recordAt * register})
        recordedStrengths.push(recordAt * register)
        recordAt += recordInterval
      }
      cycle += 2
      register += x
    }
  }
  
  return recordedStrengths.reduce(sum, 0)
}

export const solvePart2 = (input: string) => {
  return 0
}
