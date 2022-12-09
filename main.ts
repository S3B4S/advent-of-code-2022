import { exit } from 'process';
import * as Day3 from './03_rucksack-reorganization'
import * as Day4 from './04_camp-cleanup'
import * as Day5 from './05_supply-stacks'
import * as Day6 from './06_tuning-trouble';
import * as Day7 from './07_no-space-left-on-device';
import * as Day8 from './08_treetop-tree-house';
import * as Day9 from './09_rope-bridge';
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
import { map } from 'fp-ts/lib/Array';

const solutions = [
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
  "space": " ",
}

const logTable = (table: string[][], spacePadding: number = 0) => {
  const [header, ...data] = table
  const columnWidths = table.reduce((prev, curr) => {
      return prev.map((x, i) => Math.max(x, curr[i].length))
    }, table[0].map(_ => 0))
    .map(width => width + spacePadding * 2)

  const toLog = [
    c['top-left-corner'] + columnWidths.map(width => c.top.repeat(width)).join(c['top-T']) + c['top-right-corner'],
    c.left + header.map((h, i) => c.space.repeat(spacePadding) + h.padEnd(columnWidths[i] - spacePadding * 2, c.space) + c.space.repeat(spacePadding)).join(c['middle-vertical']) + c.right,
    c['left-T-middle'] + columnWidths.map(width => c['middle-horizontal'].repeat(width)).join(c.crossing) + c['right-T-middle'],
    ...data.map(row => 
      c.left + row.map((cell, i) => c.space.repeat(spacePadding) + cell.padEnd(columnWidths[i] - spacePadding * 2, c.space) + c.space.repeat(spacePadding)).join(c['middle-vertical']) + c.right
    ),
    c['bottom-left-corner'] + columnWidths.map(width => c.bottom.repeat(width)).join(c['bottom-T']) + c['bottom-right-corner'],
  ]
  
  toLog.forEach(e => console.log(e))
}

const header = ["Days", "Part 1", "Part 2"]
const printableRow = (day: number, row: string[]) => ["Day " + String(day).padStart(2, "0"), ...row]

const commandArguments = process.argv.slice(2)

// Print all days or up until given day with --until enabled
if (!commandArguments[0] || commandArguments[0].includes('until')) {
  const endDay = Number(commandArguments[1]) || 25
  logTable([
    header,
    ...solutions.slice(0, endDay).map((d, i) => printableRow(i + 1, d))
  ], 1)

  exit()
}

const dayIndex = Number(commandArguments[0]) - 1
const day = solutions[dayIndex]
logTable([
  header,
  printableRow(dayIndex + 1, day),
], 1)
