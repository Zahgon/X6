import { Path, Point } from '../../geometry'
import type { ConnectorBaseOptions, ConnectorDefinition } from './index'

export interface LoopConnectorOptions extends ConnectorBaseOptions {
  split?: boolean | number
}

export const loop: ConnectorDefinition<LoopConnectorOptions> = (
  sourcePoint,
  targetPoint,
  routePoints,
  options = {},
) => {
    throw new Error("STUB");
}
