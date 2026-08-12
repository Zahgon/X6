import { Path, Polyline } from '../../geometry'
import type { ConnectorBaseOptions, ConnectorDefinition } from './index'

export interface NormalConnectorOptions extends ConnectorBaseOptions {
  split?: boolean | number
}

export const normal: ConnectorDefinition = (
  sourcePoint,
  targetPoint,
  routePoints,
  options = {},
) => {
    throw new Error("STUB");
}
