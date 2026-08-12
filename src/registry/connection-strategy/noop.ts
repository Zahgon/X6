import type { ConnectionStrategyDefinition } from './index'

export const noop: ConnectionStrategyDefinition = (terminal) => { throw new Error("STUB"); }
