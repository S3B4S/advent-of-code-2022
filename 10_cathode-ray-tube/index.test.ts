import { assertEquals } from "deps"
import { solvePart1, solvePart2 } from "./index.ts"

const exampleInput = Deno.readTextFileSync('./10_cathode-ray-tube/large-example-input.txt')
const fileInput = Deno.readTextFileSync('./10_cathode-ray-tube/input.txt')

Deno.test("Day 10 - Part 1 - Example input", () => {
  assertEquals(13140, solvePart1(exampleInput))
})

Deno.test("Day 10 - Part 1 - File input", () => {
  assertEquals(17840, solvePart1(fileInput))
})

const part2ExampleInputExpected = `
██  ██  ██  ██  ██  ██  ██  ██  ██  ██  
███   ███   ███   ███   ███   ███   ███ 
████    ████    ████    ████    ████    
█████     █████     █████     █████     
██████      ██████      ██████      ████
███████       ███████       ███████     
`.trimStart()

Deno.test("Day 10 - Part 2 - Example input", () => {
  assertEquals(part2ExampleInputExpected, solvePart2(exampleInput))
})

const part2InputExpected = `
████  ██  █     ██  █  █ █    ███   ██  
█    █  █ █    █  █ █  █ █    █  █ █  █ 
███  █  █ █    █    █  █ █    █  █ █    
█    ████ █    █ ██ █  █ █    ███  █ ██ 
█    █  █ █    █  █ █  █ █    █    █  █ 
████ █  █ ████  ███  ██  ████ █     ███ 
`.trimStart()

Deno.test("Day 10 - Part 2 - File input", () => {
  assertEquals(part2InputExpected, solvePart2(fileInput))
})
