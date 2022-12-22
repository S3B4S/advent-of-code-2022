import { lines } from '../utilts.ts'

type Coordinate = [
  number, // x
  number, // y
  number, // z
]

const checkAdjacent = (map: Record<string, boolean>, [x, y, z]: Coordinate) => {
  let openAirCount = 6
  
  // Check x axis
  if (map[[x + 1, y, z].toString()]) openAirCount--
  if (map[[x - 1, y, z].toString()]) openAirCount--
  
  // Check y axis
  if (map[[x, y + 1, z].toString()]) openAirCount--
  if (map[[x, y - 1, z].toString()]) openAirCount--
  
  // Check z axis
  if (map[[x, y, z + 1].toString()]) openAirCount--
  if (map[[x, y, z - 1].toString()]) openAirCount--

  return openAirCount
}

export const solvePart1 = (input: string) => {
  const coordinates: Coordinate[] = lines(input).map(l => {
    return l.split(',').map(c => Number(c)) as Coordinate
  })
  
  const map: Record<string, boolean> = {}

  coordinates.forEach(coordinate => [
    map[coordinate.toString()] = true
  ])

  return coordinates.reduce((count, coord) => count + checkAdjacent(map, coord), 0)
}

// Assumptions:
// - We can start looking from (-2, -2, -2) to find all the spaces that are reachable
// - We're bounding the space at (30, 30, 30)
const BOUNDARIES: {
  low: Coordinate,
  high: Coordinate,
} = {
  low: [-2, -2, -2],
  high: [30, 30, 30],
}

const checkAdjacentOpenAir = (openAirMap: Record<string, boolean>, [x, y, z]: Coordinate) => {
  let openAirCount = 0
  
  // Check x axis
  if (openAirMap[[x + 1, y, z].toString()]) openAirCount++
  if (openAirMap[[x - 1, y, z].toString()]) openAirCount++
  
  // Check y axis
  if (openAirMap[[x, y + 1, z].toString()]) openAirCount++
  if (openAirMap[[x, y - 1, z].toString()]) openAirCount++
  
  // Check z axis
  if (openAirMap[[x, y, z + 1].toString()]) openAirCount++
  if (openAirMap[[x, y, z - 1].toString()]) openAirCount++

  return openAirCount
}

const adjacentCoordinates = ([x, y, z]: Coordinate): Coordinate[] => {
  const res = [
    [x + 1, y, z],
    [x - 1, y, z],
    [x, y + 1, z],
    [x, y - 1, z],
    [x, y, z + 1],
    [x, y, z - 1],
  ]

  return res.filter(([x, y, z]) =>
    BOUNDARIES.low[0] <= x && x <= BOUNDARIES.high[0] &&
    BOUNDARIES.low[1] <= y && y <= BOUNDARIES.high[1] &&
    BOUNDARIES.low[2] <= z && z <= BOUNDARIES.high[2]
  ) as Coordinate[]
}

export const solvePart2 = (input: string) => {
  const coordinates: Coordinate[] = lines(input).map(l => {
    return l.split(',').map(c => Number(c)) as Coordinate
  })
  
  const dropletsMap: Record<string, boolean> = {}

  coordinates.forEach(coordinate => [
    dropletsMap[coordinate.toString()] = true
  ])

  const openAirMap: Record<string, boolean> = {}
  const stack: Coordinate[] = [BOUNDARIES.low]

  while (stack.length !== 0) {
    const adjacentCoords = adjacentCoordinates(stack.pop()!)
    adjacentCoords
      .filter((coords) => !(dropletsMap[coords.toString()] || openAirMap[coords.toString()]))
      .forEach(coords => {
        openAirMap[coords.toString()] = true
        stack.push(coords)
      })
  }

  return coordinates.reduce((count, coord) => count + checkAdjacentOpenAir(openAirMap, coord), 0)
}
