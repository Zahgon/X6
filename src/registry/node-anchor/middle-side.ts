import type { Point } from '../../geometry'
import type {
  NodeAnchorDefinition,
  NodeAnchorResolvedDefinition,
} from './index'
import { type ResolveOptions, resolve } from './util'

export interface MiddleSideEndpointOptions extends ResolveOptions {
  rotate?: boolean
  padding?: number
  direction?: 'H' | 'V'
}

const middleSide: NodeAnchorResolvedDefinition<MiddleSideEndpointOptions> = (
  view,
  magnet,
  refPoint,
  options,
) => {
    throw new Error("STUB");
}

/**
 * Places the anchor of the edge in the middle of the side of view bbox
 * closest to the other endpoint.
 */
export const midSide = resolve<
  NodeAnchorResolvedDefinition<ResolveOptions>,
  NodeAnchorDefinition<ResolveOptions>
>(middleSide)
