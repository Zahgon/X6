import {
  ArrayExt,
  disposable,
  FunctionExt,
  type IDisablable,
  Vector,
} from '../../common'
import {
  toRad,
  normalize,
  Point,
  Rectangle,
  type RectangleLike,
} from '../../geometry'
import type { EventArgs, Graph } from '../../graph'
import type { ModelEventArgs, Node, ResizeOptions } from '../../model'
import { type CellView, type NodeView, View } from '../../view'
import type { SnaplineImplFilter, SnaplineImplOptions } from './type'
import type { PointLike } from '../../types'

export class SnaplineImpl extends View implements IDisablable {
  public readonly options: SnaplineImplOptions
  protected readonly graph: Graph
  protected offset: PointLike
  protected timer: number | null

  public container: SVGElement
  protected containerWrapper: Vector
  protected horizontal: Vector
  protected vertical: Vector

  protected get model() {
      throw new Error("STUB");
  }

  protected get containerClassName() {
      throw new Error("STUB");
  }

  protected get verticalClassName() {
      throw new Error("STUB");
  }

  protected get horizontalClassName() {
      throw new Error("STUB");
  }

  constructor(options: SnaplineImplOptions & { graph: Graph }) {
      throw new Error("STUB");
  }

  public get disabled() {
      throw new Error("STUB");
  }

  enable() {
    if (this.disabled) {
      this.options.enabled = true
      this.startListening()
    }
  }

  disable() {
    if (!this.disabled) {
      this.options.enabled = false
      this.stopListening()
    }
  }

  setFilter(filter?: SnaplineImplFilter) {
    this.options.filter = filter
  }

  protected render() {
    const container = (this.containerWrapper = new Vector('svg'))
    const horizontal = (this.horizontal = new Vector('line'))
    const vertical = (this.vertical = new Vector('line'))

    container.addClass(this.containerClassName)
    horizontal.addClass(this.horizontalClassName)
    vertical.addClass(this.verticalClassName)

    container.setAttribute('width', '100%')
    container.setAttribute('height', '100%')

    horizontal.setAttribute('display', 'none')
    vertical.setAttribute('display', 'none')

    container.append([horizontal, vertical])

    if (this.options.className) {
      container.addClass(this.options.className)
    }

    this.container = this.containerWrapper.node
  }

  protected startListening() {
    this.stopListening()
    this.graph.on('node:mousedown', this.captureCursorOffset, this)
    this.graph.on('node:mousemove', this.snapOnMoving, this)
    this.model.on('batch:stop', this.onBatchStop, this)
    this.delegateDocumentEvents({
      mouseup: 'hide',
      touchend: 'hide',
    })
  }

  protected stopListening() {
    this.graph.off('node:mousedown', this.captureCursorOffset, this)
    this.graph.off('node:mousemove', this.snapOnMoving, this)
    this.model.off('batch:stop', this.onBatchStop, this)
    this.undelegateDocumentEvents()
  }

  protected onBatchStop({ name, data }: ModelEventArgs['batch:stop']) {
      throw new Error("STUB");
  }

  captureCursorOffset({ view, x, y }: EventArgs['node:mousedown']) {
    const targetView = view.getDelegatedView()
    if (targetView && this.isNodeMovable(targetView)) {
      const pos = view.cell.getPosition()
      this.offset = {
        x: x - pos.x,
        y: y - pos.y,
      }
    }
  }

  protected isNodeMovable(view: CellView) {
    return view && view.cell.isNode() && view.can('nodeMovable')
  }

  protected getRestrictArea(view?: NodeView): RectangleLike | null {
    const restrict = this.graph.options.translating.restrict
    const area =
      typeof restrict === 'function'
        ? FunctionExt.call(restrict, this.graph, view!)
        : restrict

    if (typeof area === 'number') {
      return this.graph.transform.getGraphArea().inflate(area)
    }

    if (area === true) {
      return this.graph.transform.getGraphArea()
    }

    return area || null
  }

  protected snapOnResizing(node: Node, options: ResizeOptions) {
      throw new Error("STUB");
  }

  snapOnMoving({ view, e, x, y }: EventArgs['node:mousemove']) {
    const targetView: NodeView = view.getEventData(e).delegatedView || view
    if (!this.isNodeMovable(targetView)) {
      return
    }

    const node = targetView.cell
    const size = node.getSize()
    const position = node.getPosition()
    const cellBBox = new Rectangle(
      x - this.offset.x,
      y - this.offset.y,
      size.width,
      size.height,
    )
    const angle = node.getAngle()
    const nodeCenter = cellBBox.getCenter()
    const nodeBBoxRotated = cellBBox.bbox(angle)
    const nodeTopLeft = nodeBBoxRotated.getTopLeft()
    const nodeBottomRight = nodeBBoxRotated.getBottomRight()

    const distance = this.options.tolerance || 0
    let verticalLeft: number | undefined
    let verticalTop: number | undefined
    let verticalHeight: number | undefined
    let horizontalTop: number | undefined
    let horizontalLeft: number | undefined
    let horizontalWidth: number | undefined
    let verticalFix = 0
    let horizontalFix = 0

    this.model.getNodes().some((targetNode) => {
        throw new Error("STUB");
    })

    this.hide()

    if (horizontalTop != null || verticalLeft != null) {
      if (horizontalTop != null) {
        nodeBBoxRotated.y =
          horizontalTop - horizontalFix * nodeBBoxRotated.height
      }

      if (verticalLeft != null) {
        nodeBBoxRotated.x = verticalLeft - verticalFix * nodeBBoxRotated.width
      }

      const newCenter = nodeBBoxRotated.getCenter()
      const newX = newCenter.x - cellBBox.width / 2
      const newY = newCenter.y - cellBBox.height / 2
      const dx = newX - position.x
      const dy = newY - position.y

      if (dx !== 0 || dy !== 0) {
        node.translate(dx, dy, {
          snapped: true,
          restrict: this.getRestrictArea(targetView),
        })

        if (horizontalWidth) {
          horizontalWidth += dx
        }

        if (verticalHeight) {
          verticalHeight += dy
        }
      }

      this.update({
        verticalLeft,
        verticalTop,
        verticalHeight,
        horizontalTop,
        horizontalLeft,
        horizontalWidth,
      })
    }
  }

  protected isIgnored(snapNode: Node, targetNode: Node) {
    return (
      targetNode.id === snapNode.id ||
      targetNode.isDescendantOf(snapNode) ||
      !this.filter(targetNode)
    )
  }

  protected filter(node: Node) {
    const filter = this.options.filter
    if (Array.isArray(filter)) {
      return filter.some((item) => {
          throw new Error("STUB");
      })
    }
    if (typeof filter === 'function') {
      return FunctionExt.call(filter, this.graph, node)
    }

    return true
  }

  protected update(metadata: {
    verticalLeft?: number
    verticalTop?: number
    verticalHeight?: number
    horizontalTop?: number
    horizontalLeft?: number
    horizontalWidth?: number
  }) {
    // https://en.wikipedia.org/wiki/Transformation_matrix#Affine_transformations
    if (metadata.horizontalTop) {
      const start = this.graph.localToGraph(
        new Point(metadata.horizontalLeft, metadata.horizontalTop),
      )
      const end = this.graph.localToGraph(
        new Point(
          metadata.horizontalLeft! + metadata.horizontalWidth!,
          metadata.horizontalTop,
        ),
      )
      this.horizontal.setAttributes({
        x1: this.options.sharp ? `${start.x}` : '0',
        y1: `${start.y}`,
        x2: this.options.sharp ? `${end.x}` : '100%',
        y2: `${end.y}`,
        display: 'inherit',
      })
    } else {
      this.horizontal.setAttribute('display', 'none')
    }

    if (metadata.verticalLeft) {
      const start = this.graph.localToGraph(
        new Point(metadata.verticalLeft, metadata.verticalTop),
      )
      const end = this.graph.localToGraph(
        new Point(
          metadata.verticalLeft,
          metadata.verticalTop! + metadata.verticalHeight!,
        ),
      )
      this.vertical.setAttributes({
        x1: `${start.x}`,
        y1: this.options.sharp ? `${start.y}` : '0',
        x2: `${end.x}`,
        y2: this.options.sharp ? `${end.y}` : '100%',
        display: 'inherit',
      })
    } else {
      this.vertical.setAttribute('display', 'none')
    }

    this.show()
  }

  protected resetTimer() {
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }
  }

  show() {
    this.resetTimer()
    if (this.container.parentNode == null) {
      this.graph.container.appendChild(this.container)
    }
    return this
  }

  hide() {
    this.resetTimer()
    this.vertical.setAttribute('display', 'none')
    this.horizontal.setAttribute('display', 'none')
    const clean = this.options.clean
    const delay = typeof clean === 'number' ? clean : clean !== false ? 3000 : 0
    if (delay > 0) {
      this.timer = window.setTimeout(() => {
          throw new Error("STUB");
      }, delay)
    }
    return this
  }

  protected onRemove() {
    this.stopListening()
    this.hide()
  }

  @disposable()
  dispose() {
    this.remove()
  }
}
