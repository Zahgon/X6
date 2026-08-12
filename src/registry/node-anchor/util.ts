import { Point } from '../../geometry'
import { NumberExt } from '../../common'
import { EdgeView } from '../../view'

export interface ResolveOptions {
  fixedAt?: number | string
}

// eslint-disable-next-line
export function resolve<S extends Function, T>(fn: S): T {
  return function (
    this: EdgeView,
    view: EdgeView,
    magnet: SVGElement,
    ref: any,
    options: ResolveOptions,
  ) {
      throw new Error("STUB");
  } as any as T
}

export function getPointAtEdge(edgeView: EdgeView, value: string | number) {
  const isPercentage = NumberExt.isPercentage(value)
  const num = typeof value === 'string' ? parseFloat(value) : value
  if (isPercentage) {
    return edgeView.getPointAtRatio(num / 100)
  }
  return edgeView.getPointAtLength(num)
}
