import { exit } from 'process';
import { fromCompare, max, Ord } from 'fp-ts/lib/Ord'
import { Ord as NumberOrd } from 'fp-ts/lib/number'
import * as Day3 from './03_rucksack-reorganization'
import * as Day4 from './04_camp-cleanup'
import * as Day5 from './05_supply-stacks'
import * as Day6 from './06_tuning-trouble';
import * as Day7 from './07_no-space-left-on-device';
import * as Day8 from './08_treetop-tree-house';
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
import { flow } from 'fp-ts/lib/function';
import { size } from 'fp-ts/lib/string';
import { map } from 'fp-ts/lib/Array';

const printDay = (day: number, part1: any, part2: any, endsWithNewLine: boolean = true) => {
  console.log("-- DAY " + String(day).padStart(2, '0') + " --")
  console.log("Part 1 | " + part1)
  console.log("Part 2 | " + part2)
  if (endsWithNewLine) console.log()
}

const print = [
  [0, 0], // placeholders for now, these scipts don't exist (yet)
  [0, 0], // placeholders for now, these scipts don't exist (yet)
  [Day3.part1    /* 8252        */, Day3.part2   /* 2828           */],
  [Day4.part1    /* 466         */, Day4.part2   /* 865            */],
  [Day5.part1    /* FCVRLMVQP   */, Day5.part2   /* RWLWGJGFD      */],
  [Day6.part1    /* 1876        */, Day6.part2   /* 2202           */],
  [Day7.part1    /* 1315285     */, Day7.part2   /* 9847279        */],
  [Day8.part1    /* 1715        */, Day8.part2   /* 374400         */],
  [Day9.part1    /* X           */, Day9.part2   /* Y              */],
  [Day10.part1  /* X           */, Day10.part2  /* Y              */],
  [Day11.part1  /* X           */, Day11.part2  /* Y              */],
  [Day12.part1  /* X           */, Day12.part2  /* Y              */],
  [Day13.part1  /* X           */, Day13.part2  /* Y              */],
  [Day14.part1  /* X           */, Day14.part2  /* Y              */],
  [Day15.part1  /* X           */, Day15.part2  /* Y              */],
  [Day16.part1  /* X           */, Day16.part2  /* Y              */],
  [Day17.part1  /* X           */, Day17.part2  /* Y              */],
  [Day18.part1  /* X           */, Day18.part2  /* Y              */],
  [Day19.part1  /* X           */, Day19.part2  /* Y              */],
  [Day20.part1  /* X           */, Day20.part2  /* Y              */],
  [Day21.part1  /* X           */, Day21.part2  /* Y              */],
  [Day22.part1  /* X           */, Day22.part2  /* Y              */],
  [Day23.part1  /* X           */, Day23.part2  /* Y              */],
  [Day24.part1  /* X           */, Day24.part2  /* Y              */],
  [Day25.part1  /* X           */, Day25.part2  /* Y              */],
].map(map(String)) as [string, string][]

// @fix?
// const ordStringLength: Ord<string> = fromCompare((a, b) => NumberOrd.compare(a.length, b.length))
// const largestString = (xs: string[]) => xs.reduce((a, b) => max(ordStringLength)(a, b))
// console.log(largestString(["a", "bbbdas", "haa"]))

// let columnWidths = print[0].map(_ => 0)
const [columndWidthP1, columndWidthP2] = print
.reduce((prev, curr) => {
  return prev.map((x, i) => Math.max(x, curr[i].length))
}, print[0].map(_ => 0))

const c = {
  "top": "─",
  "top-T": "┬",
  "top-left-corner": "┌",
  "top-right-corner": "┐",
  "left": "│",
  "left-T-middle": "├",
  "right": "│",
  "right-T-middle": "┤",
  "middle-vertical": "│",
  "middle-horizontal": "─",
  "bottom": "─",
  "bottom-T": "┴",
  "bottom-left-corner": "└",
  "bottom-right-corner": "┘",
  "crossing": "┼",
}

console.log(c['top-left-corner'] + c.top.repeat(5) + c['top-T'] + c.top.repeat(columndWidthP1 + 2) + c['top-T'] + c.top.repeat(columndWidthP2 + 2) + c['top-right-corner'])
const header = [c.left, "Day", c['middle-vertical'], "Part 1".padEnd(columndWidthP1, " "), c['middle-vertical'], "Part 2".padEnd(columndWidthP2, " "), c.right].join(" ")
console.log(header)
console.log(c['left-T-middle'] + c['middle-horizontal'].repeat(5) + c.crossing + c['middle-horizontal'].repeat(columndWidthP1 + 2) + c.crossing + c['middle-horizontal'].repeat(columndWidthP2 + 2) + c['right-T-middle'])
print.forEach(([p1, p2], i) => {
  console.log(c.left  + (String(i + 1).padStart(2, "0")).padStart(4, " ") + " " + c['middle-vertical'] + " " + p1.padEnd(columndWidthP1, " ") + " " + c['middle-vertical'] + " " + p2.padEnd(columndWidthP2, " ") + " " + c.right)
})
console.log(c['bottom-left-corner'] + c.top.repeat(5) + c['bottom-T'] + c.top.repeat(columndWidthP1 + 2) + c['bottom-T'] + c.top.repeat(columndWidthP2 + 2) + c['bottom-right-corner'])

const commandArguments = process.argv.slice(2)

if (!commandArguments[0] || commandArguments[0].includes('until')) {
  // Print only days up until the day that was given as argument when running the script
  const printUpUntilDay = Number(commandArguments[1]) || 25
  print.slice(0, printUpUntilDay).forEach(([one, two], i) => printDay(i + 1, one, two, i !== print.length - 1))
  exit()
}

const [one, two] = print[Number(commandArguments[0]) - 1]
printDay(Number(commandArguments[0]), one, two)
