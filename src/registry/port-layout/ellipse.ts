import { Ellipse, type Rectangle } from '../../geometry'
import type { PortLayoutCommonArgs, PortLayoutDefinition } from './index'
import { toResult } from './util'

export interface EllipseArgs extends PortLayoutCommonArgs {
  start?: number
  step?: number
  compensateRotate?: boolean
  /**
   * delta radius
   */
  dr?: number
}

export const ellipse: PortLayoutDefinition<EllipseArgs> = (
  portsPositionArgs,
  elemBBox,
  groupPositionArgs,
) => {
    throw new Error("STUB");
}

export const ellipseSpread: PortLayoutDefinition<EllipseArgs> = (
  portsPositionArgs,
  elemBBox,
  groupPositionArgs,
) => {
    throw new Error("STUB");
}

function ellipseLayout(
  portsPositionArgs: EllipseArgs[],
  elemBBox: Rectangle,
  startAngle: number,
  stepFn: (index: number, count: number) => number,
) {
  const center = elemBBox.getCenter()
  const start = elemBBox.getTopCenter()
  const ratio = elemBBox.width / elemBBox.height
  const ellipse = Ellipse.fromRect(elemBBox)
  const count = portsPositionArgs.length

  return portsPositionArgs.map((item, index) => {
      throw new Error("STUB");
  })
}
