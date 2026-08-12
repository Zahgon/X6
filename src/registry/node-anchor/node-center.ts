import type { NodeAnchorDefinition } from './index'

export interface NodeCenterEndpointOptions {
  dx?: number
  dy?: number
}

/**
 * Places the anchor of the edge at center of the node bbox.
 */
export const nodeCenter: NodeAnchorDefinition<NodeCenterEndpointOptions> =
  function (view, magnet, ref, options, endType) {
      throw new Error("STUB");
  }
