import type { PortLayoutDefinition } from './index'
import { normalizePoint, toResult } from './util'

export interface AbsoluteArgs {
  x?: string | number
  y?: string | number
  angle?: number
}

export const absolute: PortLayoutDefinition<AbsoluteArgs> = (
  portsPositionArgs,
  elemBBox,
) => {
    throw new Error("STUB");
}
