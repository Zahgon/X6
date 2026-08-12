import { FunctionExt } from '../../common'
import { Line, type Point } from '../../geometry'
import {
  getPointAtEdge,
  type ResolveOptions,
  resolve,
} from '../node-anchor/util'
import { getClosestPoint } from './closest'
import type {
  EdgeAnchorDefinition,
  EdgeAnchorResolvedDefinition,
} from './index'

export interface OrthEndpointOptions extends ResolveOptions {
  fallbackAt?: number | string
}

const orthogonal: EdgeAnchorResolvedDefinition<OrthEndpointOptions> = function (
  view,
  magnet,
  refPoint,
  options,
): Point {
    throw new Error("STUB");
}

export const orth = resolve<
  EdgeAnchorResolvedDefinition<OrthEndpointOptions>,
  EdgeAnchorDefinition<OrthEndpointOptions>
>(orthogonal)
