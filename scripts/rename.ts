#!/usr/bin/env -S deno run --allow-env --allow-read --allow-write

// Import the necessary modules
import { join } from "https://deno.land/std/path/mod.ts";

// Define the function
async function updateInputFilename(day: string, newFolder: string) {
  // Define the paths to the folder and file
  const folder = `day-${day.padStart(2, '0')}`;
  const file = `index.test.ts`;
  const path = join(folder, file);

  // Read the file
  const contents = await Deno.readTextFile(path);

  // Update the contents of the file
  const updatedContents = contents.replace(`./day-${day}/input.txt`, `./${newFolder}/input.txt`);

  // Write the updated contents to the file
  await Deno.writeTextFile(path, updatedContents);

  // Rename the folder
  await Deno.rename(folder, newFolder);
}

// Get the command line arguments
const [day, newFolder] = Deno.args;

// Call the function
updateInputFilename(day, newFolder);
