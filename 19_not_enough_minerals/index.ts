import { monpar } from "deps";
import { lines } from "utils";

import { parseNumber } from "../parsing.ts";
const { sentence, liftAs, token, unpack } = monpar

const parseOreRobot = liftAs(
    () => (costOre: number) => () => ({ costOre }),
    sentence("Each ore robot costs "),
    parseNumber,
    sentence(" ore."),
)

const parseClayRobot = liftAs(
    () => (costOre: number) => () => ({ costOre }),
    sentence("Each clay robot costs "),
    parseNumber,
    sentence(" ore."),
)

const parseObsidianRobot = liftAs(
    () => (costOre: number) => () => (costClay: number) => () => ({ costClay, costOre }),
    sentence("Each obsidian robot costs "),
    parseNumber,
    sentence(" ore and "),
    parseNumber,
    sentence(" clay."),
)

const parseGeodeRobot = liftAs(
    () => (costOre: number) => () => (costObsidian: number) => () => ({ costOre, costObsidian }),
    sentence("Each geode robot costs "),
    parseNumber,
    sentence(" ore and "),
    parseNumber,
    sentence(" obsidian.")
)

interface Bots {
  blueprint: number,
  oreRobot: {
    costOre: number,
  },
  clayRobot: {
    costOre: number,
  },
  obsidianRobot: {
    costOre: number,
    costClay: number,
  },
  geodeRobot: {
    costOre: number,
    costObsidian: number,
  },
}

const parseLine = liftAs(
    (blueprint: number) => (oreRobot: { costOre: number }) => (clayRobot: { costOre: number }) => (obsidianRobot: { costOre: number, costClay: number }) => (geodeRobot: { costOre: number, costObsidian: number }) => ({
      blueprint,
      oreRobot: { costOre: oreRobot },
      clayRobot: { costOre: clayRobot },
      obsidianRobot: { costOre: obsidianRobot.costOre, costClay: obsidianRobot.costClay },
      geodeRobot: { costOre: geodeRobot.costOre, costObsidian: geodeRobot.costObsidian },
    }),
    token(liftAs(
        () => (blueprint: number) => () => blueprint,
        sentence("Blueprint "),
        parseNumber,
        sentence(":"),
    )),
    token(parseOreRobot),
    token(parseClayRobot),
    token(parseObsidianRobot),
    token(parseGeodeRobot),
)

export const solvePart1 = (input: string) => {
  const bots = lines(input).map(l => unpack(parseLine)(l))
  return 0
}

export const solvePart2 = (input: string) => {
  return 0
}
