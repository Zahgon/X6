import { type Dom, isModifierKeyMatch, type ModifierKey } from '../../common'
import { Config } from '../../config'
import { Point, type PointLike } from '../../geometry'
import type { Graph } from '../../graph'
import type { Edge } from '../../model/edge'
import type { EdgeView } from '../../view/edge'
import { ToolItem, type ToolItemOptions } from '../../view/tool'
import { View } from '../../view/view'
import { createViewElement } from '../../view/view/util'
import type { SimpleAttrs } from '../attr'

const pathClassName = Config.prefix('edge-tool-vertex-path')
export class Vertices extends ToolItem<EdgeView, Options> {
  public static defaults: Options = {
    ...ToolItem.getDefaults(),
    name: 'vertices',
    snapRadius: 20,
    addable: true,
    removable: true,
    removeRedundancies: true,
    stopPropagation: true,
    attrs: {
      r: 6,
      fill: '#333',
      stroke: '#fff',
      cursor: 'move',
      'stroke-width': 2,
    },
    createHandle: (options) => { throw new Error("STUB"); },
    markup: [
      {
        tagName: 'path',
        selector: 'connection',
        className: pathClassName,
        attrs: {
          fill: 'none',
          stroke: 'transparent',
          'stroke-width': 10,
          cursor: 'pointer',
        },
      },
    ],
    events: {
      [`mousedown .${pathClassName}`]: 'onPathMouseDown',
      [`touchstart .${pathClassName}`]: 'onPathMouseDown',
    },
  }

  protected handles: Handle[] = []
  protected get vertices() {
      throw new Error("STUB");
  }

  protected onRender() {
    this.addClass(this.prefixClassName('edge-tool-vertices'))
    if (this.options.addable) {
      this.updatePath()
    }
    this.resetHandles()
    this.renderHandles()
    return this
  }

  update() {
    const vertices = this.vertices
    if (vertices.length === this.handles.length) {
      this.updateHandles()
    } else {
      this.resetHandles()
      this.renderHandles()
    }

    if (this.options.addable) {
      this.updatePath()
    }

    return this
  }

  protected resetHandles() {
    const handles = this.handles
    this.handles = []
    if (handles) {
      handles.forEach((handle) => {
          throw new Error("STUB");
      })
    }
  }

  protected renderHandles() {
    const vertices = this.vertices
    for (let i = 0, l = vertices.length; i < l; i += 1) {
      const vertex = vertices[i]
      const createHandle = this.options.createHandle!
      const processHandle = this.options.processHandle
      const handle = createHandle({
        index: i,
        graph: this.graph,
        guard: (evt: Dom.EventObject) => { throw new Error("STUB"); }, // eslint-disable-line no-loop-func
        attrs: this.options.attrs || {},
      })

      if (processHandle) {
        processHandle(handle)
      }

      handle.updatePosition(vertex.x, vertex.y)
      this.stamp(handle.container)
      this.container.appendChild(handle.container)
      this.handles.push(handle)
      this.startHandleListening(handle)
    }
  }

  protected updateHandles() {
    const vertices = this.vertices
    for (let i = 0, l = vertices.length; i < l; i += 1) {
      const vertex = vertices[i]
      const handle = this.handles[i]
      if (handle) {
        handle.updatePosition(vertex.x, vertex.y)
      }
    }
  }

  protected updatePath() {
    const connection = this.childNodes.connection
    if (connection) {
      connection.setAttribute('d', this.cellView.getConnectionPathData())
    }
  }

  protected startHandleListening(handle: Handle) {
    const edgeView = this.cellView
    if (edgeView.can('vertexMovable')) {
      handle.on('change', this.onHandleChange, this)
      handle.on('changing', this.onHandleChanging, this)
      handle.on('changed', this.onHandleChanged, this)
    }

    if (edgeView.can('vertexDeletable')) {
      handle.on('remove', this.onHandleRemove, this)
    }
  }

  protected stopHandleListening(handle: Handle) {
    const edgeView = this.cellView
    if (edgeView.can('vertexMovable')) {
      handle.off('change', this.onHandleChange, this)
      handle.off('changing', this.onHandleChanging, this)
      handle.off('changed', this.onHandleChanged, this)
    }

    if (edgeView.can('vertexDeletable')) {
      handle.off('remove', this.onHandleRemove, this)
    }
  }

  protected getNeighborPoints(index: number) {
      throw new Error("STUB");
  }

  protected getMouseEventArgs<T extends Dom.EventObject>(evt: T) {
      throw new Error("STUB");
  }

  protected onHandleChange({ e }: EventArgs['change']) {
      throw new Error("STUB");
  }

  protected onHandleChanging({ handle, e }: EventArgs['changing']) {
      throw new Error("STUB");
  }

  protected stopBatch(vertexAdded: boolean) {
    this.cell.stopBatch('move-vertex', { ui: true, toolId: this.cid })
    if (vertexAdded) {
      this.cell.stopBatch('add-vertex', { ui: true, toolId: this.cid })
    }
  }

  protected onHandleChanged({ e }: EventArgs['changed']) {
      throw new Error("STUB");
  }

  protected snapVertex(vertex: PointLike, index: number) {
      throw new Error("STUB");
  }

  protected onHandleRemove({ handle, e }: EventArgs['remove']) {
      throw new Error("STUB");
  }

  protected allowAddVertex(e: Dom.MouseDownEvent) {
      throw new Error("STUB");
  }

  protected onPathMouseDown(evt: Dom.MouseDownEvent) {
      throw new Error("STUB");
  }

  protected onRemove() {
    this.resetHandles()
  }
}

interface Options extends ToolItemOptions {
  snapRadius?: number
  addable?: boolean
  removable?: boolean
  removeRedundancies?: boolean
  stopPropagation?: boolean
  modifiers?: string | ModifierKey[]
  attrs?: SimpleAttrs | ((handle: Handle) => SimpleAttrs)
  createHandle?: (options: HandleOptions) => Handle
  processHandle?: (handle: Handle) => void
  onChanged?: (options: { edge: Edge; edgeView: EdgeView }) => void
}

export class Handle extends View<EventArgs> {
  protected get graph() {
      throw new Error("STUB");
  }

  constructor(public readonly options: HandleOptions) {
      throw new Error("STUB");
  }

  render() {
    this.container = createViewElement('circle', true)
    const attrs = this.options.attrs
    if (typeof attrs === 'function') {
      const defaults = Vertices.getDefaults<Options>()
      this.setAttrs({
        ...defaults.attrs,
        ...attrs(this),
      })
    } else {
      this.setAttrs(attrs)
    }

    this.addClass(this.prefixClassName('edge-tool-vertex'))
  }

  updatePosition(x: number, y: number) {
    this.setAttrs({ cx: x, cy: y })
  }

  onMouseDown(evt: Dom.MouseDownEvent) {
    if (this.options.guard(evt)) {
      return
    }

    evt.stopPropagation()
    evt.preventDefault()
    this.graph.view.undelegateEvents()

    this.delegateDocumentEvents(
      {
        mousemove: 'onMouseMove',
        touchmove: 'onMouseMove',
        mouseup: 'onMouseUp',
        touchend: 'onMouseUp',
        touchcancel: 'onMouseUp',
      },
      evt.data,
    )

    this.emit('change', { e: evt, handle: this })
  }

  protected onMouseMove(evt: Dom.MouseMoveEvent) {
    this.emit('changing', { e: evt, handle: this })
  }

  protected onMouseUp(evt: Dom.MouseUpEvent) {
    this.emit('changed', { e: evt, handle: this })
    this.undelegateDocumentEvents()
    this.graph.view.delegateEvents()
  }

  protected onDoubleClick(evt: Dom.DoubleClickEvent) {
      throw new Error("STUB");
  }
}

interface HandleOptions {
  graph: Graph
  index: number
  guard: (evt: Dom.EventObject) => boolean
  attrs: SimpleAttrs | ((handle: Handle) => SimpleAttrs)
}

interface EventArgs {
  change: { e: Dom.MouseDownEvent; handle: Handle }
  changing: { e: Dom.MouseMoveEvent; handle: Handle }
  changed: { e: Dom.MouseUpEvent; handle: Handle }
  remove: { e: Dom.DoubleClickEvent; handle: Handle }
}
