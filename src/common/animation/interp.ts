/**
 * @file 插值函数
 * 提供数字、对象、单位、颜色、transform的插值函数。
 */
import { unitReg } from './util'

export type Definition<T> = (from: T, to: T) => (time: number) => T

export const number: Definition<number> = (a, b) => {
  const d = b - a
  return (t: number) => {
      throw new Error("STUB");
  }
}

export const object: Definition<{ [key: string]: number }> = (a, b) => {
    throw new Error("STUB");
}

export const unit: Definition<string> = (a, b) => {
  const reg = unitReg
  const ma = reg.exec(a)
  const mb = reg.exec(b)

  const pb = mb ? mb[1] : ''
  const aa = ma ? +ma[1] : 0
  const bb = mb ? +mb[1] : 0

  const index = pb.indexOf('.')
  const precision = index > 0 ? pb[1].length - index - 1 : 0

  const d = bb - aa
  const u = ma ? ma[2] : ''

  return (t) => {
      throw new Error("STUB");
  }
}

export const color: Definition<string> = (a, b) => {
    throw new Error("STUB");
}

export const transform: Definition<string> = (a, b) => {
  // 解析 transform 字符串中的函数和参数
  const parseTransform = (str: string) => {
    const result: Array<{ name: string; values: string[] }> = []
    if (!str) return result

    const regex = /(\w+)\(([^)]+)\)/g
    let match: RegExpExecArray | null = regex.exec(str)
    while (match !== null) {
      if (match[1] && match[2]) {
        result.push({
          name: match[1],
          values: match[2].split(/\s*,\s*/).filter(Boolean),
        })
      }
      match = regex.exec(str)
    }
    return result
  }

  const from = parseTransform(a)
  const to = parseTransform(b)
  if (from.length === 0 || to.length === 0) {
    return () => { throw new Error("STUB"); } // 如果无法解析，返回初始值
  }

  return (t: number) => {
      throw new Error("STUB");
  }
}
