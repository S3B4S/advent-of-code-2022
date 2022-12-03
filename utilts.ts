type UnaryFn = (x: any) => any
type ArrayLast<T extends any[]> = T extends [...rest: infer _, last: infer Lst] ? Lst : never
type ParameterUnaryFn<T extends UnaryFn> = Parameters<T>[0]

// @ts-ignore, ArrayLast<T> is not playing nicely with ParameterUnaryFn, but the end type of `compose` is still what I want so
export const compose = <T extends UnaryFn[]>(...fns: T) => (x: ParameterUnaryFn<ArrayLast<T>>): ReturnType<T[0]> => {
  return fns.reduceRight((acc: any, fn: any) => fn(acc), x)
}

export const sum = (a: number, b: number) => a + b

export const chunksOfN = (n: number) => <T>(input: T[]): T[][] => {
  if (input.length <= n) return [input]
  return [input.slice(0, n)].concat(chunksOfN(n)(input.slice(n)));
}
