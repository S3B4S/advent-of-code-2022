import { Board, Characters, Direction, coordinateToString, CoordinateRecord, northRow, eastColumn, southRow, westColumn, addCoordinate, relativeCoordinates, countBy, equalCoordinates, range } from "utils"

const C = {
  Elf: Characters.HashTag,
  OpenSpace: Characters.Dot,
}

const setupCyclicOrder = () => {
  const order = [Direction.North, Direction.South, Direction.West, Direction.East]
  let startIndex = -1

  return () => { 
    startIndex = startIndex + 1 % order.length
    return Array.from({ length: order.length }).map((_, i) => order[(i + startIndex) % order.length])
  }
}

const boundaryToCheck: Record<Direction, Direction[]> = {
  [Direction.North]: northRow,
  [Direction.East]: eastColumn,
  [Direction.South]: southRow,
  [Direction.West]: westColumn,
  [Direction.NorthWest]: [],
  [Direction.NorthEast]: [],
  [Direction.SouthWest]: [],
  [Direction.SouthEast]: [],
}

export const solvePart1 = (input: string) => {
  const inputLines = input.trim().split('\n')
  const toAdd = 10
  const addedColumns = inputLines.map(row => C.OpenSpace.repeat(toAdd) + row + C.OpenSpace.repeat(toAdd))
  const fakeRow = C.OpenSpace.repeat(addedColumns[0].length) + "\n"
  const newBoardStr = fakeRow.repeat(toAdd) + addedColumns.join('\n') + "\n" + fakeRow.repeat(toAdd)
  
  const board = new Board(newBoardStr.trim())

  const elfPositions: Record<string, { currentPosition: CoordinateRecord, candidate: CoordinateRecord }> = { }

  // init
  board.forEach((tile, coord) => {
    if (tile === C.Elf) {
      elfPositions[coordinateToString(coord)] = { currentPosition: coord, candidate: coord }
    }
  })

  const getOrder = setupCyclicOrder()

  let order = getOrder()

  // Determine new positions
  for (const _ of range(0, 1000)) {
    outerloop:
    for (const [elfId, elfPosition] of Object.entries(elfPositions)) {
      if (board.adjacentTiles(elfPosition.currentPosition).every(tile => tile === C.OpenSpace)) {
        continue outerloop
      }

      
      for (const direction of order) {
        if (board.adjacentTilesWithCoordinates(elfPosition.currentPosition, boundaryToCheck[direction])
                .every(c => c.tile === C.OpenSpace)
        ) {
          const newPosition = addCoordinate(elfPosition.currentPosition, relativeCoordinates[direction])
          elfPositions[elfId].candidate = newPosition
          continue outerloop
        }
      }
    }

    // Find the duplicate candidates
    const countCandidates = Object.values(elfPositions)
      .reduce((count, position) => {
        return {
          ...count,
          [coordinateToString(position.candidate)]: count[coordinateToString(position.candidate)] ? { count: count[coordinateToString(position.candidate)].count + 1, coordinate: position.candidate } : { count: 1, coordinate: position.candidate }
        }
      }, {} as Record<string, { count: number, coordinate: CoordinateRecord }>)

    const onlyMoveTo = Object.values(countCandidates)
      .filter(dict => dict.count === 1)
      .map(dict => dict.coordinate)

    // At this point, each current position has become the old position, so
    // draw empty spaces on the board for those positions
    Object.values(elfPositions).forEach(elf => board.set(elf.currentPosition, C.OpenSpace))

    // For the elves, if their candidate is in onlyMoveTo,
    // then set currentPosition to it,
    // else keep on currentPosition
    for (const elf of Object.values(elfPositions)) {
      if (onlyMoveTo.some(c => equalCoordinates(c, elf.candidate))) {
        elf.currentPosition = elf.candidate
      } else {
        elf.candidate = elf.currentPosition
      }
    }

    // At this point, elves current- & candidate positions are the same
    // and correctly updated, update the board with it
    Object.values(elfPositions).forEach(elf => board.set(elf.currentPosition, C.Elf))
    
    order = getOrder()
  }

  console.log(board.toString())

  return 0
}

export const solvePart2 = (input: string) => {
  return 0
}
