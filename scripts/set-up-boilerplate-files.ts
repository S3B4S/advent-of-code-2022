#!/usr/bin/env -S deno run --allow-env --allow-read --allow-write

import { existsSync } from "https://deno.land/std/fs/mod.ts"

const [from, to] = Deno.args

const indexFile = `// deno-lint-ignore-file
// @TODO Remove above line when starting on this day

export const solvePart1 = (input: string) => {
  return 0
}

export const solvePart2 = (input: string) => {
  return 0
}
`

const testFile = (day: number) => `import { assertEquals } from "deps"
import { solvePart1, solvePart2 } from "./index.ts"

const exampleInput = \`

\`

const fileInput = Deno.readTextFileSync('./day-${day}/input.txt')

Deno.test("Day ${day} - Part 1 - Example input", () => {
  assertEquals(0, solvePart1(exampleInput))
})

Deno.test("Day ${day} - Part 1 - File input", () => {
  assertEquals(0, solvePart1(fileInput))
})

Deno.test("Day ${day} - Part 2 - Example input", () => {
  assertEquals(0, solvePart2(exampleInput))
})

Deno.test("Day ${day} - Part 2 - File input", () => {
  assertEquals(0, solvePart2(fileInput))
})
`;

for (let i = Number(from); i <= Number(to); i++) {
  const folderPath = `./day-${i}`;
  
  if (!existsSync(folderPath))
    Deno.mkdirSync(folderPath)
  
  Deno.writeTextFileSync(`${folderPath}/index.ts`, indexFile);
  Deno.writeTextFileSync(`${folderPath}/index.test.ts`, testFile(i));
}
