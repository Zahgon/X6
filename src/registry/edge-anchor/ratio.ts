import type { EdgeAnchorDefinition } from './index'

export interface RatioEndpointOptions {
  ratio?: number
}

export const ratio: EdgeAnchorDefinition<RatioEndpointOptions> = (
  view,
  magnet,
  ref,
  options,
) => {
    throw new Error("STUB");
}
