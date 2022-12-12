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

const deptFirstSearchRec = (grid: string[][], visited: Set<string>, currentLocation: Coordinate): number | undefined => {
  // Base case
  if (grid[currentLocation[0]][currentLocation[1]] === "E") {
    return 0
  }
  
  // console.log({ currentLocation, visited })

  // Calculate possible locations
  const candidates: Coordinate[] = Object.values(Direction)
    .map(direction => addLists(direction, currentLocation) as Coordinate)
    // .map(x => { console.log(x); return x})
    .filter(candidate => 
      // And candidate is not out of bounds
      !(candidate[0] < 0 || candidate[0] > grid.length - 1 || candidate[1] < 0 || candidate[1] > grid[0].length - 1)
      // And we have not visited this location before
      && !visited.has(candidate.toString())
      // We can jump to candidate
      && isAtMostOneElevated(grid[currentLocation[0]][currentLocation[1]], grid[candidate[0]][candidate[1]])
    )

  // If there are no candidates, we're at a dead end
  if (candidates.length === 0) {
    return undefined
  }
  
  const newVisited = new Set(visited)
  newVisited.add(currentLocation.toString())
  const results = candidates.flatMap(nextLocation => {
    const res = deptFirstSearchRec(grid, newVisited, nextLocation)
    if (res === undefined) {
      return []
    } else {
      return 1 + res
    }
  })

  // All the candidates had reached a dead end
  if (results.length === 0) return undefined
  
  return Math.min(...results)
}


export const solvePart1 = (input: string) => {
  let startLocation: Coordinate = [-1, -1]
  const grid = input.trim().split('\n').map((line, rowIndex) => line.split('').map((cell, columnIndex) => {
    if (cell === "S") startLocation = [rowIndex, columnIndex]
    return cell
  }))

  const visited = new Set<string>()
  const amountSteps = deptFirstSearchRec(grid, visited, startLocation)
  return amountSteps
}

export const solvePart2 = (input: string) => {
  return 0
}
