import { Board, Characters, Direction, coordinateToString, CoordinateRecord, northRow, eastColumn, southRow, westColumn, addCoordinate, relativeCoordinates, countBy, equalCoordinates } from "utils"

const C = {
  Elf: Characters.HashTag,
  OpenSpace: Characters.Dot,
}

export const solvePart1 = (input: string) => {
  const board = new Board(input.trim())

  const elfPositions: Record<string, { currentPosition: CoordinateRecord, candidate: CoordinateRecord }> = { }

  // init
  board.forEach((tile, coord) => {
    if (tile === C.Elf) {
      elfPositions[coordinateToString(coord)] = { currentPosition: coord, candidate: coord }
    }
  })

  console.log(elfPositions)

  // Determine new positions
  for (const [elfId, elfPosition] of Object.entries(elfPositions)) {
    if (board.adjacentTiles(elfPosition.currentPosition).every(tile => tile === C.OpenSpace)) {
      continue
    }

    if (board.adjacentTilesWithCoordinates(elfPosition.currentPosition, northRow)
             .every(c => c.tile === C.OpenSpace)
    ) {
      const newPosition = addCoordinate(elfPosition.currentPosition, relativeCoordinates[Direction.North])
      elfPositions[elfId].candidate = newPosition
      continue
    }
    
    if (board.adjacentTilesWithCoordinates(elfPosition.currentPosition, southRow)
             .every(c => c.tile === C.OpenSpace)
    ) {
      const newPosition = addCoordinate(elfPosition.currentPosition, relativeCoordinates[Direction.South])
      elfPositions[elfId].candidate = newPosition
      continue
    }
    
    if (board.adjacentTilesWithCoordinates(elfPosition.currentPosition, westColumn)
             .every(c => c.tile === C.OpenSpace)
    ) {
      const newPosition = addCoordinate(elfPosition.currentPosition, relativeCoordinates[Direction.West])
      elfPositions[elfId].candidate = newPosition
      continue
    }
    
    if (board.adjacentTilesWithCoordinates(elfPosition.currentPosition, eastColumn)
             .every(c => c.tile === C.OpenSpace)
    ) {
      const newPosition = addCoordinate(elfPosition.currentPosition, relativeCoordinates[Direction.East])
      elfPositions[elfId].candidate = newPosition
      continue
    }
  }

  console.log(elfPositions)

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

  console.log({onlyMoveTo})

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

  console.log(board)

  return 0
}

export const solvePart2 = (input: string) => {
  return 0
}
