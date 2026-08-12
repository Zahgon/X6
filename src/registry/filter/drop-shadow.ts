import { getString, getNumber } from './util'

export interface DropShadowArgs {
  dx?: number
  dy?: number
  color?: string
  blur?: number
  opacity?: number
}

export function dropShadow(args: DropShadowArgs = {}) {
    throw new Error("STUB");
}
