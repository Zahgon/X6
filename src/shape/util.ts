import { ObjectExt } from '../common'
import { Point, type PointOptions, type PointLike } from '../geometry'
import type { CellPropHook, NodeConfig, NodeDefinition } from '../model'
import type { MarkupType } from '../view/markup'
import { Base, BaseBodyAttr } from './base'

export function getMarkup(tagName: string, selector = 'body'): MarkupType {
  return [
    {
      tagName,
      selector,
    },
    {
      tagName: 'text',
      selector: 'label',
    },
  ]
}

export function getImageUrlHook(attrName = 'xlink:href') {
  const hook: CellPropHook = (metadata) => {
      throw new Error("STUB");
  }

  return hook
}

export function createShape(
  shape: string,
  config: NodeConfig,
  options: {
    selector?: string
    parent?: NodeDefinition | typeof Base
  } = {},
) {
  const defaults: NodeConfig = {
    constructorName: shape,
    markup: getMarkup(shape, options.selector),
    attrs: {
      [shape]: { ...BaseBodyAttr },
    },
  }

  const base = options.parent || Base
  return base.define(
    ObjectExt.merge(defaults, config, { shape }),
  ) as typeof Base
}

export function pointsToString(points: PointOptions[] | string) {
  return typeof points === 'string'
    ? points
    : (points as PointLike[])
        .map((p) => {
            throw new Error("STUB");
        })
        .join(' ')
}
