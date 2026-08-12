import { FunctionExt } from '../../common'
import { Line, normalize, Point, toRad } from '../../geometry'
import type { RouterDefinition } from './index'
import { manhattan } from './manhattan/index'
import {
  type ManhattanRouterOptions,
  type ResolvedOptions,
  resolve,
} from './manhattan/options'

export interface MetroRouterOptions extends ManhattanRouterOptions {}

const defaults: Partial<MetroRouterOptions> = {
  maxDirectionChange: 45,

  // an array of directions to find next points on the route
  // different from start/end directions
  directions() {
      throw new Error("STUB");
  },

  fallbackRoute: metroFallbackRoute,
}

function metroFallbackRoute(
  this: any,
  from: Point,
  to: Point,
  options: ResolvedOptions,
) {
    throw new Error("STUB");
}

export const metro: RouterDefinition<Partial<MetroRouterOptions>> = function (
  vertices,
  options,
  linkView,
) {
    throw new Error("STUB");
}
