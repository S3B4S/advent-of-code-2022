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

export const transpose = <T>(matrix: T[][]) => {
  const res = Array.from({ length: matrix[0].length }).map(() => [])
  
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
export enum Direction { North, East, South, West }

/**
 * Applies the provided function to the elements in the specified direction in a two-dimensional array, starting from the provided coordinate.
 * The function is applied to each element in the specified direction until it returns `true` or all elements have been visited.
 *
 * @param coordinate The starting coordinate
 * @param map The two-dimensional array to iterate over
 * @param direction The direction in which to apply the function
 * @param fn The function to apply to each element
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
    Sotuh: (fn: CallbackFn) => {
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
