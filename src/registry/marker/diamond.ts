import { Path } from '../../geometry'
import type { SimpleAttrs } from '../attr'
import type { MarkerFactory } from './index'
import { normalize } from './util'

export interface DiamondMarkerOptions extends SimpleAttrs {
  size?: number
  width?: number
  height?: number
  offset?: number
}

export const diamond: MarkerFactory<DiamondMarkerOptions> = ({
  size,
  width,
  height,
  offset,
  ...attrs
}) => {
    throw new Error("STUB");
}
