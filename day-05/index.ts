import fs from 'fs';
import { compose, dropWhile, map, takeWhile, transpose } from '../utilts';
import { flow, pipe } from 'fp-ts/function'
import { negate } from 'fp-ts/lib/Ring';
import { not } from 'fp-ts/lib/Predicate';

type Containers = string[][]

const instructionLine = (line: string) => line.trim().startsWith('move')
const containerLine = (line: string) => line.trim().startsWith('[')
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
    const el = containers[from].pop()
    containers[to].push(el)
  }
}

/** MUTATING! */
const moveContainersGrouped = (containers: Containers, [amount, from, to]: [number, number, number]) => {
  const toMove = []
  for (let i = 0; i < amount; i++) {
    const el = containers[from].pop()
    toMove.push(el)
  }
  containers[to] = containers[to].concat(toMove.reverse())
}

const input = fs.readFileSync(__dirname + '/../../day-05/input.txt', 'utf-8').trimEnd().split('\n')
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
  transpose,
  map(stack => stack.filter(c => c !== ''))
)

const containersPart2 = JSON.parse(JSON.stringify(containersPart1))

for (const instruction of instructions) {
  moveContainersOneByOne(containersPart1, instruction)
  moveContainersGrouped(containersPart2, instruction)
}

const getSolution = (containers: Containers) => containers.map(c => c[c.length - 1]).join('')

export const part1 = getSolution(containersPart1)
export const part2 = getSolution(containersPart2)
