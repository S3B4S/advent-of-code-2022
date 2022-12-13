# Advent of Code 2022 Solutions

This repository contains my solutions for the [Advent of Code 2022 challenges](https://adventofcode.com/2022). The environment used is [deno](https://deno.land/).

## Directory structure

The root of the repository contains a folder for each day of the challenge, named `01_calorie-counting`, `02_rock-paper-scissors`, etc. Each day's folder contains a script that contains my solution for that day. The solutions are written in either TypeScript or Haskell, though primarily TypeScript.

In addition, the `/scripts` folder contains utility scripts that automate some tasks for me. There is also a README in that directory with further instructions.

## Installing Deno

To install deno, follow the instructions on the [deno website](https://deno.land/manual@v1.28.3/getting_started/installation).

## Usage with Deno

To run the tests for a given day, use the following command:

```
$ deno test --allow-read ./<day>/
```

To run all the tests, use the following command:

```
$ deno test --allow-read
```

The flag `--allow-read` is needed since Deno sandboxes the running programs, and does not allow them to read from the filesystem by default. In these tests, we want to read from the `input.txt` files that contain the inputs from the solutions.


## Haskell

If the solution for a specific day is written in Haskell, you will need to use `cd` into the days folder and then use `runhaskell` to run it, like this:

```
$ cd ./<day>/
$ runhaskell <script>.hs
```

## Adding inputs

If you want to add your own inputs, you can do so. Each test file will read from a sibling `input.txt`. For example, tests run in `./04_camp-cleanup` will attempt to read the input from `./04_camp-cleanup/input.txt`. So, you can add an `input.txt` there and insert your own inputs. You can find a script in the `/scripts` folder that can help you out with downloading the AoC inputs and put them in `input.txt` files in the correct location(s) automatically.

---

*This README.md was partly generated by a large language model trained by OpenAI and known as ChatGPT. You can learn more about ChatGPT at https://openai.com/blog/chatgpt/.*
