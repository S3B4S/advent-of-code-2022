import * as Day3 from './03_rucksack-reorganization'
import * as Day4 from './04_camp-cleanup'
import * as Day5 from './05_supply-stacks'
import * as Day6 from './day-06'

const printDay = (day: number, part1: any, part2: any, endsWithNewLine: boolean = true) => {
  console.log("-- DAY " + String(day).padStart(2, '0') + " --")
  console.log("Part 1 | " + part1)
  console.log("Part 2 | " + part2)
  if (endsWithNewLine) console.log()
}

const print: [number, any, any][] = [
  [3, Day3.part1 /* 8252 */, Day3.part2 /* 2828 */],
  [4, Day4.part1 /* 466 */, Day4.part2 /* 865 */],
  [5, Day5.part1 /* FCVRLMVQP */, Day5.part2 /* RWLWGJGFD */],
  [6, Day6.part1 /* X */, Day6.part2 /* Y */],
]

print.forEach(([d, one, two], i) => printDay(d, one, two, i !== print.length - 1))
