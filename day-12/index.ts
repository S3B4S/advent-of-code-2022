import { addLists, Coordinate } from 'utils'

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

interface DijkstraEntry {
  coordinate: string // "0,0"
  visited: boolean
  cost: number // lowest cost to reach this
}

const dijkstra = (grid: string[][], startingLocation: Coordinate): number | undefined => {
  const lookup: Record<string, DijkstraEntry> = {}

  lookup[startingLocation.toString()] = {
    coordinate: startingLocation.toString(),
    visited: false,
    cost: 0,
  }

  let endLocation: Coordinate = [-1, -1];

  const queue = [startingLocation]

  while (queue.length !== 0) {
    const currentCoordiantes = queue.shift()!
    const currentLocation = lookup[currentCoordiantes.toString()]

    currentLocation.visited = true

    const neighbours = Object.values(Direction)
      .map(direction => addLists(direction, currentCoordiantes) as Coordinate)
      .filter(candidate => 
        // Candidate is not out of bounds
        !(candidate[0] < 0 || candidate[0] > grid.length - 1 || candidate[1] < 0 || candidate[1] > grid[0].length - 1)
        // And is at most one elevation higher
        && isAtMostOneElevated(grid[currentCoordiantes[0]][currentCoordiantes[1]], grid[candidate[0]][candidate[1]])
      )

    neighbours.forEach(neighbour => {
      // Save location of E
      if (grid[neighbour[0]][neighbour[1]] === "E") {
        endLocation = neighbour
      }
        
      // Add any neighbours to lookup table if not previously seen
      if (!lookup[neighbour.toString()]) {
        lookup[neighbour.toString()] = {
          coordinate: neighbour.toString(),
          visited: false,
          cost: Number.MAX_VALUE,
        }
      }

      // Record the cost to get to that location
      const dijkstrEntry = lookup[neighbour.toString()]

      if (currentLocation.cost + 1 < dijkstrEntry.cost) {
        dijkstrEntry.cost = currentLocation.cost + 1
      }
    })

    // Only add those that have not been visited before to queue
    neighbours
      .filter(candidate => !lookup[candidate.toString()].visited)
      .forEach(c => queue.push(c))
  }

  return lookup[endLocation.toString()].cost

}


export const solvePart1 = (input: string) => {
  let startLocation: Coordinate = [-1, -1]
  const grid = input.trim().split('\n').map((line, rowIndex) => line.split('').map((cell, columnIndex) => {
    if (cell === "S") startLocation = [rowIndex, columnIndex]
    return cell
  }))

  const amountSteps = dijkstra(grid, startLocation)
  return amountSteps
}

export const solvePart2 = (input: string) => {
  return 0
}
