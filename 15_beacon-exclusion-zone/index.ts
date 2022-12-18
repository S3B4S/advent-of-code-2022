import { monpar } from "deps"
import { parseNumber } from "../parsing.ts"
const { liftAs, sentence, char, many, token, unpack } = monpar

interface Coordinate {
  y: number
  x: number
}

interface SensorBeaconCoordinates {
  sensor: Coordinate
  beacon: Coordinate
  manhattanDistance: number
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
      },
      manhattanDistance: manhattanDistance({ x: sensorX, y: sensorY }, { x: negativeX.length > 0 ? -1 * beaconX : beaconX, y: negativeY.length > 0 ? -1 * beaconY : beaconY })
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

const manhattanDistance = (coordiante: Coordinate, other: Coordinate) => {
  return Math.abs(other.x - coordiante.x) + Math.abs(other.y - coordiante.y)
}

enum Tile { Beacon = "B", Sensor = "S", Signal = "s" }

export const parseInput = liftAs<SensorBeaconCoordinates[]>(
  (inputs: SensorBeaconCoordinates[]) => inputs,
  many(token(parseLine)),
)

export const solvePart1 = (input: string, checkRow: number) => {
  const beaconSensors = unpack(parseInput)(input)!

  // For every sensor, exclude if they're not within the range of the row that needs to check
  // range being [y coordiante - manhattanDistance, y coordinate + manhattanDistance]

  const map: Record<string, Tile> = {}
  const relevantBs = beaconSensors.filter(bs => bs.sensor.y - bs.manhattanDistance <= checkRow && checkRow <= bs.sensor.y + bs.manhattanDistance)

  relevantBs.forEach(bs => {
    const coords = surroundByCoordinatesOnRow(bs.sensor, bs.manhattanDistance, checkRow)
    coords.forEach(cds => {
      if (cds[0] === checkRow) {
        map[cds.toString()] = Tile.Signal
      }
    })
  })

  // Then add all beacon / sensor coordinates, overwriting the signals
  relevantBs.forEach(bs => {
    if (bs.sensor.y === checkRow) {
      map[[bs.sensor.y, bs.sensor.x].toString()] = Tile.Sensor
    }
    if (bs.beacon.y === checkRow) {
      map[[bs.beacon.y, bs.beacon.x].toString()] = Tile.Beacon
    }
  })

  // Count the amount of signal tiles on the row we're checking for
  return Object.entries(map).filter(([k, v]) => {
    const coords = k.split(',').map(c => Number(c)) as [number /* Y */, number /* X */]
    return coords[0] === checkRow && v === Tile.Signal
  }).length
}

export const solvePart2 = (input: string) => {
  return 0
}

const surroundByCoordinatesOnRow = (coordinate: Coordinate, distance: number, checkRow: number): [number /* Y */, number /* X */][] => {
  const coords: [number, number][] = []
  const yDelta = Math.abs(checkRow - coordinate.y)
  const rangeX = distance - yDelta

  for (let x = coordinate.x - rangeX; x <= coordinate.x + rangeX; x++) {
    coords.push([checkRow, x])
  }

  return coords
}

const surroundingCoordinates = (coordinate: Coordinate, distance: number): [number /* Y */, number /* X */][] => {
  const coords: [number, number][] = []
  let rangeX = distance

  // Lower triangle
  while(rangeX >= 0) {
    const y = coordinate.y + distance - rangeX
    for (let x = coordinate.x - rangeX; x <= coordinate.x + rangeX; x++) {
      coords.push([y, x])
    }
    rangeX--
  }

  rangeX = distance - 1
  // Upper triangle
  while (rangeX >= 0) {
    const y = coordinate.y - (distance - rangeX)
    for (let x = coordinate.x - rangeX; x <= coordinate.x + rangeX; x++) {
      coords.push([y, x])
    }
    rangeX--
  }

  return coords
}
