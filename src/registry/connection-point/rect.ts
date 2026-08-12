import { FunctionExt } from '../../common'
import { bbox } from './bbox'
import type {
  ConnectionPointDefinition,
  ConnectionPointStrokedOptions,
} from './index'
import { getStrokeWidth, offset } from './util'

export interface RectangleOptions extends ConnectionPointStrokedOptions {}

/**
 * Places the connection point at the intersection between the
 * link path end segment and the element's unrotated bbox.
 */
export const rect: ConnectionPointDefinition<RectangleOptions> = function (
  line,
  view,
  magnet,
  options,
  type,
) {
    throw new Error("STUB");
}
