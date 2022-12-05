import * as Day3 from './03_rucksack-reorganization'
import * as Day4 from './04_camp-cleanup'
import * as Day5 from './05_supply-stacks'
import * as Day6 from './day-06';
import * as Day7 from './day-07';
import * as Day8 from './day-08';
import * as Day9 from './day-09';
import * as Day10 from './day-10';
import * as Day11 from './day-11';
import * as Day12 from './day-12';
import * as Day13 from './day-13';
import * as Day14 from './day-14';
import * as Day15 from './day-15';
import * as Day16 from './day-16';
import * as Day17 from './day-17';
import * as Day18 from './day-18';
import * as Day19 from './day-19';
import * as Day20 from './day-20';
import * as Day21 from './day-21';
import * as Day22 from './day-22';
import * as Day23 from './day-23';
import * as Day24 from './day-24';
import * as Day25 from './day-25';


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
  [7, Day7.part1 /* X */, Day7.part2 /* Y */],
  [8, Day8.part1 /* X */, Day8.part2 /* Y */],
  [9, Day9.part1 /* X */, Day9.part2 /* Y */],
  [10, Day10.part1 /* X */, Day10.part2 /* Y */],
  [11, Day11.part1 /* X */, Day11.part2 /* Y */],
  [12, Day12.part1 /* X */, Day12.part2 /* Y */],
  [13, Day13.part1 /* X */, Day13.part2 /* Y */],
  [14, Day14.part1 /* X */, Day14.part2 /* Y */],
  [15, Day15.part1 /* X */, Day15.part2 /* Y */],
  [16, Day16.part1 /* X */, Day16.part2 /* Y */],
  [17, Day17.part1 /* X */, Day17.part2 /* Y */],
  [18, Day18.part1 /* X */, Day18.part2 /* Y */],
  [19, Day19.part1 /* X */, Day19.part2 /* Y */],
  [20, Day20.part1 /* X */, Day20.part2 /* Y */],
  [21, Day21.part1 /* X */, Day21.part2 /* Y */],
  [22, Day22.part1 /* X */, Day22.part2 /* Y */],
  [23, Day23.part1 /* X */, Day23.part2 /* Y */],
  [24, Day24.part1 /* X */, Day24.part2 /* Y */],
  [25, Day25.part1 /* X */, Day25.part2 /* Y */],
]

// Print only days up until the day that was given as argument when running the script
const printUpUntilDay = Number(process.argv.slice(2)) ?? 25

print.slice(0, printUpUntilDay - 2).forEach(([d, one, two], i) => printDay(d, one, two, i !== print.length - 1))
