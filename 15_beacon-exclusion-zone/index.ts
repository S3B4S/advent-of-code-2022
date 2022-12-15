import { monpar } from "deps"
import { parseNumber } from "../parsing.ts"
const { liftAs, sentence, char, many, token } = monpar

interface Coordinate {
  y: number
  x: number
}

interface SensorBeaconCoordinates {
  sensor: Coordinate,
  beacon: Coordinate,
}

export const parseLine = liftAs<SensorBeaconCoordinates>(
  () => (sensorX: number) => () => (sensorY: number) => () => (negativeX: string[]) => (beaconX: number) => () => (negativeY: string[]) => (beaconY: number) => {
    return {
      sensor: {
        x: sensorX,
        y: sensorY,
      },
      beacon: {
        x: negativeX.length > 0 ? -1 * beaconX : beaconX,
        y: negativeY.length > 0 ? -1 * beaconY : beaconY,
      }
    }
  },
  sentence("Sensor at x="),
  parseNumber,
  sentence(", y="),
  parseNumber,
  sentence(": closest beacon is at x="),
  many(char("-")),
  parseNumber,
  sentence(", y="),
  many(char("-")),
  parseNumber,
)

export const parseInput = liftAs<SensorBeaconCoordinates[]>(
  (inputs: SensorBeaconCoordinates[]) => inputs,
  many(token(parseLine)),
)

export const solvePart1 = (input: string) => {
  return 0
}

export const solvePart2 = (input: string) => {
  return 0
}
