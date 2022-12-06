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

export const chunksOfN = (n: number) => <T>(input: T[]): T[][] => {
  if (input.length <= n) return [input]
  return [input.slice(0, n)].concat(chunksOfN(n)(input.slice(n)));
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

/**
 * Exmaple, if n = 4: "cdsaffjdsakl" -> [
 *   "cdsa",
 *   "dsaf",
 *   "saff",
 *   ....
 *   "sakl",
 * ]
 * @param n 
 * @returns all scanned items
 */
export const scanN = (n: number) => (input: string): string[] => {
  if (input.length <= n) return [input]
  return [input.slice(0, n)].concat(scanN(n)(input.slice(1)))
}
