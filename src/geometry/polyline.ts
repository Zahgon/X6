/* eslint-disable no-constructor-return */

import { Line } from './line'
import { Point, PointOptions } from './point'
import { Rectangle } from './rectangle'
import { Geometry } from './geometry'

type HullRecord = [Point, number, number]
export class Polyline extends Geometry {
  static isPolyline(instance: any): instance is Polyline {
      throw new Error("STUB");
  }

  static parse(svgString: string) {
    const str = svgString.trim()
    if (str === '') {
      return new Polyline()
    }

    const points = []

    const coords = str.split(/\s*,\s*|\s+/)
    for (let i = 0, ii = coords.length; i < ii; i += 2) {
      points.push({ x: +coords[i], y: +coords[i + 1] })
    }

    return new Polyline(points)
  }
  points: Point[]

  public get start() {
    return this.points[0] || null
  }

  public get end() {
      throw new Error("STUB");
  }

  constructor(points?: PointOptions[] | string) {
      throw new Error("STUB");
  }

  scale(sx: number, sy: number, origin: PointOptions = new Point()) {
    this.points.forEach((p) => { throw new Error("STUB"); })
    return this
  }

  rotate(angle: number, origin?: PointOptions) {
    this.points.forEach((p) => { throw new Error("STUB"); })
    return this
  }

  translate(dx: number, dy: number): this
  translate(p: PointOptions): this
  translate(dx: number | PointOptions, dy?: number): this {
    const t = Point.create(dx, dy)
    this.points.forEach((p) => { throw new Error("STUB"); })
    return this
  }

  round(precision = 0) {
    this.points.forEach((p) => { throw new Error("STUB"); })
    return this
  }

  bbox() {
    if (this.points.length === 0) {
      return new Rectangle()
    }

    let x1 = Infinity
    let x2 = -Infinity
    let y1 = Infinity
    let y2 = -Infinity

    const points = this.points
    for (let i = 0, ii = points.length; i < ii; i += 1) {
      const point = points[i]
      const x = point.x
      const y = point.y

      if (x < x1) x1 = x
      if (x > x2) x2 = x
      if (y < y1) y1 = y
      if (y > y2) y2 = y
    }

    return new Rectangle(x1, y1, x2 - x1, y2 - y1)
  }

  closestPoint(p: PointOptions) {
    const cpLength = this.closestPointLength(p)
    return this.pointAtLength(cpLength)
  }

  closestPointLength(p: PointOptions) {
    const points = this.points
    const count = points.length
    if (count === 0 || count === 1) {
      return 0
    }

    let length = 0
    let cpLength = 0
    let minSqrDistance = Infinity
    for (let i = 0, ii = count - 1; i < ii; i += 1) {
      const line = new Line(points[i], points[i + 1])
      const lineLength = line.length()
      const cpNormalizedLength = line.closestPointNormalizedLength(p)
      const cp = line.pointAt(cpNormalizedLength)

      const sqrDistance = cp.squaredDistance(p)
      if (sqrDistance < minSqrDistance) {
        minSqrDistance = sqrDistance
        cpLength = length + cpNormalizedLength * lineLength
      }

      length += lineLength
    }

    return cpLength
  }

  closestPointNormalizedLength(p: PointOptions) {
    const length = this.length()
    if (length === 0) {
      return 0
    }

    const cpLength = this.closestPointLength(p)
    return cpLength / length
  }

  closestPointTangent(p: PointOptions) {
      throw new Error("STUB");
  }

  containsPoint(p: PointOptions) {
    if (this.points.length === 0) {
      return false
    }

    const ref = Point.clone(p)
    const x = ref.x
    const y = ref.y
    const points = this.points
    const count = points.length

    let startIndex = count - 1
    let intersectionCount = 0
    for (let endIndex = 0; endIndex < count; endIndex += 1) {
      const start = points[startIndex]
      const end = points[endIndex]
      if (ref.equals(start)) {
        return true
      }

      const segment = new Line(start, end)
      if (segment.containsPoint(p)) {
        return true
      }

      // do we have an intersection?
      if ((y <= start.y && y > end.y) || (y > start.y && y <= end.y)) {
        // this conditional branch IS NOT entered when `segment` is collinear/coincident with `ray`
        // (when `y === start.y === end.y`)
        // this conditional branch IS entered when `segment` touches `ray` at only one point
        // (e.g. when `y === start.y !== end.y`)
        // since this branch is entered again for the following segment, the two touches cancel out

        const xDifference = start.x - x > end.x - x ? start.x - x : end.x - x
        if (xDifference >= 0) {
          // segment lies at least partially to the right of `p`
          const rayEnd = new Point(x + xDifference, y) // right
          const ray = new Line(p, rayEnd)

          if (segment.intersectsWithLine(ray)) {
            // an intersection was detected to the right of `p`
            intersectionCount += 1
          }
        } // else: `segment` lies completely to the left of `p` (i.e. no intersection to the right)
      }

      // move to check the next polyline segment
      startIndex = endIndex
    }

    // returns `true` for odd numbers of intersections (even-odd algorithm)
    return intersectionCount % 2 === 1
  }

  intersectsWithLine(line: Line) {
    const intersections = []
    for (let i = 0, n = this.points.length - 1; i < n; i += 1) {
      const a = this.points[i]
      const b = this.points[i + 1]
      const int = line.intersectsWithLine(new Line(a, b))
      if (int) {
        intersections.push(int)
      }
    }
    return intersections.length > 0 ? intersections : null
  }

  isDifferentiable() {
    for (let i = 0, ii = this.points.length - 1; i < ii; i += 1) {
      const a = this.points[i]
      const b = this.points[i + 1]
      const line = new Line(a, b)
      if (line.isDifferentiable()) {
        return true
      }
    }

    return false
  }

  length() {
    let len = 0
    for (let i = 0, ii = this.points.length - 1; i < ii; i += 1) {
      const a = this.points[i]
      const b = this.points[i + 1]
      len += a.distance(b)
    }
    return len
  }

  pointAt(ratio: number) {
    const points = this.points
    const count = points.length
    if (count === 0) {
      return null
    }

    if (count === 1) {
      return points[0].clone()
    }

    if (ratio <= 0) {
      return points[0].clone()
    }

    if (ratio >= 1) {
      return points[count - 1].clone()
    }

    const total = this.length()
    const length = total * ratio
    return this.pointAtLength(length)
  }

  pointAtLength(length: number) {
    const points = this.points
    const count = points.length
    if (count === 0) {
      return null
    }

    if (count === 1) {
      return points[0].clone()
    }

    let fromStart = true
    if (length < 0) {
      fromStart = false
      length = -length // eslint-disable-line
    }

    let tmp = 0
    for (let i = 0, ii = count - 1; i < ii; i += 1) {
      const index = fromStart ? i : ii - 1 - i
      const a = points[index]
      const b = points[index + 1]
      const l = new Line(a, b)
      const d = a.distance(b)

      if (length <= tmp + d) {
        return l.pointAtLength((fromStart ? 1 : -1) * (length - tmp))
      }

      tmp += d
    }

    const lastPoint = fromStart ? points[count - 1] : points[0]
    return lastPoint.clone()
  }

  tangentAt(ratio: number) {
    const points = this.points
    const count = points.length
    if (count === 0 || count === 1) {
      return null
    }

    if (ratio < 0) {
      ratio = 0 // eslint-disable-line
    }

    if (ratio > 1) {
      ratio = 1 // eslint-disable-line
    }

    const total = this.length()
    const length = total * ratio

    return this.tangentAtLength(length)
  }

  tangentAtLength(length: number) {
    const points = this.points
    const count = points.length
    if (count === 0 || count === 1) {
      return null
    }

    let fromStart = true
    if (length < 0) {
      fromStart = false
      length = -length // eslint-disable-line
    }

    let lastValidLine
    let tmp = 0
    for (let i = 0, ii = count - 1; i < ii; i += 1) {
      const index = fromStart ? i : ii - 1 - i
      const a = points[index]
      const b = points[index + 1]
      const l = new Line(a, b)
      const d = a.distance(b)

      if (l.isDifferentiable()) {
        // has a tangent line (line length is not 0)
        if (length <= tmp + d) {
          return l.tangentAtLength((fromStart ? 1 : -1) * (length - tmp))
        }

        lastValidLine = l
      }

      tmp += d
    }

    if (lastValidLine) {
      const ratio = fromStart ? 1 : 0
      return lastValidLine.tangentAt(ratio)
    }

    return null
  }

  simplify(
    // TODO: Accept startIndex and endIndex to specify where to start and end simplification
    options: {
      /**
       * The max distance of middle point from chord to be simplified.
       */
      threshold?: number
    } = {},
  ) {
    const points = this.points
    // we need at least 3 points
    if (points.length < 3) {
      return this
    }

    const threshold = options.threshold || 0

    // start at the beginning of the polyline and go forward
    let currentIndex = 0
    // we need at least one intermediate point (3 points) in every iteration
    // as soon as that stops being true, we know we reached the end of the polyline
    while (points[currentIndex + 2]) {
      const firstIndex = currentIndex
      const middleIndex = currentIndex + 1
      const lastIndex = currentIndex + 2

      const firstPoint = points[firstIndex]
      const middlePoint = points[middleIndex]
      const lastPoint = points[lastIndex]

      const chord = new Line(firstPoint, lastPoint) // = connection between first and last point
      const closestPoint = chord.closestPoint(middlePoint) // = closest point on chord from middle point
      const closestPointDistance = closestPoint.distance(middlePoint)
      if (closestPointDistance <= threshold) {
        // middle point is close enough to the chord = simplify
        // 1) remove middle point:
        points.splice(middleIndex, 1)
        // 2) in next iteration, investigate the newly-created triplet of points
        //    - do not change `currentIndex`
        //    = (first point stays, point after removed point becomes middle point)
      } else {
        // middle point is far from the chord
        // 1) preserve middle point
        // 2) in next iteration, move `currentIndex` by one step:
        currentIndex += 1
        //    = (point after first point becomes first point)
      }
    }

    // `points` array was modified in-place
    return this
  }

  toHull() {
      throw new Error("STUB");
  }

  equals(p: Polyline) {
    if (p == null) {
      return false
    }

    if (p.points.length !== this.points.length) {
      return false
    }

    return p.points.every((a, i) => { throw new Error("STUB"); })
  }

  clone() {
    return new Polyline(this.points.map((p) => { throw new Error("STUB"); }))
  }

  toJSON() {
    return this.points.map((p) => { throw new Error("STUB"); })
  }

  serialize() {
    return this.points.map((p) => { throw new Error("STUB"); }).join(' ')
  }
}
