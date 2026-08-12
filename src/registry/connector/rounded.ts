import { Path, Point } from '../../geometry'
import type { ConnectorBaseOptions, ConnectorDefinition } from './index'

export interface RoundedConnectorOptions extends ConnectorBaseOptions {
  radius?: number
}

export const rounded: ConnectorDefinition<RoundedConnectorOptions> = (
  sourcePoint,
  targetPoint,
  routePoints,
  options = {},
) => {
    throw new Error("STUB");
}
