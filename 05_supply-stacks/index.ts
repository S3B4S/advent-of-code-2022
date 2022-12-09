import { dropWhile, map, takeWhile, turn90DegClockWise } from '../utilts.ts'
import { flow, pipe } from 'npm:fp-ts/lib/function.js'
import { not } from 'npm:fp-ts/lib/Predicate.js'
import { filter } from 'npm:fp-ts/lib/Array.js'
import { isEmpty as isEmptyString } from 'npm:fp-ts/lib/string.js'

type Containers = string[][]

const instructionLine = (line: string) => line.trim().startsWith('move')
const columnLine = (line: string) => line.trim().startsWith('1')

type Instruction = [
  number, // Amount of containers to move
  number, // From this column
  number, // to this column
]
const parseInstruction = (line: string): Instruction => {
  // @TODO Could use regex instead
  const triple = line.split(' ').filter(n => !['move', 'from', 'to'].includes(n)).map(Number)
  return [triple[0], triple[1] - 1, triple[2] - 1]
}
const parseContainerLine = (line: string): string[] => {
  if (line.length <= 3) return [line]
  return [line.slice(0, 3)].concat(parseContainerLine(line.slice(4)))
}

const unpackContainer = (container: string) => {
  const res = container.trim()
  if (res === '') return res
  
  return res.slice(1,2)
}

/** MUTATING! */
const moveContainersOneByOne = (containers: Containers, [amount, from, to]: [number, number, number]) => {
  for (let i = 0; i < amount; i++) {
    const el = containers[from].pop()!
    containers[to].push(el)
  }
}

/** MUTATING! */
const moveContainersGrouped = (containers: Containers, [amount, from, to]: [number, number, number]) => {
  const toMove = []
  for (let i = 0; i < amount; i++) {
    const el = containers[from].pop()!
    toMove.push(el)
  }
  containers[to] = containers[to].concat(toMove.reverse())
}

const input = Deno.readTextFileSync('./05_supply-stacks/input.txt').trimEnd().split('\n')
const instructions = dropWhile(l => !instructionLine(l), input).map(parseInstruction)

const containersParsed = pipe(
  input,
  takeWhile(not(columnLine)),
  map(flow(
    parseContainerLine,
    containers => containers.map(unpackContainer),
  ))
)

const containersPart1 = pipe(
  containersParsed,
  turn90DegClockWise,
  map(filter(not(isEmptyString)))
)

const containersPart2 = JSON.parse(JSON.stringify(containersPart1))

for (const instruction of instructions) {
  moveContainersOneByOne(containersPart1, instruction)
  moveContainersGrouped(containersPart2, instruction)
}

const getSolution = (containers: Containers) => containers.map(c => c[c.length - 1]).join('')

export const part1 = getSolution(containersPart1)
export const part2 = getSolution(containersPart2)
