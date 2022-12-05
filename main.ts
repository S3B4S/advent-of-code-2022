import * as Day3 from './day-03'
import * as Day4 from './day-04'
import * as Day5 from './day-05'

const printDay = (day: number, part1: any, part2: any, endsWithNewLine: boolean = true) => {
  console.log("-- DAY " + String(day).padStart(2, '0') + " --")
  console.log("Part 1 | " + part1)
  console.log("Part 2 | " + part2)
  if (endsWithNewLine) console.log()
}

const print: [number, any, any][] = [
  [3, Day3.part1 /* 8252 */, Day3.part2 /* 2828 */],
  [4, Day4.part1 /* 466 */, Day4.part2 /* 865 */],
  [5, Day5.part1 /* X */, Day5.part2 /* Y */],
]

print.forEach(([d, one, two], i) => printDay(d, one, two, i !== print.length - 1))
