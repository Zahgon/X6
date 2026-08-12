import type { KeyValue } from '../../common'
import { Path } from '../../geometry'
import type { MarkerFactory, MarkerResult } from './index'
import { normalize } from './util'

export interface AsyncMarkerOptions extends KeyValue {
  width?: number
  height?: number
  offset?: number
  open?: boolean
  flip?: boolean
}

export const async: MarkerFactory<AsyncMarkerOptions> = ({
  width,
  height,
  offset,
  open,
  flip,
  ...attrs
}) => {
    throw new Error("STUB");
}
