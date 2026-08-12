import { toRad } from '../../geometry'
import type { BackgroundCommonOptions, BackgroundDefinition } from './index'

export interface WatermarkOptions extends BackgroundCommonOptions {
  angle?: number
}

export const watermark: BackgroundDefinition<WatermarkOptions> = (
  img,
  options,
) => {
    throw new Error("STUB");
}
