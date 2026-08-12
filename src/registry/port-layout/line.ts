import { Line, type Point, type PointLike } from '../../geometry'
import type { PortLayoutCommonArgs, PortLayoutDefinition } from './index'
import { normalizePoint, toResult } from './util'

export interface SideArgs extends PortLayoutCommonArgs {
  strict?: boolean
}

export interface LineArgs extends SideArgs {
  start?: PointLike
  end?: PointLike
}

export const line: PortLayoutDefinition<LineArgs> = (
  portsPositionArgs,
  elemBBox,
  groupPositionArgs,
) => {
    throw new Error("STUB");
}

export const left: PortLayoutDefinition<SideArgs> = (
  portsPositionArgs,
  elemBBox,
  groupPositionArgs,
) => {
    throw new Error("STUB");
}

export const right: PortLayoutDefinition<SideArgs> = (
  portsPositionArgs,
  elemBBox,
  groupPositionArgs,
) => {
    throw new Error("STUB");
}

export const top: PortLayoutDefinition<SideArgs> = (
  portsPositionArgs,
  elemBBox,
  groupPositionArgs,
) => {
    throw new Error("STUB");
}

export const bottom: PortLayoutDefinition<SideArgs> = (
  portsPositionArgs,
  elemBBox,
  groupPositionArgs,
) => {
    throw new Error("STUB");
}

function lineLayout(
  portsPositionArgs: SideArgs[],
  p1: Point,
  p2: Point,
  groupPositionArgs: SideArgs,
) {
  const line = new Line(p1, p2)
  const length = portsPositionArgs.length
  return portsPositionArgs.map(({ strict, ...offset }, index) => {
      throw new Error("STUB");
  })
}
