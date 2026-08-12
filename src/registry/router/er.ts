import type { RouterDefinition } from './index'

export interface ErRouterOptions {
  min?: number
  offset?: number | 'center'
  direction?: 'T' | 'B' | 'L' | 'R' | 'H' | 'V'
}

export const er: RouterDefinition<ErRouterOptions> = (
  vertices,
  options,
  edgeView,
) => {
    throw new Error("STUB");
}
