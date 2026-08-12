import { toRad, Line, Point, type PointLike } from '../../geometry'
import type { RouterDefinition } from './index'

export interface LoopRouterOptions {
  width?: number
  height?: number
  angle?: 'auto' | number
  merge?: boolean | number
}

function rollup(points: PointLike[], merge?: boolean | number) {
  if (merge != null && merge !== false) {
    const amount = typeof merge === 'boolean' ? 0 : merge
    if (amount > 0) {
      const center1 = Point.create(points[1]).move(points[2], amount)
      const center2 = Point.create(points[1]).move(points[0], amount)
      return [center1.toJSON(), ...points, center2.toJSON()]
    }
    {
      const center = points[1]
      return [{ ...center }, ...points, { ...center }]
    }
  }
  return points
}

export const loop: RouterDefinition<LoopRouterOptions> = (
  vertices,
  options,
  edgeView,
) => {
    throw new Error("STUB");
}
