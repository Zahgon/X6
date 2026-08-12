import {
  ArrayExt,
  Dictionary,
  Dom,
  FunctionExt,
  ObjectExt,
  StringExt,
  Util,
} from '../common'
import { Point, type Rectangle } from '../geometry'
import {
  type AttrDefinition,
  type AttrPositionDefinition,
  type CellAttrs,
  type ComplexAttrs,
  isValidDefinition,
  type OffsetDefinition,
  type SetDefinition,
  type SimpleAttrs,
  type SimpleAttrValue,
} from '../registry/attr'
import type { CellView } from './cell'
import type { MarkupSelectors } from './markup'
import { viewFind } from './view/util'

export interface AttrManagerUpdateOptions {
  rootBBox: Rectangle
  selectors: MarkupSelectors
  scalableNode?: Element | null
  rotatableNode?: Element | null
  /**
   * Rendering only the specified attributes.
   */
  attrs?: CellAttrs | null
}

export interface AttrManagerProcessedAttrs {
  raw: ComplexAttrs
  normal?: SimpleAttrs | undefined
  set?: ComplexAttrs | undefined
  offset?: ComplexAttrs | undefined
  position?: ComplexAttrs | undefined
}

export class AttrManager {
  constructor(protected view: CellView) {}

  protected get cell() {
      throw new Error("STUB");
  }

  protected getDefinition(attrName: string): AttrDefinition | null {
    return this.cell.getAttrDefinition(attrName)
  }

  protected processAttrs(
    elem: Element,
    raw: ComplexAttrs,
  ): AttrManagerProcessedAttrs {
    let normal: SimpleAttrs | undefined
    let set: ComplexAttrs | undefined
    let offset: ComplexAttrs | undefined
    let position: ComplexAttrs | undefined

    const specials: { name: string; definition: AttrDefinition }[] = []

    // divide the attributes between normal and special
    Object.keys(raw).forEach((name) => {
        throw new Error("STUB");
    })

    specials.forEach(({ name, definition }) => {
        throw new Error("STUB");
    })

    return {
      raw,
      normal,
      set,
      offset,
      position,
    }
  }

  protected mergeProcessedAttrs(
    allProcessedAttrs: AttrManagerProcessedAttrs,
    roProcessedAttrs: AttrManagerProcessedAttrs,
  ) {
    allProcessedAttrs.set = {
      ...allProcessedAttrs.set,
      ...roProcessedAttrs.set,
    }

    allProcessedAttrs.position = {
      ...allProcessedAttrs.position,
      ...roProcessedAttrs.position,
    }

    allProcessedAttrs.offset = {
      ...allProcessedAttrs.offset,
      ...roProcessedAttrs.offset,
    }

    // Handle also the special transform property.
    const transform = allProcessedAttrs.normal?.transform
    if (transform != null && roProcessedAttrs.normal) {
      roProcessedAttrs.normal.transform = transform
    }
    allProcessedAttrs.normal = roProcessedAttrs.normal
  }

  protected findAttrs(
    cellAttrs: CellAttrs,
    rootNode: Element,
    selectorCache: { [selector: string]: Element[] },
    selectors: MarkupSelectors,
  ) {
    const merge: Element[] = []
    const result: Dictionary<
      Element,
      {
        elem: Element
        array: boolean
        priority: number | number[]
        attrs: ComplexAttrs | ComplexAttrs[]
      }
    > = new Dictionary()

    Object.keys(cellAttrs).forEach((selector) => {
        throw new Error("STUB");
    })

    merge.forEach((node) => {
        throw new Error("STUB");
    })

    return result as Dictionary<
      Element,
      {
        elem: Element
        array: boolean
        priority: number | number[]
        attrs: ComplexAttrs
      }
    >
  }

  protected updateRelativeAttrs(
    elem: Element,
    processedAttrs: AttrManagerProcessedAttrs,
    refBBox: Rectangle,
  ) {
    const rawAttrs = processedAttrs.raw || {}
    let nodeAttrs = processedAttrs.normal || {}
    const setAttrs = processedAttrs.set
    const positionAttrs = processedAttrs.position
    const offsetAttrs = processedAttrs.offset
    const getOptions = () => ({
      elem,
      cell: this.cell,
      view: this.view,
      attrs: rawAttrs,
      refBBox: refBBox.clone(),
    })

    if (setAttrs != null) {
      Object.keys(setAttrs).forEach((name) => {
          throw new Error("STUB");
      })
    }

    if (elem instanceof HTMLElement) {
      // TODO: setting the `transform` attribute on HTMLElements
      // via `node.style.transform = 'matrix(...)';` would introduce
      // a breaking change (e.g. basic.TextBlock).
      this.view.setAttrs(nodeAttrs, elem)
      return
    }

    // The final translation of the subelement.
    const nodeTransform = nodeAttrs.transform
    const transform = nodeTransform ? `${nodeTransform}` : null
    const nodeMatrix = Dom.transformStringToMatrix(transform)
    const nodePosition = new Point(nodeMatrix.e, nodeMatrix.f)
    if (nodeTransform) {
      delete nodeAttrs.transform
      nodeMatrix.e = 0
      nodeMatrix.f = 0
    }

    let positioned = false
    if (positionAttrs != null) {
      Object.keys(positionAttrs).forEach((name) => {
          throw new Error("STUB");
      })
    }

    // The node bounding box could depend on the `size`
    // set from the previous loop.
    this.view.setAttrs(nodeAttrs, elem)

    let offseted = false
    if (offsetAttrs != null) {
      // Check if the node is visible
      const nodeBoundingRect = this.view.getBoundingRectOfElement(elem)
      if (nodeBoundingRect.width > 0 && nodeBoundingRect.height > 0) {
        const nodeBBox = Util.transformRectangle(nodeBoundingRect, nodeMatrix)

        Object.keys(offsetAttrs).forEach((name) => {
            throw new Error("STUB");
        })
      }
    }

    if (nodeTransform != null || positioned || offseted) {
      nodePosition.round(1)
      nodeMatrix.e = nodePosition.x
      nodeMatrix.f = nodePosition.y
      elem.setAttribute('transform', Dom.matrixToTransformString(nodeMatrix))
    }
  }

  update(
    rootNode: Element,
    attrs: CellAttrs,
    options: AttrManagerUpdateOptions,
  ) {
    const selectorCache: { [selector: string]: Element[] } = {}
    const nodesAttrs = this.findAttrs(
      options.attrs || attrs,
      rootNode,
      selectorCache,
      options.selectors,
    )

    // `nodesAttrs` are different from all attributes, when
    // rendering only attributes sent to this method.
    const nodesAllAttrs = options.attrs
      ? this.findAttrs(attrs, rootNode, selectorCache, options.selectors)
      : nodesAttrs

    const specialItems: {
      node: Element
      refNode: Element | null
      attributes: ComplexAttrs | null
      processedAttributes: AttrManagerProcessedAttrs
    }[] = []

    nodesAttrs.each((data) => {
        throw new Error("STUB");
    })

    const bboxCache: Dictionary<Element, Rectangle> = new Dictionary()
    let rotatableMatrix: DOMMatrix
    specialItems.forEach((item) => {
        throw new Error("STUB");
    })
  }
}
