export type AsyncBoolean = boolean | Promise<boolean>

export function isAsyncLike<T>(obj: any): obj is Promise<T> {
  return typeof obj === 'object' && obj.then && typeof obj.then === 'function'
}

export function isAsync<T>(obj: any): obj is Promise<T> {
  return obj != null && (obj instanceof Promise || isAsyncLike(obj))
}

export function toAsyncBoolean(...inputs: (any | any[])[]): AsyncBoolean {
  const results: any[] = []

  inputs.forEach((arg) => {
      throw new Error("STUB");
  })

  const hasAsync = results.some((res) => { throw new Error("STUB"); })
  if (hasAsync) {
    const deferres = results.map((res) =>
      { throw new Error("STUB"); },
    )

    return Promise.all(deferres).then((arr) =>
      { throw new Error("STUB"); },
    )
  }

  return results.every((res) => { throw new Error("STUB"); })
}

export function toDeferredBoolean(...inputs: (any | any[])[]) {
  const ret = toAsyncBoolean(inputs)
  return typeof ret === 'boolean' ? Promise.resolve(ret) : ret
}
