import fs from 'fs';
import { compose } from '../utilts';

type Containers = (string | undefined)[][]

const transpose = <T>(matrix: T[][]) => {
  const res = Array.from({ length: matrix[0].length }).map(() => [])
  
  for (let rowIndex = matrix.length - 1; rowIndex >= 0; rowIndex--) {
    const row = matrix[rowIndex];
    for (let elIndex = 0; elIndex < row.length; elIndex++) {
      const element = row[elIndex];
      res[elIndex].push(element)
    }
  }

  return res
}

/**
 * MUTATING!
 * @param containers 
 * @param param1 
 */
const moveContainersOneByOne = (containers: Containers, [amount, from, to]: [number, number, number]) => {
  for (let i = 0; i < amount; i++) {
    const el = containers[from].pop()
    containers[to].push(el)
  }
}

const moveContainersGrouped = (containers: Containers, [amount, from, to]: [number, number, number]) => {
  const toMove = []
  for (let i = 0; i < amount; i++) {
    const el = containers[from].pop()
    toMove.push(el)
  }
  containers[to] = containers[to].concat(toMove.reverse())
}

const takeWhile = <T>(predicate: (e: T) => boolean, list: T[]) => {
  const res = []
  for (const el of list) {
    if (predicate(el)) {
      res.push(el)
    } else {
      return res
    }
  }
  return res
}

const dropWhile = <T>(predicate: (e: T) => boolean, list: T[]) => {
  const index = list.findIndex(e => !predicate(e))
  return list.slice(index)
}

const instructionLine = (line: string) => line.trim().startsWith('move')
const containerLine = (line: string) => line.trim().startsWith('[')
const columnLine = (line: string) => line.trim().startsWith('1')

// @TODO use regex
const parseInstruction = (line: string) => {
  const triple = line.split(' ').filter(n => !['move', 'from', 'to'].includes(n)).map(Number) as [number, number, number]
  return [triple[0], triple[1] - 1, triple[2] - 1]  as [number, number, number]
}
const parseContainerLine = (line: string): string[] => {
  if (line.length <= 3) return [line]
  return [line.slice(0, 3)].concat(parseContainerLine(line.slice(4)))
}

const buildContainers = (parsedLines: string[]) => parsedLines.map(l => {
  const res = l.trim()
  if (res === '') return res
  
  return res.slice(1,2)
})

const input = fs.readFileSync(__dirname + '/../../day-05/input.txt', 'utf-8')
const containers = 
  transpose(takeWhile(l => !columnLine(l), input.trimEnd().split('\n'))
    .map(compose(
      buildContainers,
      parseContainerLine
  ))).map(containers => containers.filter(c => c !== ''))
  
console.log(containers)
  
const instructions = dropWhile(l => !instructionLine(l), input.trimEnd().split('\n'))

// part 1
for (const instruction of instructions) {
  moveContainersOneByOne(containers, parseInstruction(instruction))
}

// part 2
for (const instruction of instructions) {
  moveContainersGrouped(containers, parseInstruction(instruction))
}

console.log(containers)

export const part1 = containers.map(c => c[c.length - 1]).join('')
export const part2 = ''