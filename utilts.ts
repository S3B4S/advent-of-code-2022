type UnaryFn = (x: any) => any
type ArrayLast<T extends any[]> = T extends [...rest: infer _, last: infer Lst] ? Lst : never
type ParameterUnaryFn<T extends UnaryFn> = Parameters<T>[0]

// @ts-ignore, ArrayLast<T> is not playing nicely with ParameterUnaryFn, but the end type of `compose` is still what I want so
export const compose = <T extends UnaryFn[]>(...fns: T) => (x: ParameterUnaryFn<ArrayLast<T>>): ReturnType<T[0]> => {
  return fns.reduceRight((acc: any, fn: any) => fn(acc), x)
}

// @ts-ignore
export const pipe = <T extends UnaryFn[]>(fns: T, val: any): ReturnType<ArrayLast<T>> => {
  // @ts-ignore
  return compose(fns)(val)
}

export const sum = (a: number, b: number) => a + b
export const multiply = (a: number, b: number) => a * b

/**
 * Splits a given list in chunks of size N.
 * Size of last chunk may be smaller than N.
 * 
 * Example: chunksOfN(3)([1, 2, 3, 4, 5, 6, 7, 8]) -> [[1, 2, 3], [4, 5, 6], [7, 8]]
 * @param n size of each chunk
 * @returns list of chunks
 */
export const chunksOfN = (n: number) => <T>(input: T[]): T[][] => {
  if (input.length <= n) return [input]
  return [input.slice(0, n)].concat(chunksOfN(n)(input.slice(n)));
}

/**
 * Slides a window over string or array. For example, if n is 3 and input is "hello",
 * the function will return an array of substrings of length 3: ["hel", "ell", "llo"].
 * @param n the window size
 * @returns all scanned items
 */
export const sliding = (n: number) => (input: string): string[] => {
  if (input.length <= n) return [input]
  return [input.slice(0, n)].concat(sliding(n)(input.slice(1)))
}

export const countByC = <T>(predicate: (t: T) => boolean) => (list: T[]) => {
  return list.reduce((count, x) => count + Number(predicate(x)), 0)
}

export const countBy = <T>(predicate: (t: T) => boolean, list: T[]) => {
  return countByC(predicate)(list)
}

export const turn90DegClockWise = <T>(matrix: T[][]) => {
  const res = Array.from({ length: matrix[0].length }).map(() => [] as T[])
  
  for (let rowIndex = matrix.length - 1; rowIndex >= 0; rowIndex--) {
    const row = matrix[rowIndex]
    for (let elIndex = 0; elIndex < row.length; elIndex++) {
      const element = row[elIndex]
      res[elIndex].push(element)
    }
  }

  return res
}

export const takeWhile = <T>(predicate: (e: T) => boolean) => (list: T[]) => {
  const res = []
  for (const el of list) {
    if (predicate(el)) {
      res.push(el)
    } else {
      return res
    }
  }
  return res
}

export const dropWhile = <T>(predicate: (e: T) => boolean, list: T[]) => {
  const index = list.findIndex(e => !predicate(e))
  return list.slice(index)
}

export const map = <A, B>(fn: (a: A) => B) => (list: A[]) => list.map(fn)
export const filter = <T>(p: (a: T) => boolean) => (list: T[]) => list.filter(p)
export const reduce = <A, T>(fn: (a: A, el: T) => A) => (initValue: A) => (list: T[]) => list.reduce(fn, initValue)

export type Row = number
export type Column = number
export type Coordinate = [Row, Column]
export enum Direction {
  NorthWest = "NW",
  North = "N",
  NorthEast = "NE",
  East = "E",
  SouthEast = "SE",
  South = "S",
  SouthWest = "SW",
  West = "W",
}

export const opposite = (direction: Direction) => {
  switch (direction) {
    case Direction.North:
      return Direction.South
    case Direction.East:
      return Direction.West
    case Direction.South:
      return Direction.North
    case Direction.West:
      return Direction.East
  }
}

export const relativeCoordinates: Record<Direction, CoordinateRecord> = {
  [Direction.NorthWest]: { y: -1, x: -1 },
  [Direction.North]: { y: -1, x: 0 },
  [Direction.NorthEast]: { y: -1, x: 1 },
  [Direction.East]: { y: 0, x: 1 },
  [Direction.SouthEast]: { y: 1, x: 1 },
  [Direction.South]: { y: 1, x: 0 },
  [Direction.SouthWest]: { y: 1, x: -1 },
  [Direction.West]: { y: 0, x: -1 },
}

export const northRow = [Direction.NorthWest, Direction.North, Direction.NorthEast]
export const eastColumn = [Direction.NorthEast, Direction.East, Direction.SouthEast]
export const southRow = [Direction.SouthWest, Direction.South, Direction.SouthEast]
export const westColumn = [Direction.NorthWest, Direction.West, Direction.SouthWest]

/**
 * Iterates over the elements of a 2D map in a given direction from a starting point.
 *
 * @param coordinate The starting point [row, column] from which to begin the iteration.
 * @param map The 2D array to iterate over.
 * @returns An object with four properties: "North", "East", "South", and "West".
 * Each property is a function that takes a callback as an argument, and will call
 * the callback for each element in the map starting from the starting point in the
 * specified direction, until the callback returns a truthy value or the edge of the
 * map is reached.
 */
export const directionIterator = <T>([row, column]: Coordinate, map: T[][]) => {
  type CallbackFn = (t: T) => boolean
  return {
    North: (fn: CallbackFn) => {
      for (let targetRow = row - 1; targetRow >= 0; targetRow--) {
        if (fn(map[targetRow][column])) return
      }
    },
    East: (fn: CallbackFn) => {
      for (let targetColumn = column + 1; targetColumn < map[0].length; targetColumn++) {
        if (fn(map[row][targetColumn])) return
      }
    },
    South: (fn: CallbackFn) => {
      for (let targetRow = row + 1; targetRow < map.length; targetRow++) {
        if (fn(map[targetRow][column])) return
      }
    },
    West: (fn: CallbackFn) => {
      for (let targetColumn = column - 1; targetColumn >= 0; targetColumn--) {
        if (fn(map[row][targetColumn])) return
      }
    },
  }
}

export const zip = <A, B>(xs: A[], ys: B[]) => {
  const maxLength = Math.min(xs.length, ys.length)
  return xs.slice(0, maxLength).map((a, i) => [a, ys[i]])
}

export const subtractLists = (xs: number[], ys: number[]) => zip(xs, ys).map(([x, y]) => x - y)
export const addLists = (xs: number[], ys: number[]) => zip(xs, ys).map(([x, y]) => x + y)

export const range = (start: number, end: number) => Array.from({ length: Math.abs(end - start) }, (_, i) => start < end ? i + start : Math.abs(i - start))

export const lines = (input: string) => input.trim().split('\n')

export const Characters = {
  WhiteRetroBlock: "█",  
  Space: " ",
  Dot: ".",
  HashTag: "#",
  Tilde: "~",
  Star: "*",
  Plus: "+",
  At: "@",
}

export type ValueOf<T> = T[keyof T]

export interface CoordinateRecord {
  y: Row,
  x: Column,
}

export const equalCoordinates = (a: CoordinateRecord, b: CoordinateRecord) => a.x === b.x && a.y === b.y

export const addCoordinate = (base: CoordinateRecord, toAdd: CoordinateRecord) => ({
  y: base.y + toAdd.y,
  x: base.x + toAdd.x,
})

export const coordinateToString = (coord: CoordinateRecord) => `{y:${coord.y},x:${coord.x}}`

// @TODO would be cool if I could pass in record as characters as type parameter to board
/**
 * m x n board
 * - Access by y / row first, then by x / column
 * - Positive coordinates only
 * - y coordinates grow positive as going downwards / south
 * - x coordinates grow positive as going rightwards / east
 */
export class Board {
  content: string[][]

  constructor(boardStr: string) {
    this.content = boardStr.split('\n').map(l => l.split(''))
  }

  /**
   * @param c coordinate of the tile to get
   * @returns contents of the tile
   */
  get(c: CoordinateRecord) {
    return this.content[c.y] && this.content[c.y][c.x]
  }

  /**
   * @param c the coordinate where to update the tile
   * @param tile the tile to put in
   * @returns boolean depending on whether setting the value succeeded or not
   */
  set(c: CoordinateRecord, tile: string) {
    if (!(this.content[c.y] && this.content[c.y][c.x])) {
      return false
    }

    this.content[c.y][c.x] = tile
    return true
  }

  amountRows() {
    return this.content.length
  }

  amountColumns() {
    return this.content[0].length
  }

  forEach(fn: (tile: string, coordinate: CoordinateRecord) => any) {
    return this.content.forEach((row, rowI) => row.forEach((tile, colI) => fn(tile, { y: rowI, x: colI })))
  }

  adjacentCoordinates(coord: CoordinateRecord, limitedTo?: Direction[]) {
    // @Check why is Object.keys unsafe
    // console.log(coord)
    const checkDirections: Direction[] = limitedTo ?? (Object.keys(relativeCoordinates) as unknown as Direction[])
    // console.log(checkDirections)
    
    return checkDirections
      .map(dir => addCoordinate(relativeCoordinates[dir], coord))
      .filter(c => !(c.x < 0 || c.y < 0))
  }

  adjacentTiles(coord: CoordinateRecord, limitedTo?: Direction[]) {
    const coords = this.adjacentCoordinates(coord, limitedTo)
    return coords.map(c => this.get(c))
  }

  adjacentTilesWithCoordinates(coord: CoordinateRecord, limitedTo?: Direction[]) {
    const coords = this.adjacentCoordinates(coord, limitedTo)
    return coords.map(c => ({
      ...c,
      tile: this.get(c)
    }))
  }

  toString() {
    return this.content.map(l => l.join('')).join('\n')
  }
}
