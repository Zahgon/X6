import { Path } from '../../geometry'
import type { SimpleAttrs } from '../attr'
import type { MarkerFactory } from './index'
import { normalize } from './util'

export interface CircleMarkerOptions extends SimpleAttrs {
  r?: number
}

export interface CirclePlusMarkerOptions extends CircleMarkerOptions {}

export const circle: MarkerFactory<CircleMarkerOptions> = ({ r, ...attrs }) => {
  const radius = r || 5
  return {
    cx: radius,
    ...attrs,
    tagName: 'circle',
    r: radius,
  }
}

export const circlePlus: MarkerFactory<CircleMarkerOptions> = ({
  r,
  ...attrs
}) => {
    throw new Error("STUB");
}
