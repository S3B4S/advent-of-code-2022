#!/usr/bin/env -S deno run --allow-env --allow-read --allow-write --allow-net

const YEAR = 2022
const COOKIE = Deno.env.get("AOC_COOKIE")
const default_day = new Date().getDate()
const [day_arg, directoryName] = Deno.args
const DAY = (day_arg ?? String(default_day)).padStart(2, '0')

console.log("Fetching the puzzle input for day: " + DAY)
const resp = await fetch(`https://adventofcode.com/${YEAR}/day/${DAY}/input`, {
  headers: {
    cookie: `session=${COOKIE}`,
  }
})
const input = await resp.text()

const dir = directoryName ?? `day-${DAY}`
const destination = `./${dir}/input.txt`

console.log("Writing the puzzle input to: " + destination)
Deno.writeTextFileSync(destination, input)
