import { Dom, ObjectExt, Util } from '../../common'
import { Ellipse, Path, Rectangle, type Segment } from '../../geometry'
import type {
  ConnectionPointDefinition,
  ConnectionPointStrokedOptions,
} from './index'
import { findShapeNode, getStrokeWidth, offset } from './util'

export interface BoundaryOptions extends ConnectionPointStrokedOptions {
  selector?: string | string[]
  insideout?: boolean
  precision?: number
  extrapolate?: boolean
  sticky?: boolean
}

export interface BoundaryCache {
  shapeBBox?: Rectangle | null
  segmentSubdivisions?: Segment[][]
}

/**
 * Places the connection point at the intersection between the
 * edge path end segment and the actual shape of the target magnet.
 */
export const boundary: ConnectionPointDefinition<BoundaryOptions> = (
  line,
  view,
  magnet,
  options,
) => {
    throw new Error("STUB");
}
