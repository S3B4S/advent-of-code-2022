const part1Function = `export const solvePart1 = (input: string) => {
  return 0
}
`;

const part2Function = `
export const solvePart2 = (input: string) => {
  return 0
}
`;

const testFile = day => `import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts"
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

Deno.test("Day ${day} - Part 2 - File input", () => {
  assertEquals(0, solvePart2(fileInput))
})
`;

for (let i = 10; i <= 25; i++) {
  const folderName = `day-${i}`;

  Deno.writeTextFileSync(`./${folderName}/index.ts`, part1Function + part2Function);
  Deno.writeTextFileSync(`./${folderName}/index.test.ts`, testFile(i));
}
