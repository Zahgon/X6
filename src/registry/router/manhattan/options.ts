import { NumberExt } from '../../../common'
import {
  normalize,
  Point,
  type RectangleLike,
  type PointLike,
} from '../../../geometry'
import type { Edge, Node, TerminalType } from '../../../model'
import type { EdgeView } from '../../../view'
import type { RouterDefinition } from '../index'
import { orth } from '../orth'

export type Direction = 'top' | 'right' | 'bottom' | 'left'
type Callable<T> = T | ((this: ManhattanRouterOptions) => T)

export interface ResolvedOptions {
  /**
   * The size of step to find a route (the grid of the manhattan pathfinder).
   */
  step: number

  /**
   * The number of route finding loops that cause the router to abort returns
   * fallback route instead.
   */
  maxLoopCount: number

  /**
   * The number of decimal places to round floating point coordinates.
   */
  precision: number

  /**
   * The maximum change of direction.
   */
  maxDirectionChange: number

  /**
   * Should the router use perpendicular edgeView option? Does not connect
   * to the anchor of node but rather a point close-by that is orthogonal.
   */
  perpendicular: boolean

  /**
   * Should the source and/or target not be considered as obstacles?
   */
  excludeTerminals: TerminalType[]

  /**
   * Should certain nodes not be considered as obstacles?
   */
  excludeNodes: (Node | string)[]

  /**
   * Should certain types of nodes not be considered as obstacles?
   */
  excludeShapes: string[]

  /**
   * Possible starting directions from a node.
   */
  startDirections: Direction[]

  /**
   * Possible ending directions to a node.
   */
  endDirections: Direction[]

  /**
   * Specify the directions used above and what they mean
   */
  directionMap: {
    top: PointLike
    right: PointLike
    bottom: PointLike
    left: PointLike
  }

  /**
   * Returns the cost of an orthogonal step.
   */
  cost: number

  /**
   * Returns an array of directions to find next points on the route different
   * from start/end directions.
   */
  directions: {
    cost: number
    offsetX: number
    offsetY: number
    angle?: number
    gridOffsetX?: number
    gridOffsetY?: number
  }[]

  /**
   * A penalty received for direction change.
   */
  penalties: {
    [key: number]: number
  }

  padding?: {
    top: number
    right: number
    bottom: number
    left: number
  }

  /**
   * The padding applied on the element bounding boxes.
   */
  paddingBox: RectangleLike

  fallbackRouter: RouterDefinition<any>

  draggingRouter?:
    | ((
        this: EdgeView,
        dragFrom: PointLike,
        dragTo: PointLike,
        options: ResolvedOptions,
      ) => Point[])
    | null

  fallbackRoute?: (
    this: EdgeView,
    from: Point,
    to: Point,
    options: ResolvedOptions,
  ) => Point[] | null

  previousDirectionAngle?: number | null

  // Whether the calculation results are aligned with the grid
  snapToGrid?: boolean
}

export type ManhattanRouterOptions = {
  [Key in keyof ResolvedOptions]: Callable<ResolvedOptions[Key]>
}

export const defaults: ManhattanRouterOptions = {
  step: 10,
  maxLoopCount: 2000,
  precision: 1,
  maxDirectionChange: 90,
  perpendicular: true,
  excludeTerminals: [],
  excludeNodes: [],
  excludeShapes: [],
  startDirections: ['top', 'right', 'bottom', 'left'],
  endDirections: ['top', 'right', 'bottom', 'left'],
  directionMap: {
    top: { x: 0, y: -1 },
    right: { x: 1, y: 0 },
    bottom: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
  },

  cost() {
      throw new Error("STUB");
  },

  directions() {
      throw new Error("STUB");
  },

  penalties() {
      throw new Error("STUB");
  },

  paddingBox() {
      throw new Error("STUB");
  },

  fallbackRouter: orth,
  draggingRouter: null,
  snapToGrid: true,
}

export function resolve<T>(
  input: Callable<T>,
  options: ManhattanRouterOptions,
) {
  if (typeof input === 'function') {
    return input.call(options)
  }
  return input
}

export function resolveOptions(options: ManhattanRouterOptions) {
  const result = Object.keys(options).reduce(
    (memo, key: keyof ResolvedOptions) => {
          throw new Error("STUB");
      },
    {} as ResolvedOptions,
  )

  if (result.padding) {
    const sides = NumberExt.normalizeSides(result.padding)
    result.paddingBox = {
      x: -sides.left,
      y: -sides.top,
      width: sides.left + sides.right,
      height: sides.top + sides.bottom,
    }
  }

  result.directions.forEach((direction) => {
      throw new Error("STUB");
  })

  return result
}
