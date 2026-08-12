/* eslint-disable default-param-last */

import { Point, PointLike } from '../point'

const regexSupportedData = new RegExp(`^[\\s\\dLMCZz,.]*$`) // eslint-disable-line prefer-regex-literals

export function isValid(data: any) {
  if (typeof data !== 'string') {
    return false
  }

  return regexSupportedData.test(data)
}

/**
 * Returns the remainder of division of `n` by `m`. You should use this
 * instead of the built-in operation as the built-in operation does not
 * properly handle negative numbers.
 */
function mod(n: number, m: number) {
  return ((n % m) + m) % m
}

export interface DrawPointsOptions {
  round?: number
  initialMove?: boolean
  close?: boolean
  exclude?: number[]
}

function draw(
  points: PointLike[],
  round?: number,
  initialMove?: boolean,
  close?: boolean,
  exclude?: number[],
) {
  if (!points || points.length === 0) return ''
  const data: (string | number)[] = []
  const end = points[points.length - 1]
  const rounded = round != null && round > 0
  const arcSize = round || 0

  // Adds virtual waypoint in the center between start and end point
  if (close && rounded) {
    points = points.slice() // eslint-disable-line
    const p0 = points[0]
    const wp = new Point(end.x + (p0.x - end.x) / 2, end.y + (p0.y - end.y) / 2)
    points.splice(0, 0, wp)
  }

  let pt = points[0]
  let i = 1

  // Draws the line segments
  if (initialMove) {
    data.push('M', pt.x, pt.y)
  } else {
    data.push('L', pt.x, pt.y)
  }

  while (i < (close ? points.length : points.length - 1)) {
    let tmp = points[mod(i, points.length)]
    let dx = pt.x - tmp.x
    let dy = pt.y - tmp.y

    if (
      rounded &&
      (dx !== 0 || dy !== 0) &&
      (exclude == null || exclude.indexOf(i - 1) < 0)
    ) {
      // Draws a line from the last point to the current
      // point with a spacing of size off the current point
      // into direction of the last point
      let dist = Math.sqrt(dx * dx + dy * dy)
      const nx1 = (dx * Math.min(arcSize, dist / 2)) / dist
      const ny1 = (dy * Math.min(arcSize, dist / 2)) / dist

      const x1 = tmp.x + nx1
      const y1 = tmp.y + ny1
      data.push('L', x1, y1)

      // Draws a curve from the last point to the current
      // point with a spacing of size off the current point
      // into direction of the next point
      let next = points[mod(i + 1, points.length)]

      // Uses next non-overlapping point
      while (
        i < points.length - 2 &&
        Math.round(next.x - tmp.x) === 0 &&
        Math.round(next.y - tmp.y) === 0
      ) {
        next = points[mod(i + 2, points.length)]
        i += 1
      }

      dx = next.x - tmp.x
      dy = next.y - tmp.y

      dist = Math.max(1, Math.sqrt(dx * dx + dy * dy))
      const nx2 = (dx * Math.min(arcSize, dist / 2)) / dist
      const ny2 = (dy * Math.min(arcSize, dist / 2)) / dist

      const x2 = tmp.x + nx2
      const y2 = tmp.y + ny2

      data.push('Q', tmp.x, tmp.y, x2, y2)
      tmp = new Point(x2, y2)
    } else {
      data.push('L', tmp.x, tmp.y)
    }

    pt = tmp
    i += 1
  }

  if (close) {
    data.push('Z')
  } else {
    data.push('L', end.x, end.y)
  }

  return data.map((v) => { throw new Error("STUB"); }).join(' ')
}

export function drawPoints(
  points: PointLike[],
  options: DrawPointsOptions = {},
) {
  const pts: PointLike[] = []
  if (points && points.length) {
    points.forEach((p) => {
        throw new Error("STUB");
    })
  }

  return draw(
    pts,
    options.round,
    options.initialMove == null || options.initialMove,
    options.close,
    options.exclude,
  )
}

/**
 * Converts the given arc to a series of curves.
 */
export function arcToCurves(
  x0: number,
  y0: number,
  r1: number,
  r2: number,
  angle = 0,
  largeArcFlag = 0,
  sweepFlag = 0,
  x: number,
  y: number,
) {
    throw new Error("STUB");
}

export function drawArc(
  startX: number,
  startY: number,
  rx: number,
  ry: number,
  xAxisRotation = 0,
  largeArcFlag: 0 | 1 = 0,
  sweepFlag: 0 | 1 = 0,
  stopX: number,
  stopY: number,
) {
    throw new Error("STUB");
}
