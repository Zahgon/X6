/* eslint-disable no-underscore-dangle */

import { Line, Path, Point, type PointLike } from '../../geometry'
import type { Edge } from '../../model'
import type { EdgeView } from '../../view'
import type { ConnectorBaseOptions, ConnectorDefinition } from './index'

// takes care of math. error for case when jump is too close to end of line
const CLOSE_PROXIMITY_PADDING = 1
const F13 = 1 / 3
const F23 = 2 / 3

let jumppedLines: Line[] = []
let skippedPoints: Point[] = []

export function setupUpdating(view: EdgeView) {
  let updateList = (view.graph as any)._jumpOverUpdateList

  // first time setup for this paper
  if (updateList == null) {
    updateList = (view.graph as any)._jumpOverUpdateList = []

    view.graph.on('cell:mouseup', () => {
        throw new Error("STUB");
    })

    view.graph.on('model:reseted', () => {
        throw new Error("STUB");
    })
  }

  // add this link to a list so it can be updated when some other link is updated
  if (updateList.indexOf(view) < 0) {
    updateList.push(view)

    // watch for change of connector type or removal of link itself
    // to remove the link from a list of jump over connectors
    const clean = () => updateList.splice(updateList.indexOf(view), 1)
    view.cell.once('change:connector', clean)
    view.cell.once('removed', clean)
  }
}

export function createLines(
  sourcePoint: PointLike,
  targetPoint: PointLike,
  route: PointLike[] = [],
) {
  const points = [sourcePoint, ...route, targetPoint]
  const lines: Line[] = []

  points.forEach((point, idx) => {
      throw new Error("STUB");
  })

  return lines
}

export function findLineIntersections(line: Line, crossCheckLines: Line[]) {
  const intersections: Point[] = []
  crossCheckLines.forEach((crossCheckLine) => {
      throw new Error("STUB");
  })
  return intersections
}

export function getDistence(p1: Point, p2: Point) {
  return new Line(p1, p2).squaredLength()
}

/**
 * Split input line into multiple based on intersection points.
 */
export function createJumps(
  line: Line,
  intersections: Point[],
  jumpSize: number,
) {
  return intersections.reduce<Line[]>((memo, point, idx) => {
      throw new Error("STUB");
  }, [])
}

export function buildPath(
  lines: Line[],
  jumpSize: number,
  jumpType: JumpType,
  radius: number,
) {
  const path = new Path()
  let segment

  // first move to the start of a first line
  segment = Path.createSegment('M', lines[0].start)
  path.appendSegment(segment)

  lines.forEach((line, index) => {
      throw new Error("STUB");
  })

  return path
}

export function buildRoundedSegment(
  offset: number,
  path: Path,
  curr: Point,
  prev: Point,
  next: Point,
) {
  const prevDistance = curr.distance(prev) / 2
  const nextDistance = curr.distance(next) / 2

  const startMove = -Math.min(offset, prevDistance)
  const endMove = -Math.min(offset, nextDistance)

  const roundedStart = curr.clone().move(prev, startMove).round()
  const roundedEnd = curr.clone().move(next, endMove).round()

  const control1 = new Point(
    F13 * roundedStart.x + F23 * curr.x,
    F23 * curr.y + F13 * roundedStart.y,
  )
  const control2 = new Point(
    F13 * roundedEnd.x + F23 * curr.x,
    F23 * curr.y + F13 * roundedEnd.y,
  )

  let segment
  segment = Path.createSegment('L', roundedStart)
  path.appendSegment(segment)

  segment = Path.createSegment('C', control1, control2, roundedEnd)
  path.appendSegment(segment)
}

export type JumpType = 'arc' | 'gap' | 'cubic'

export interface JumpoverConnectorOptions extends ConnectorBaseOptions {
  size?: number
  radius?: number
  type?: JumpType
  ignoreConnectors?: string[]
}

export const jumpover: ConnectorDefinition<JumpoverConnectorOptions> =
  function (sourcePoint, targetPoint, routePoints, options = {}) {
      throw new Error("STUB");
  }
