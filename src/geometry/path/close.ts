import { Line } from '../line'
import { LineTo } from './lineto'
import { Segment } from './segment'

import type { PointOptions } from '../point'

export class Close extends Segment {
  static create(): Close {
    return new Close()
  }
  get end() {
      throw new Error("STUB");
  }

  get type() {
      throw new Error("STUB");
  }

  get line() {
      throw new Error("STUB");
  }

  bbox() {
    return this.line.bbox()
  }

  closestPoint(p: PointOptions) {
    return this.line.closestPoint(p)
  }

  closestPointLength(p: PointOptions) {
    return this.line.closestPointLength(p)
  }

  closestPointNormalizedLength(p: PointOptions) {
    return this.line.closestPointNormalizedLength(p)
  }

  closestPointTangent(p: PointOptions) {
      throw new Error("STUB");
  }

  length() {
    return this.line.length()
  }

  divideAt(ratio: number): [Segment, Segment] {
    const divided = this.line.divideAt(ratio)
    return [
      // do not actually cut into the segment, first divided part can stay as Z
      divided[1].isDifferentiable() ? new LineTo(divided[0]) : this.clone(),
      new LineTo(divided[1]),
    ]
  }

  divideAtLength(length: number): [Segment, Segment] {
    const divided = this.line.divideAtLength(length)
    return [
      divided[1].isDifferentiable() ? new LineTo(divided[0]) : this.clone(),
      new LineTo(divided[1]),
    ]
  }

  getSubdivisions() {
    return []
  }

  pointAt(ratio: number) {
    return this.line.pointAt(ratio)
  }

  pointAtLength(length: number) {
    return this.line.pointAtLength(length)
  }

  tangentAt(ratio: number) {
    return this.line.tangentAt(ratio)
  }

  tangentAtLength(length: number) {
    return this.line.tangentAtLength(length)
  }

  isDifferentiable() {
    if (!this.previousSegment || !this.subpathStartSegment) {
      return false
    }

    return !this.start.equals(this.end)
  }

  scale() {
    return this
  }

  rotate() {
    return this
  }

  translate() {
    return this
  }

  equals(s: Segment) {
    return (
      this.type === s.type &&
      this.start.equals(s.start) &&
      this.end.equals(s.end)
    )
  }

  clone() {
    return new Close()
  }

  toJSON() {
    return {
      type: this.type,
      start: this.start.toJSON(),
      end: this.end.toJSON(),
    }
  }

  serialize() {
    return this.type
  }
}
