#!/usr/bin/env node

/*
# Description
This file has been generated by chatgpt, adjustments have been added by the author

# Edits
The edits I had to add were:

## Cookie
Add the line `const cookie = process.env.COOKIE`

## Output folder
I did not ask this of the ai, so it makes sense it was not in the script.
```diff
- fs.writeFileSync(`input.txt`, input);
+ fs.writeFileSync(`./day-${String(day).padStart(2, '0')}/input.txt`, input);
```
*/

const fs = require('fs');
const https = require('https');

// Get the year and day from the command line arguments
const cookie = process.env.COOKIE
const year = new Date().getFullYear();
const day = process.argv[2];

// Function to download the puzzle input
async function downloadPuzzleInput() {
  return new Promise((resolve, reject) => {
    // Set the request options
    const options = {
      hostname: 'adventofcode.com',
      port: 443,
      path: `/${year}/day/${day}/input`,
      method: 'GET',
      headers: {
        cookie: `session=${cookie}`,
      },
    };

    // Make the request
    const req = https.request(options, (res) => {
      // Check the response status code
      if (res.statusCode !== 200) {
        reject(`Error: ${res.statusCode}`);
        return;
      }

      // Concatenate the chunks of data into a single string
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });

      // Resolve the promise with the data when the response ends
      res.on('end', () => {
        resolve(data);
      });
    });

    // Reject the promise if there is an error
    req.on('error', (error) => {
      reject(error);
    });

    // End the request
    req.end();
  });
}

// Download the puzzle input
downloadPuzzleInput()
  .then((input) => {
    // Write the puzzle input to the "input.txt" file
    fs.writeFileSync(`./day-${String(day).padStart(2, '0')}/input.txt`, input);
  })
  .catch((error) => {
    // Print any error that occurred
    console.error(error);
  });
