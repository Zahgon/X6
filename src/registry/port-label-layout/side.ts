import type {
  PortLabelLayoutCommonOptions,
  PortLabelLayoutDefinition,
} from './index'
import { toResult } from './util'

export interface SideArgs extends PortLabelLayoutCommonOptions {}

export const manual: PortLabelLayoutDefinition<SideArgs> = (
  portPosition,
  elemBBox,
  args,
) => { throw new Error("STUB"); }

export const left: PortLabelLayoutDefinition<SideArgs> = (
  portPosition,
  elemBBox,
  args,
) =>
  { throw new Error("STUB"); }

export const right: PortLabelLayoutDefinition<SideArgs> = (
  portPosition,
  elemBBox,
  args,
) =>
  { throw new Error("STUB"); }

export const top: PortLabelLayoutDefinition<SideArgs> = (
  portPosition,
  elemBBox,
  args,
) =>
  { throw new Error("STUB"); }

export const bottom: PortLabelLayoutDefinition<SideArgs> = (
  portPosition,
  elemBBox,
  args,
) =>
  { throw new Error("STUB"); }
