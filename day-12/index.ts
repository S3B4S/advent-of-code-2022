import { addLists, Coordinate } from 'utils'

class PriorityQueue<T> {
  items: T[]

  constructor() {
    this.items = []
  }
}

export const isAtMostOneElevated = (currentTile: string, targetTile: string) => {
  if (currentTile === "S") {
    currentTile = "a"
  } else if (currentTile === "E") {
    currentTile = "z"
  }
  
  if (targetTile === "S") {
    targetTile = "a"
  } else if (targetTile === "E") {
    targetTile = "z"
  }
  return targetTile.charCodeAt(0) - 1 <= currentTile.charCodeAt(0)
}

const Direction = {
  North: [-1, 0],
  East: [0, 1],
  South: [1, 0],
  West: [0, -1],
}

const dirs = Object.values(Direction)

interface DijkstraEntry {
  id: string
  coordinate: Coordinate // "0,0"
  visited: boolean
  cost: number // lowest cost to reach this
}

const dijkstra = (grid: string[][], startingLocation: Coordinate): number => {
  const lookup: Record<string, DijkstraEntry> = {}

  let endLocation: Coordinate = [-1, -1];

  // Add to lookup table
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      if (grid[y][x] === "E") endLocation = [y, x]
      lookup[[y, x].toString()] = {
        id: [y, x].toString(),
        coordinate: [y, x],
        visited: false,
        cost: Number.MAX_VALUE,
      }
    }
  }

  // Add starting location
  lookup[startingLocation.toString()] = {
    id: startingLocation.toString(),
    coordinate: startingLocation,
    visited: false,
    cost: 0,
  }

  const queue = [lookup[startingLocation.toString()]]

  while (queue.length !== 0) {
    const currentLocation = queue.shift()!
    const [currentX, currentY] = currentLocation.coordinate
    currentLocation.visited = true

    for (const dir of dirs) {
      const res = addLists(dir, currentLocation.coordinate) as Coordinate      
      
      // If neighbour is not acceptable target, go next
      if (   !lookup[res.toString()]
          || !isAtMostOneElevated(grid[currentX][currentY], grid[res[0]][res[1]])
          || queue.some(q => q.id === res.toString())
        ) continue
      
      // Record the cost to get to that location
      const dijkstrEntry = lookup[res.toString()]

      if (currentLocation.cost + 1 < dijkstrEntry.cost)
        dijkstrEntry.cost = currentLocation.cost + 1
      

      if (!lookup[res.toString()].visited)
        queue.push(lookup[res.toString()])
    }
  }

  return lookup[endLocation.toString()].cost
}


export const solvePart1 = (input: string) => {
  let startLocation: Coordinate = [-1, -1]
  const grid = input
    .trim()
    .split('\n')
    .map((line, rowIndex) => line.split('').map((cell, columnIndex) => {
      if (cell === "S") startLocation = [rowIndex, columnIndex]
      return cell
    }))

  const amountSteps = dijkstra(grid, startLocation)
  return amountSteps
}

export const solvePart2 = (input: string) => {
  const startingLocations: Coordinate[] = []
  const grid = input
    .trim()
    .split('\n')
    .map((line, rowIndex) => line.split('').map((cell, columnIndex) => {
      if (cell === "S" || cell === "a") startingLocations.push([rowIndex, columnIndex])
      return cell
    }))

  const distances = startingLocations.map(startingLocation => dijkstra(grid, startingLocation)).filter(n => n)
  return Math.min(...distances)
}
