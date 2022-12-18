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

  let openAirCount = 0
  coordinates.forEach(coord => {
    openAirCount += checkAdjacent(map, coord)
  })

  return openAirCount
}

export const solvePart2 = (input: string) => {
  return 0
}
