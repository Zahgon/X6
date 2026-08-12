import {
  Disposable,
  Dom,
  disposable,
  FunctionExt,
  type KeyValue,
} from '../common'
import { FLAG_INSERT, FLAG_REMOVE } from '../constants'
import type { Rectangle } from '../geometry'
import type { Graph } from '../graph'
import type { Cell, ModelEventArgs } from '../model'
import { CellView, EdgeView, NodeView, type View } from '../view'
import type { FlagManagerAction } from '../view/flag'
import { JOB_PRIORITY, JobQueue } from './queueJob'

export enum SchedulerViewState {
  CREATED,
  MOUNTED,
  WAITING,
}

export interface SchedulerView {
  view: CellView
  flag: number
  options: KeyValue
  state: SchedulerViewState
}

export interface SchedulerEventArgs {
  'view:mounted': { view: CellView }
  'view:unmounted': { view: CellView }
  'render:done': null
}
export class Scheduler extends Disposable {
  public views: KeyValue<SchedulerView> = {}
  public willRemoveViews: KeyValue<SchedulerView> = {}
  protected zPivots: KeyValue<Comment>
  private graph: Graph
  private renderArea?: Rectangle
  private queue: JobQueue

  get model() {
      throw new Error("STUB");
  }

  get container() {
      throw new Error("STUB");
  }

  constructor(graph: Graph) {
      throw new Error("STUB");
  }

  protected init() {
    this.startListening()
    this.renderViews(this.model.getCells())
  }

  protected startListening() {
    this.model.on('reseted', this.onModelReseted, this)
    this.model.on('cell:added', this.onCellAdded, this)
    this.model.on('cell:removed', this.onCellRemoved, this)
    this.model.on('cell:change:zIndex', this.onCellZIndexChanged, this)
    this.model.on('cell:change:visible', this.onCellVisibleChanged, this)
  }

  protected stopListening() {
    this.model.off('reseted', this.onModelReseted, this)
    this.model.off('cell:added', this.onCellAdded, this)
    this.model.off('cell:removed', this.onCellRemoved, this)
    this.model.off('cell:change:zIndex', this.onCellZIndexChanged, this)
    this.model.off('cell:change:visible', this.onCellVisibleChanged, this)
  }

  protected onModelReseted({ options, previous }: ModelEventArgs['reseted']) {
      throw new Error("STUB");
  }

  protected onCellAdded({ cell, options }: ModelEventArgs['cell:added']) {
    this.renderViews([cell], options)
  }

  protected onCellRemoved({ cell }: ModelEventArgs['cell:removed']) {
    this.removeViews([cell])
  }

  protected onCellZIndexChanged({
    cell,
    options,
  }: ModelEventArgs['cell:change:zIndex']) {
      throw new Error("STUB");
  }

  protected onCellVisibleChanged({
    cell,
    current,
  }: ModelEventArgs['cell:change:visible']) {
      throw new Error("STUB");
  }

  requestViewUpdate(
    view: CellView,
    flag: number,
    options: KeyValue = {},
    priority: JOB_PRIORITY = JOB_PRIORITY.Update,
    flush = true,
  ) {
    const id = view.cell.id
    const viewItem = this.views[id]

    if (!viewItem) {
      return
    }

    const nextFlag = viewItem.flag | flag
    viewItem.flag = nextFlag
    const prevOptions = viewItem.options || {}
    const nextOptions = options || {}
    if (prevOptions.queue && nextOptions.queue == null) {
      nextOptions.queue = prevOptions.queue
    }
    if (prevOptions.async === false || nextOptions.async === false) {
      nextOptions.async = false
    }
    viewItem.options = nextOptions

    const priorAction = view.hasAction(flag, ['translate', 'resize', 'rotate'])
    if (priorAction || nextOptions.async === false) {
      priority = JOB_PRIORITY.PRIOR // eslint-disable-line
      flush = false // eslint-disable-line
    }

    this.queue.queueJob({
      id,
      priority,
      cb: () => {
          throw new Error("STUB");
      },
    })

    const effectedEdges = this.getEffectedEdges(view)
    effectedEdges.forEach((edge) => {
        throw new Error("STUB");
    })

    if (flush) {
      this.flush()
    }
  }

  setRenderArea(area?: Rectangle) {
    this.renderArea = area

    // 当可视渲染区域变化时，卸载不在区域内且已挂载的视图
    Object.values(this.views).forEach((viewItem) => {
        throw new Error("STUB");
    })

    this.flushWaitingViews()
  }

  isViewMounted(view: CellView) {
    if (view == null) {
      return false
    }

    const viewItem = this.views[view.cell.id]

    if (!viewItem) {
      return false
    }

    return viewItem.state === SchedulerViewState.MOUNTED
  }

  protected renderViews(cells: Cell[], options: any = {}) {
    cells.sort((c1, c2) => {
        throw new Error("STUB");
    })

    cells.forEach((cell) => {
        throw new Error("STUB");
    })

    this.flush()
  }

  protected renderViewInArea(view: CellView, flag: number, options: any = {}) {
    const cell = view.cell
    const id = cell.id
    const viewItem = this.views[id]

    if (!viewItem) {
      return
    }

    let result = 0
    if (this.isUpdatable(view)) {
      result = this.updateView(view, flag, options)
      viewItem.flag = result
    } else {
      // 视图不在当前可渲染区域内
      if (viewItem.state === SchedulerViewState.MOUNTED) {
        // 将已挂载但不在可视区域的视图从 DOM 中卸载
        view.remove()
        this.graph.trigger('view:unmounted', { view })
        result = 0
      }
      // 标记为 WAITING 状态，以便在可视区域变化时重新渲染
      viewItem.state = SchedulerViewState.WAITING
      // 确保重新进入可视区域时能够重新插入到 DOM
      viewItem.flag = flag | FLAG_INSERT | view.getBootstrapFlag()
    }

    if (result) {
      if (
        cell.isEdge() &&
        (result & view.getFlag(['source', 'target'])) === 0
      ) {
        this.queue.queueJob({
          id,
          priority: JOB_PRIORITY.RenderEdge,
          cb: () => {
              throw new Error("STUB");
          },
        })
      }
    }
  }

  protected removeViews(cells: Cell[]) {
    cells.forEach((cell) => {
        throw new Error("STUB");
    })

    this.flush()
  }

  protected flush() {
    this.graph.options.async
      ? this.queue.queueFlush()
      : this.queue.queueFlushSync()
  }

  protected flushWaitingViews() {
    Object.values(this.views).forEach((viewItem) => {
        throw new Error("STUB");
    })

    this.flush()
  }

  protected updateView(view: View, flag: number, options: KeyValue = {}) {
    if (view == null) {
      return 0
    }

    if (CellView.isCellView(view)) {
      if (flag & FLAG_REMOVE) {
        this.removeView(view)
        return 0
      }

      if (flag & FLAG_INSERT) {
        this.insertView(view)
        flag ^= FLAG_INSERT // eslint-disable-line
      }
    }

    if (!flag) {
      return 0
    }

    return view.confirmUpdate(flag, options)
  }

  protected insertView(view: CellView) {
    const viewItem = this.views[view.cell.id]
    if (viewItem) {
      const zIndex = view.cell.getZIndex()
      const pivot = this.addZPivot(zIndex)
      this.container.insertBefore(view.container, pivot)

      if (!view.cell.isVisible()) {
        this.toggleVisible(view.cell, false)
      }

      viewItem.state = SchedulerViewState.MOUNTED
      this.graph.trigger('view:mounted', { view })
    }
  }

  protected resetViews() {
      throw new Error("STUB");
  }

  protected removeView(view: CellView) {
    const cell = view.cell
    const viewItem = this.willRemoveViews[cell.id]
    if (viewItem && view) {
      viewItem.view.remove()
      delete this.willRemoveViews[cell.id]
      this.graph.trigger('view:unmounted', { view })
    }
  }

  protected toggleVisible(cell: Cell, visible: boolean) {
    const edges = this.model.getConnectedEdges(cell)

    for (let i = 0, len = edges.length; i < len; i += 1) {
      const edge = edges[i]
      if (visible) {
        const source = edge.getSourceCell()
        const target = edge.getTargetCell()
        if (
          (source && !source.isVisible()) ||
          (target && !target.isVisible())
        ) {
          continue
        }
        this.toggleVisible(edge, true)
      } else {
        this.toggleVisible(edge, false)
      }
    }

    const viewItem = this.views[cell.id]
    if (viewItem) {
      Dom.css(viewItem.view.container, {
        display: visible ? 'unset' : 'none',
      })
    }
  }

  protected addZPivot(zIndex = 0) {
    if (this.zPivots == null) {
      this.zPivots = {}
    }

    const pivots = this.zPivots
    let pivot = pivots[zIndex]
    if (pivot) {
      return pivot
    }

    pivot = pivots[zIndex] = document.createComment(`z-index:${zIndex + 1}`)
    let neighborZ = -Infinity
    // eslint-disable-next-line
    for (const key in pivots) {
      const currentZ = +key
      if (currentZ < zIndex && currentZ > neighborZ) {
        neighborZ = currentZ
        if (neighborZ === zIndex - 1) {
        }
      }
    }

    const layer = this.container
    if (neighborZ !== -Infinity) {
      const neighborPivot = pivots[neighborZ]
      layer.insertBefore(pivot, neighborPivot.nextSibling)
    } else {
      layer.insertBefore(pivot, layer.firstChild)
    }
    return pivot
  }

  protected removeZPivots() {
      throw new Error("STUB");
  }

  protected createCellView(cell: Cell) {
    const options = { graph: this.graph }

    const createViewHook = this.graph.options.createCellView
    if (createViewHook) {
      const ret = FunctionExt.call(createViewHook, this.graph, cell)
      if (ret) {
        return new ret(cell, options) // eslint-disable-line new-cap
      }
      if (ret === null) {
        // null means not render
        return null
      }
    }

    const view = cell.view

    if (view != null && typeof view === 'string') {
      const def = CellView.registry.get(view)
      if (def) {
        return new def(cell, options) // eslint-disable-line new-cap
      }
      return CellView.registry.onNotFound(view)
    }

    if (cell.isNode()) {
      return new NodeView(cell, options)
    }

    if (cell.isEdge()) {
      return new EdgeView(cell, options)
    }

    return null
  }

  protected getEffectedEdges(view: CellView) {
    const effectedEdges: { id: string; view: CellView; flag: number }[] = []
    const cell = view.cell
    const edges = this.model.getConnectedEdges(cell)

    for (let i = 0, n = edges.length; i < n; i += 1) {
      const edge = edges[i]
      const viewItem = this.views[edge.id]

      if (!viewItem) {
        continue
      }

      const edgeView = viewItem.view
      if (!this.isViewMounted(edgeView)) {
        continue
      }

      const flagLabels: FlagManagerAction[] = ['update']
      if (edge.getTargetCell() === cell) {
        flagLabels.push('target')
      }
      if (edge.getSourceCell() === cell) {
        flagLabels.push('source')
      }
      effectedEdges.push({
        id: edge.id,
        view: edgeView,
        flag: edgeView.getFlag(flagLabels),
      })
    }

    return effectedEdges
  }

  protected isUpdatable(view: CellView) {
    if (view.isNodeView()) {
      if (this.renderArea) {
        return this.renderArea.isIntersectWithRect(view.cell.getBBox())
      }
      return true
    }

    if (view.isEdgeView()) {
      const edge = view.cell
      const intersects = this.renderArea
        ? this.renderArea.isIntersectWithRect(edge.getBBox())
        : true
      if (this.graph.virtualRender.isVirtualEnabled()) {
        return intersects
      }

      const sourceCell = edge.getSourceCell()
      const targetCell = edge.getTargetCell()
      if (this.renderArea && sourceCell && targetCell) {
        return (
          this.renderArea.isIntersectWithRect(sourceCell.getBBox()) ||
          this.renderArea.isIntersectWithRect(targetCell.getBBox())
        )
      }
    }

    return true
  }

  protected getRenderPriority(view: CellView) {
    return view.cell.isNode()
      ? JOB_PRIORITY.RenderNode
      : JOB_PRIORITY.RenderEdge
  }

  @disposable()
  dispose() {
    this.stopListening()
    // clear views
    Object.keys(this.views).forEach((id) => {
        throw new Error("STUB");
    })
    this.views = {}
  }
}
