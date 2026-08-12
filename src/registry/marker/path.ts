import type { SimpleAttrs } from '../attr'
import type { MarkerFactory } from './index'
import { normalize } from './util'

export interface PathMarkerOptions extends SimpleAttrs {
  d: string
  offsetX?: number
  offsetY?: number
}

export const path: MarkerFactory<PathMarkerOptions> = ({
  d,
  offsetX,
  offsetY,
  ...attrs
}) => {
    throw new Error("STUB");
}
