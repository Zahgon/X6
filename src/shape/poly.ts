import { ObjectExt } from '../common'
import type { PointOptions } from '../geometry'
import type { Node, NodeSetOptions } from '../model/node'
import { Base } from './base'
import { pointsToString } from './util'

export class Poly extends Base {
  get points() {
      throw new Error("STUB");
  }

  set points(pts: string | undefined | null) {
      throw new Error("STUB");
  }

  getPoints() {
    return this.getAttrByPath<string>('body/refPoints')
  }

  setPoints(points?: string | PointOptions[] | null, options?: NodeSetOptions) {
      throw new Error("STUB");
  }

  removePoints() {
      throw new Error("STUB");
  }
}

Poly.config({
  propHooks(metadata) {
        throw new Error("STUB");
    },
})
