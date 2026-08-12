import { Curve, Path } from '../../geometry'
import type { ConnectorBaseOptions, ConnectorDefinition } from './index'

export interface SmoothConnectorOptions extends ConnectorBaseOptions {
  direction?: 'H' | 'V'
}

export const smooth: ConnectorDefinition<SmoothConnectorOptions> = (
  sourcePoint,
  targetPoint,
  routePoints,
  options = {},
) => {
    throw new Error("STUB");
}
