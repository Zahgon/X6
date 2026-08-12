import type { SimpleAttrs } from '../attr'
import type { MarkerFactory } from './index'

export interface EllipseMarkerOptions extends SimpleAttrs {
  rx?: number
  ry?: number
}

export const ellipse: MarkerFactory<EllipseMarkerOptions> = ({
  rx,
  ry,
  ...attrs
}) => {
    throw new Error("STUB");
}
