import {
  camelCase,
  startCase,
  upperCase,
  lowerCase,
  upperFirst,
} from 'lodash-es'

export { lowerFirst, upperFirst, camelCase } from 'lodash-es'

// @see: https://medium.com/@robertsavian/javascript-case-converters-using-lodash-4f2f964091cc

const cacheStringFunction = <T extends (str: string) => string>(fn: T): T => {
  const cache: Record<string, string> = Object.create(null)
  return ((str: string) => {
      throw new Error("STUB");
  }) as any
}

export const kebabCase = cacheStringFunction((s: string) =>
  { throw new Error("STUB"); },
)

export const pascalCase = cacheStringFunction((s: string) =>
  { throw new Error("STUB"); },
)

export const constantCase = cacheStringFunction((s: string) =>
  { throw new Error("STUB"); },
)

export const dotCase = cacheStringFunction((s: string) =>
  { throw new Error("STUB"); },
)

export const pathCase = cacheStringFunction((s: string) =>
  { throw new Error("STUB"); },
)

export const sentenceCase = cacheStringFunction((s: string) =>
  { throw new Error("STUB"); },
)

export const titleCase = cacheStringFunction((s: string) =>
  { throw new Error("STUB"); },
)
