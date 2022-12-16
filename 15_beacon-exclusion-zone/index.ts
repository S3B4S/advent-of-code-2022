import { monpar } from "deps"
import { Characters, range } from "utils"
import { parseNumber } from "../parsing.ts"
const { liftAs, sentence, char, many, token, unpack } = monpar

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

const manhattanDistance = (coordiante: Coordinate, other: Coordinate) => {
  return Math.abs(coordiante.x - other.x) + Math.abs(coordiante.y - other.y)
}

export const parseInput = liftAs<SensorBeaconCoordinates[]>(
  (inputs: SensorBeaconCoordinates[]) => inputs,
  many(token(parseLine)),
)

export const solvePart1 = (input: string) => {
  const coordinates = unpack(parseInput)(input)!

  // const bounds = {
  //   x: {
  //     max: Number.MIN_VALUE,
  //     min: Number.MAX_VALUE,
  //   },
  //   y: {
  //     max: Number.MIN_VALUE,
  //     min: Number.MAX_VALUE,
  //   }
  // }

  // Find bounds
  // for (const { beacon, sensor } of coordinates) {
  //   bounds.x.max = Math.max(...[bounds.x.max, beacon.x, sensor.x])
  //   bounds.x.min = Math.min(...[bounds.x.min, beacon.x, sensor.x, 0])

  //   bounds.y.max = Math.max(...[bounds.y.max, beacon.y, sensor.y])
  //   bounds.y.min = Math.min(...[bounds.y.min, beacon.y, sensor.y, 0])
  // }

  // Update coordinates by shifting
  // const shifted = coordinates.map(coordinate => ({
  //   sensor: {
  //     x: coordinate.sensor.x + Math.abs(bounds.x.min),
  //     y: coordinate.sensor.y + Math.abs(bounds.y.min),
  //   },
  //   beacon: {
  //     x: coordinate.beacon.x + Math.abs(bounds.x.min),
  //     y: coordinate.beacon.y + Math.abs(bounds.y.min),
  //   },
  // }))

  const map: string[][] = []
  for (const { beacon, sensor } of coordinates) {
    if (!map[beacon.y]) map[beacon.y] = []
    map[beacon.y][beacon.x] = "B"
    
    if (!map[sensor.y]) map[sensor.y] = []
    map[sensor.y][sensor.x] = "S"
  }

  fillEmptySpacesWith(map, Characters.Dot)

  for (const bs of coordinates) {
    // Draw lower triangle
    let distance = manhattanDistance(bs.sensor, bs.beacon)
    let y = bs.sensor.y

    // Draw last point (the lowest)
    if (map[bs.sensor.y + distance] && map[bs.sensor.y + distance][bs.sensor.x]) {
      map[bs.sensor.y + distance][bs.sensor.x] = Characters.HashTag
    }

    while (distance !== 0) {
      for (const x of range(Math.max(0, bs.sensor.x - distance), bs.sensor.x + distance + 1)) {
        if(map[y] && map[y][x] && map[y][x] === Characters.Dot)
          map[y][x] = Characters.HashTag
      }

      distance--
      y++
    }

    // Draw upper triangle
    distance = manhattanDistance(bs.sensor, bs.beacon)
    y = bs.sensor.y

    // Draw first point (the lowest)
    if (map[bs.sensor.y - distance] && map[bs.sensor.y - distance][bs.sensor.x]) {
      map[bs.sensor.y - distance][bs.sensor.x] = Characters.HashTag
    }

    while (distance !== 0) {
      for (const x of range(Math.max(0, bs.sensor.x - distance), bs.sensor.x + distance + 1)) {
        if(map[y] && map[y][x] && map[y][x] === Characters.Dot)
          map[y][x] = Characters.HashTag
      }

      distance--
      y--
    }
  }

  // console.log(stringifyMap(surroundByCoordinates(map)))

  return 0
}

export const solvePart2 = (input: string) => {
  return 0
}

const fillEmptySpacesWith = (map: string[][], filling: string) => {
  // Find the row with the most columns
  let maxAmountColumns = 0;

  map.forEach(row => {
    maxAmountColumns = Math.max(maxAmountColumns, row.length)
  })

  // For entire map, if there is an empty spot, insert space
  for (let row = 0; row < map.length; row++) {
    if (!map[row]) map[row] = []
    for (let column = 0; column < maxAmountColumns; column++) {
      if (!map[row][column]) map[row][column] = filling
    }
  }
}

// Goes up to 100s
const surroundByCoordinates = (map: any[][]) => [
  ['   ', ...Array.from({ length: map[0].length }).map((_, i) => String(i).padStart(3, '0')[0])], // 100s
  ['   ', ...Array.from({ length: map[0].length }).map((_, i) => String(i).padStart(3, '0')[1])], // 10s
  ['   ', ...Array.from({ length: map[0].length }).map((_, i) => String(i).padStart(3, '0')[2])], // 1s
  ...map.map((row, i) => [String(i).padStart(3, '0'), ...row, i])
]

const stringifyMap = (map: any[][]) => map.map(row => row.join('')).join('\n')
