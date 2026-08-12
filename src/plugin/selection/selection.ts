import {
  Dom,
  disposable,
  FunctionExt,
  isModifierKeyMatch,
  type KeyValue,
  type ModifierKey,
} from '../../common'
import {
  type Point,
  type PointLike,
  Rectangle,
  type RectangleLike,
} from '../../geometry'
import type { Graph } from '../../graph'
import type {
  CollectionAddOptions,
  CollectionRemoveOptions,
  CollectionSetOptions,
  Edge,
  Model,
  Node,
  SetOptions,
} from '../../model'
import { Cell, Collection, type CollectionEventArgs } from '../../model'
import type { RouterData } from '../../model/edge'
import { routerRegistry } from '../../registry'
import { type CellView, View } from '../../view'
import type { Scroller } from '../scroller'

export class SelectionImpl extends View<SelectionImplEventArgs> {
  public readonly options: SelectionImplOptions
  protected readonly collection: Collection
  protected selectionContainer: HTMLElement
  protected selectionContent: HTMLElement
  protected boxCount: number
  protected boxesUpdated: boolean
  protected updateThrottleTimer: ReturnType<typeof setTimeout> | null = null
  protected isDragging: boolean = false
  protected batchUpdating: boolean = false
  // 逐帧批处理拖拽位移，降低 translate 重绘频率
  protected dragRafId: number | null = null
  // 合并缩放/平移下的选择框刷新到每帧一次
  protected transformRafId: number | null = null
  protected dragPendingOffset: { dx: number; dy: number } | null = null
  protected containerLocalOffsetX: number = 0
  protected containerLocalOffsetY: number = 0
  protected containerOffsetX: number = 0
  protected containerOffsetY: number = 0
  protected draggingPreviewMode: 'translate' | 'geometry' = 'translate'
  // 拖拽过程的缓存，减少每次 move 重复计算
  protected translatingCache: {
    selectedNodes: Node[]
    nodeIdSet: Set<string>
    edgesToTranslate: Edge[]
  } | null = null
  protected movingRouterRestoreCache: KeyValue<RouterData | undefined> | null =
    null
  protected movingRouterRestoreTimer: ReturnType<typeof setTimeout> | null =
    null
  protected lastMovingTs: number | null = null
  protected movingDegradeActivatedTs: number | null = null
  private static readonly RESTORE_IDLE_TIME = 100
  private static readonly RESTORE_HOLD_TIME = 150
  private static readonly MIN_RESTORE_WAIT_TIME = 50

  public get graph() {
      throw new Error("STUB");
  }

  protected get boxClassName() {
      throw new Error("STUB");
  }

  protected get $boxes() {
      throw new Error("STUB");
  }

  protected get handleOptions() {
      throw new Error("STUB");
  }

  constructor(options: SelectionImplOptions) {
      throw new Error("STUB");
  }

  protected startListening() {
    const graph = this.graph
    const collection = this.collection

    this.delegateEvents(
      {
        [`mousedown .${this.boxClassName}`]: 'onSelectionBoxMouseDown',
        [`touchstart .${this.boxClassName}`]: 'onSelectionBoxMouseDown',
        [`mousedown .${this.prefixClassName(classNames.inner)}`]:
          'onSelectionContainerMouseDown',
        [`touchstart .${this.prefixClassName(classNames.inner)}`]:
          'onSelectionContainerMouseDown',
      },
      true,
    )

    graph.on('scale', this.onGraphTransformed, this)
    graph.on('translate', this.onGraphTransformed, this)
    graph.model.on('updated', this.onModelUpdated, this)

    collection.on('added', this.onCellAdded, this)
    collection.on('removed', this.onCellRemoved, this)
    collection.on('reseted', this.onReseted, this)
    collection.on('updated', this.onCollectionUpdated, this)
    collection.on('node:change:position', this.onNodePositionChanged, this)
    collection.on('cell:changed', this.onCellChanged, this)
  }

  protected stopListening() {
    const graph = this.graph
    const collection = this.collection

    this.undelegateEvents()

    graph.off('scale', this.onGraphTransformed, this)
    graph.off('translate', this.onGraphTransformed, this)
    // 清理缩放/平移的 rAF 刷新与 throttleTimer
    if (this.transformRafId != null) {
      cancelAnimationFrame(this.transformRafId)
      this.transformRafId = null
    }
    if (this.updateThrottleTimer) {
      clearTimeout(this.updateThrottleTimer)
      this.updateThrottleTimer = null
    }
    graph.model.off('updated', this.onModelUpdated, this)

    collection.off('added', this.onCellAdded, this)
    collection.off('removed', this.onCellRemoved, this)
    collection.off('reseted', this.onReseted, this)
    collection.off('updated', this.onCollectionUpdated, this)
    collection.off('node:change:position', this.onNodePositionChanged, this)
    collection.off('cell:changed', this.onCellChanged, this)
  }

  protected onRemove() {
    this.stopListening()
  }

  protected onGraphTransformed() {
      throw new Error("STUB");
  }

  protected onCellChanged() {
      throw new Error("STUB");
  }

  protected translating: boolean

  protected onNodePositionChanged({
    node,
    options,
  }: CollectionEventArgs['node:change:position']) {
      throw new Error("STUB");
  }

  protected onModelUpdated({ removed }: CollectionEventArgs['updated']) {
      throw new Error("STUB");
  }

  isEmpty() {
    return this.length <= 0
  }

  isSelected(cell: Cell | string) {
    return this.collection.has(cell)
  }

  get length() {
    return this.collection.length
  }

  get cells() {
      throw new Error("STUB");
  }

  select(cells: Cell | Cell[], options: SelectionImplAddOptions = {}) {
    options.dryrun = true
    const items = this.filter(Array.isArray(cells) ? cells : [cells])
    this.collection.add(items, options)
    return this
  }

  unselect(cells: Cell | Cell[], options: SelectionImplRemoveOptions = {}) {
    // dryrun to prevent cell be removed from graph
    options.dryrun = true
    this.collection.remove(Array.isArray(cells) ? cells : [cells], options)
    return this
  }

  reset(cells?: Cell | Cell[], options: SelectionImplSetOptions = {}) {
    if (cells) {
      this.batchUpdating = !!options.batch
      const prev = this.cells
      const next = this.filter(Array.isArray(cells) ? cells : [cells])
      const prevMap: KeyValue<Cell> = {}
      const nextMap: KeyValue<Cell> = {}
      for (const cell of prev) {
        prevMap[cell.id] = cell
      }
      for (const cell of next) {
        nextMap[cell.id] = cell
      }

      const added: Cell[] = []
      const removed: Cell[] = []
      next.forEach((cell) => {
          throw new Error("STUB");
      })
      prev.forEach((cell) => {
          throw new Error("STUB");
      })

      if (removed.length) {
        this.unselect(removed, { ...options, ui: true })
      }

      if (added.length) {
        this.select(added, { ...options, ui: true })
      }

      this.updateContainer()
      this.batchUpdating = false

      return this
    }

    return this.clean(options)
  }

  clean(options: SelectionImplSetOptions = {}) {
    if (this.length) {
      this.unselect(this.cells, options)
    }
    // 清理容器 transform 与位移累计
    this.resetContainerPosition()
    this.draggingPreviewMode = 'translate'
    return this
  }

  setFilter(filter?: SelectionImplFilter) {
    this.options.filter = filter
  }

  setContent(content?: SelectionImplContent) {
    this.options.content = content
  }

  startSelecting(evt: Dom.MouseDownEvent) {
      throw new Error("STUB");
  }

  filter(cells: Cell[]) {
    const filter = this.options.filter

    return cells.filter((cell) => {
        throw new Error("STUB");
    })
  }

  protected stopSelecting(evt: Dom.MouseUpEvent) {
    // 重置拖拽状态和清理定时器
    this.isDragging = false
    this.boxesUpdated = false
    if (this.updateThrottleTimer) {
      clearTimeout(this.updateThrottleTimer)
      this.updateThrottleTimer = null
    }

    const graph = this.graph
    const eventData = this.getEventData<CommonEventData>(evt)
    const action = eventData.action
    switch (action) {
      case 'selecting': {
        const client = graph.snapToGrid(evt.clientX, evt.clientY)
        const rect = this.getSelectingRect()
        const cells = this.getCellsInArea(rect)
        this.reset(cells, { batch: true })
        this.hideRubberband()
        this.notifyBoxEvent('box:mouseup', evt, client.x, client.y, cells)
        break
      }

      case 'translating': {
        const client = graph.snapToGrid(evt.clientX, evt.clientY)
        if (this.dragPendingOffset) {
          const toApply = this.dragPendingOffset
          this.dragPendingOffset = null
          this.applyDraggingPreview(toApply)
        }
        if (this.dragRafId != null) {
          cancelAnimationFrame(this.dragRafId)
          this.dragRafId = null
        }
        // 重置容器 transform 与累计偏移
        this.resetContainerPosition()
        if (this.movingRouterRestoreTimer) {
          clearTimeout(this.movingRouterRestoreTimer)
          this.movingRouterRestoreTimer = null
        }
        this.restoreMovingRouters()
        this.graph.model.stopBatch('move-selection')
        // 清理本次拖拽缓存
        this.translatingCache = null
        this.draggingPreviewMode = 'translate'
        this.notifyBoxEvent('box:mouseup', evt, client.x, client.y)
        this.repositionSelectionBoxesInPlace()
        break
      }

      default: {
        this.clean()
        break
      }
    }

    this.undelegateDocumentEvents()
  }

  protected onMouseUp(evt: Dom.MouseUpEvent) {
    const e = this.normalizeEvent(evt)
    const eventData = this.getEventData<CommonEventData>(e)
    if (eventData) {
      this.stopSelecting(evt)
    }
  }

  protected onSelectionBoxMouseDown(evt: Dom.MouseDownEvent) {
      throw new Error("STUB");
  }

  protected onSelectionContainerMouseDown(evt: Dom.MouseDownEvent) {
      throw new Error("STUB");
  }

  protected handleSelectionMouseDown(evt: Dom.MouseDownEvent, isBox: boolean) {
      throw new Error("STUB");
  }

  protected startTranslating(evt: Dom.MouseDownEvent) {
      throw new Error("STUB");
  }

  private getRestrictArea(): RectangleLike | null {
    const restrict = this.graph.options.translating.restrict
    const area =
      typeof restrict === 'function'
        ? FunctionExt.call(restrict, this.graph, null)
        : restrict

    if (typeof area === 'number') {
      return this.graph.transform.getGraphArea().inflate(area)
    }

    if (area === true) {
      return this.graph.transform.getGraphArea()
    }

    return area || null
  }

  // 根据当前选择的节点构建拖拽缓存
  protected prepareTranslatingCache() {
      throw new Error("STUB");
  }

  /**
   * 在移动过程中对与当前选中节点相连的边进行临时路由降级
   */
  protected applyMovingRouterFallback() {
      throw new Error("STUB");
  }

  /**
   * 恢复移动过程中被降级的边的原始路由：
   * - 如果原始路由为空则移除路由设置
   * - 完成恢复后清空缓存，等待下一次移动重新降级
   */
  protected restoreMovingRouters() {
    const restore = this.movingRouterRestoreCache
    if (!restore) return
    Object.keys(restore).forEach((id) => {
        throw new Error("STUB");
    })
    this.movingRouterRestoreCache = null
  }

  /**
   * 在移动停止后延迟恢复路由，避免连线抖动：
   * - `idle`：距离上次移动的空闲时间必须超过 100ms
   * - `hold`：降级保持时间必须超过 150ms
   * - 若条件未满足则按最小等待时间再次调度恢复
   */
  protected scheduleMovingRouterRestoreThrottle() {
      throw new Error("STUB");
  }

  protected getSelectionOffset(client: Point, data: TranslatingEventData) {
      throw new Error("STUB");
  }

  protected updateSelectedNodesPosition(offset: { dx: number; dy: number }) {
      throw new Error("STUB");
  }

  protected autoScrollGraph(
    x: number,
    y: number,
  ): { scrollerX: number; scrollerY: number } {
    const scroller = this.graph.getPlugin<Scroller>('scroller')
    if (scroller?.autoScroll) {
      return scroller.autoScroll(x, y)
    }
    return { scrollerX: 0, scrollerY: 0 }
  }

  protected adjustSelection(evt: Dom.MouseMoveEvent) {
      throw new Error("STUB");
  }

  protected translateSelectedNodes(
    dx: number,
    dy: number,
    exclude?: Cell,
    otherOptions?: KeyValue,
  ) {
    const map: { [id: string]: boolean } = {}
    const excluded: Cell[] = []

    if (exclude) {
      map[exclude.id] = true
    }

    this.collection.toArray().forEach((cell) => {
        throw new Error("STUB");
    })
    if (otherOptions?.translateBy) {
      const currentCell = this.graph.getCellById(otherOptions.translateBy)
      if (currentCell) {
        map[currentCell.id] = true
        currentCell.getDescendants({ deep: true }).forEach((child) => {
            throw new Error("STUB");
        })
        excluded.push(currentCell)
      }
    }

    const options = {
      ...otherOptions,
      selection: this.cid,
      exclude: excluded,
    }

    // 移动选中的节点，避免重复和嵌套
    const cachedSelectedNodes = this.translatingCache?.selectedNodes
    const selectedNodes = (
      cachedSelectedNodes ??
      (this.collection.toArray().filter((cell) => { throw new Error("STUB"); }) as Node[])
    ).filter((node) => { throw new Error("STUB"); })
    selectedNodes.forEach((node) => {
        throw new Error("STUB");
    })

    // 边移动缓存：仅移动需要位移的边（有顶点或点端点）
    const cachedEdges = this.translatingCache?.edgesToTranslate
    const edgesToTranslate = new Set<Edge>()
    if (cachedEdges) {
      cachedEdges.forEach((edge) => {
          throw new Error("STUB");
      })
    } else {
      const selectedNodeIdSet = new Set(selectedNodes.map((n) => { throw new Error("STUB"); }))
      this.graph.model.getEdges().forEach((edge) => {
          throw new Error("STUB");
      })
    }

    // 若选择了边（仅边、无节点），确保其也被移动（过滤无顶点且两端为节点的情况）
    const selectedEdges = this.collection
      .toArray()
      .filter((cell): cell is Edge => { throw new Error("STUB"); })
    selectedEdges.forEach((edge) => {
        throw new Error("STUB");
    })

    edgesToTranslate.forEach((edge) => {
        throw new Error("STUB");
    })
  }

  protected getCellViewsInArea(rect: Rectangle) {
    const graph = this.graph
    const options = {
      strict: this.options.strict,
    }
    let views: CellView[] = []

    if (this.options.rubberNode) {
      views = views.concat(
        graph.model
          .getNodesInArea(rect, options)
          .map((node) => { throw new Error("STUB"); })
          .filter((view) => { throw new Error("STUB"); }) as CellView[],
      )
    }

    if (this.options.rubberEdge) {
      views = views.concat(
        graph.model
          .getEdgesInArea(rect, options)
          .map((edge) => { throw new Error("STUB"); })
          .filter((view) => { throw new Error("STUB"); }) as CellView[],
      )
    }

    return views
  }

  protected getCellsInArea(rect: Rectangle) {
    return this.filter(this.getCellViewsInArea(rect).map((view) => { throw new Error("STUB"); }))
  }

  protected getSelectingRect() {
    let width = Dom.width(this.container)
    let height = Dom.height(this.container)
    const offset = Dom.offset(this.container)
    const origin = this.graph.pageToLocal(offset.left, offset.top)
    const scale = this.graph.transform.getScale()
    width /= scale.sx
    height /= scale.sy
    return new Rectangle(origin.x, origin.y, width, height)
  }

  protected getBoxEventCells(
    cells?: Cell[],
    activeView: CellView | null = null,
  ) {
    const nodes: Node[] = []
    const edges: Edge[] = []
    let view = activeView

    ;(cells ?? this.cells).forEach((cell) => {
        throw new Error("STUB");
    })

    return {
      view,
      cell: view?.cell ?? null,
      nodes,
      edges,
    }
  }

  protected notifyBoxEvent<
    K extends keyof SelectionImplBoxEventArgsRecord,
    T extends Dom.EventObject,
  >(name: K, e: T, x: number, y: number, cells?: Cell[]) {
    const activeView =
      this.getEventData<SelectionBoxEventData | null>(e)?.activeView ?? null
    const { view, cell, nodes, edges } = this.getBoxEventCells(
      cells,
      activeView,
    )
    this.trigger(name, { e, view, x, y, cell, nodes, edges })
  }

  protected getSelectedClassName(cell: Cell) {
    return this.prefixClassName(`${cell.isNode() ? 'node' : 'edge'}-selected`)
  }

  protected addCellSelectedClassName(cell: Cell) {
    const view = this.graph.renderer.findViewByCell(cell)
    if (view) {
      view.addClass(this.getSelectedClassName(cell))
    }
  }

  protected removeCellUnSelectedClassName(cell: Cell) {
    const view = this.graph.renderer.findViewByCell(cell)
    if (view) {
      view.removeClass(this.getSelectedClassName(cell))
    }
  }

  protected destroySelectionBox(cell: Cell) {
    this.removeCellUnSelectedClassName(cell)

    if (this.canShowSelectionBox(cell)) {
      Dom.remove(this.container.querySelector(`[data-cell-id="${cell.id}"]`))
      if (this.$boxes.length === 0) {
        this.hide()
      }
      this.boxCount = Math.max(0, this.boxCount - 1)
    }
  }

  protected destroyAllSelectionBoxes(cells: Cell[]) {
      throw new Error("STUB");
  }

  hide() {
    Dom.removeClass(this.container, this.prefixClassName(classNames.rubberband))
    Dom.removeClass(this.container, this.prefixClassName(classNames.selected))
  }

  protected showRubberband() {
      throw new Error("STUB");
  }

  protected hideRubberband() {
    Dom.removeClass(this.container, this.prefixClassName(classNames.rubberband))
  }

  protected showSelected() {
    Dom.removeAttribute(this.container, 'style')
    Dom.addClass(this.container, this.prefixClassName(classNames.selected))
  }

  protected createContainer() {
    this.container = document.createElement('div')
    Dom.addClass(this.container, this.prefixClassName(classNames.root))
    if (this.options.className) {
      Dom.addClass(this.container, this.options.className)
    }
    Dom.css(this.container, {
      willChange: 'transform',
    })

    this.selectionContainer = document.createElement('div')
    Dom.addClass(
      this.selectionContainer,
      this.prefixClassName(classNames.inner),
    )

    this.selectionContent = document.createElement('div')
    Dom.addClass(
      this.selectionContent,
      this.prefixClassName(classNames.content),
    )

    Dom.append(this.selectionContainer, this.selectionContent)
    Dom.attr(
      this.selectionContainer,
      'data-selection-length',
      this.collection.length,
    )

    Dom.prepend(this.container, this.selectionContainer)
  }

  protected getDraggingPreviewMode() {
      throw new Error("STUB");
  }

  protected applyDraggingPreview(offset: { dx: number; dy: number }) {
    if (offset.dx === 0 && offset.dy === 0) {
      return
    }

    if (this.options.following) {
      this.translateSelectedNodes(offset.dx, offset.dy)

      if (this.draggingPreviewMode === 'geometry') {
        this.repositionSelectionBoxesInPlace()
        this.resetContainerPosition()
        return
      }
    }

    this.updateContainerPosition(offset)
  }

  protected resetContainerPosition() {
    this.containerLocalOffsetX = 0
    this.containerLocalOffsetY = 0
    this.containerOffsetX = 0
    this.containerOffsetY = 0
    Dom.css(this.container, 'transform', '')
  }

  protected syncContainerPosition() {
    const origin = this.graph.coord.localToGraphPoint(0, 0)
    const offset = this.graph.coord.localToGraphPoint(
      this.containerLocalOffsetX,
      this.containerLocalOffsetY,
    )

    this.containerOffsetX = offset.x - origin.x
    this.containerOffsetY = offset.y - origin.y

    if (this.containerOffsetX === 0 && this.containerOffsetY === 0) {
      Dom.css(this.container, 'transform', '')
      return
    }

    Dom.css(
      this.container,
      'transform',
      `translate3d(${this.containerOffsetX}px, ${this.containerOffsetY}px, 0)`,
    )
  }

  protected updateContainerPosition(offset: { dx: number; dy: number }) {
    if (offset.dx || offset.dy) {
      this.containerLocalOffsetX += offset.dx
      this.containerLocalOffsetY += offset.dy
      // 使用 transform，避免频繁修改 left/top
      this.syncContainerPosition()
    }
  }

  protected updateContainer() {
    const origin = { x: Infinity, y: Infinity }
    const corner = { x: 0, y: 0 }
    const cells = this.collection
      .toArray()
      .filter((cell) => { throw new Error("STUB"); })

    cells.forEach((cell) => {
        throw new Error("STUB");
    })

    Dom.css(this.selectionContainer, {
      position: 'absolute',
      pointerEvents: this.options.movable ? 'auto' : 'none',
      cursor: this.options.movable ? 'move' : 'default',
      left: origin.x,
      top: origin.y,
      width: corner.x - origin.x,
      height: corner.y - origin.y,
    })
    Dom.attr(
      this.selectionContainer,
      'data-selection-length',
      this.collection.length,
    )

    const boxContent = this.options.content
    if (boxContent) {
      if (typeof boxContent === 'function') {
        const content = FunctionExt.call(
          boxContent,
          this.graph,
          this,
          this.selectionContent,
        )
        if (content) {
          this.selectionContent.innerHTML = content
        }
      } else {
        this.selectionContent.innerHTML = boxContent
      }
    }

    if (this.collection.length > 0 && !this.container.parentNode) {
      Dom.appendTo(this.container, this.graph.container)
    } else if (this.collection.length <= 0 && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container)
    }
  }

  protected canShowSelectionBox(cell: Cell) {
    return (
      (cell.isNode() && this.options.showNodeSelectionBox === true) ||
      (cell.isEdge() && this.options.showEdgeSelectionBox === true)
    )
  }

  protected getPointerEventsValue(
    pointerEvents: 'none' | 'auto' | ((cells: Cell[]) => 'none' | 'auto'),
  ) {
    return typeof pointerEvents === 'string'
      ? pointerEvents
      : pointerEvents(this.cells)
  }

  protected createSelectionBox(cell: Cell) {
    this.addCellSelectedClassName(cell)

    if (this.canShowSelectionBox(cell)) {
      const view = this.graph.renderer.findViewByCell(cell)
      if (view) {
        const bbox = view.getBBox({
          useCellGeometry: true,
        })

        const className = this.boxClassName
        const box = document.createElement('div')
        const pointerEvents = this.options.pointerEvents
        Dom.addClass(box, className)
        Dom.addClass(box, `${className}-${cell.isNode() ? 'node' : 'edge'}`)
        Dom.attr(box, 'data-cell-id', cell.id)
        Dom.css(box, {
          position: 'absolute',
          left: bbox.x,
          top: bbox.y,
          width: bbox.width,
          height: bbox.height,
          pointerEvents: pointerEvents
            ? this.getPointerEventsValue(pointerEvents)
            : 'auto',
        })
        Dom.appendTo(box, this.container)
        this.showSelected()
        this.boxCount += 1
      }
    }
  }

  protected updateSelectionBoxes() {
      throw new Error("STUB");
  }

  protected refreshSelectionBoxes() {
    Dom.remove(this.$boxes)
    this.boxCount = 0

    this.collection.toArray().forEach((cell) => {
        throw new Error("STUB");
    })

    this.updateContainer()
    this.boxesUpdated = true
  }

  // 按当前视图几何同步每个选择框的位置与尺寸
  protected repositionSelectionBoxesInPlace() {
    const boxes = this.$boxes
    if (boxes.length === 0) {
      this.refreshSelectionBoxes()
      return
    }

    for (const elem of boxes) {
      const id = elem.getAttribute('data-cell-id')
      if (!id) continue
      const cell = this.collection.get(id)
      if (!cell) continue
      const view = this.graph.renderer.findViewByCell(cell)
      if (!view) continue
      const bbox = view.getBBox({ useCellGeometry: true })
      Dom.css(elem, {
        left: bbox.x,
        top: bbox.y,
        width: bbox.width,
        height: bbox.height,
      })
    }

    this.updateContainer()
    this.boxesUpdated = true
  }

  protected getCellViewFromElem(elem: Element) {
      throw new Error("STUB");
  }

  protected onCellRemoved({ cell }: CollectionEventArgs['removed']) {
    this.destroySelectionBox(cell)
    if (!this.batchUpdating) this.updateContainer()
  }

  protected onReseted({ previous, current }: CollectionEventArgs['reseted']) {
      throw new Error("STUB");
  }

  protected onCellAdded({ cell }: CollectionEventArgs['added']) {
    // The collection do not known the cell was removed when cell was
    // removed by interaction(such as, by "delete" shortcut), so we should
    // manually listen to cell's remove event.
    this.listenCellRemoveEvent(cell)
    this.createSelectionBox(cell)
    if (!this.batchUpdating) this.updateContainer()
  }

  protected listenCellRemoveEvent(cell: Cell) {
    cell.off('removed', this.onCellRemoved, this)
    cell.on('removed', this.onCellRemoved, this)
  }

  protected onCollectionUpdated({
    added,
    removed,
    options,
  }: CollectionEventArgs['updated']) {
      throw new Error("STUB");
  }

  // #endregion

  @disposable()
  dispose() {
    this.clean()
    this.remove()
    this.off()
  }
}

type SelectionEventType = 'leftMouseDown' | 'mouseWheelDown'

export interface SelectionImplCommonOptions {
  model?: Model
  collection?: Collection
  className?: string
  strict?: boolean
  filter?: SelectionImplFilter
  modifiers?: string | ModifierKey[] | null
  multiple?: boolean
  multipleSelectionModifiers?: string | ModifierKey[] | null

  selectCellOnMoved?: boolean
  selectNodeOnMoved?: boolean
  selectEdgeOnMoved?: boolean

  showEdgeSelectionBox?: boolean
  showNodeSelectionBox?: boolean
  movable?: boolean
  following?: boolean
  content?: SelectionImplContent

  // Can select node or edge when rubberband
  rubberband?: boolean
  rubberNode?: boolean
  rubberEdge?: boolean

  // Whether to respond event on the selectionBox
  pointerEvents?: 'none' | 'auto' | ((cells: Cell[]) => 'none' | 'auto')

  // with which mouse button the selection can be started
  eventTypes?: SelectionEventType[]
  movingRouterFallback?: string
}

export interface SelectionImplOptions extends SelectionImplCommonOptions {
  graph: Graph
}

export type SelectionImplContent =
  | null
  | false
  | string
  | ((
      this: Graph,
      selection: SelectionImpl,
      contentElement: HTMLElement,
    ) => string)

export type SelectionImplFilter =
  | null
  | (string | { id: string })[]
  | ((this: Graph, cell: Cell) => boolean)

export interface SelectionImplSetOptions extends CollectionSetOptions {
  batch?: boolean
}

export interface SelectionImplAddOptions extends CollectionAddOptions {}

export interface SelectionImplRemoveOptions extends CollectionRemoveOptions {}

interface BaseSelectionBoxEventArgs<T> {
  e: T
  view: CellView | null
  cell: Cell | null
  x: number
  y: number
  nodes: Node[]
  edges: Edge[]
}

export interface SelectionImplBoxEventArgsRecord {
  'box:mousedown': BaseSelectionBoxEventArgs<Dom.MouseDownEvent>
  'box:mousemove': BaseSelectionBoxEventArgs<Dom.MouseMoveEvent>
  'box:mouseup': BaseSelectionBoxEventArgs<Dom.MouseUpEvent>
}

export interface SelectionImplEventArgsRecord {
  'cell:selected': { cell: Cell; options: SetOptions }
  'node:selected': { cell: Cell; node: Node; options: SetOptions }
  'edge:selected': { cell: Cell; edge: Edge; options: SetOptions }
  'cell:unselected': { cell: Cell; options: SetOptions }
  'node:unselected': { cell: Cell; node: Node; options: SetOptions }
  'edge:unselected': { cell: Cell; edge: Edge; options: SetOptions }
  'selection:changed': {
    added: Cell[]
    removed: Cell[]
    selected: Cell[]
    options: SetOptions
  }
}

export interface SelectionImplEventArgs
  extends SelectionImplBoxEventArgsRecord,
    SelectionImplEventArgsRecord {}

// private
// -------
const baseClassName = 'widget-selection'

export const classNames = {
  root: baseClassName,
  inner: `${baseClassName}-inner`,
  box: `${baseClassName}-box`,
  content: `${baseClassName}-content`,
  rubberband: `${baseClassName}-rubberband`,
  selected: `${baseClassName}-selected`,
}

export const documentEvents = {
  mousemove: 'adjustSelection',
  touchmove: 'adjustSelection',
  mouseup: 'onMouseUp',
  touchend: 'onMouseUp',
  touchcancel: 'onMouseUp',
}

export function depthComparator(cell: Cell) {
    throw new Error("STUB");
}

export interface CommonEventData {
  action: 'selecting' | 'translating'
}

export interface SelectingEventData extends CommonEventData {
  action: 'selecting'
  moving?: boolean
  clientX: number
  clientY: number
  offsetX: number
  offsetY: number
  scrollerX: number
  scrollerY: number
}

export interface TranslatingEventData extends CommonEventData {
  action: 'translating'
  clientX: number
  clientY: number
  originX: number
  originY: number
}

export interface SelectionBoxEventData {
  activeView: CellView
}

export interface RotationEventData {
  rotated?: boolean
  center: PointLike
  start: number
  angles: { [id: string]: number }
}

export interface ResizingEventData {
  resized?: boolean
  bbox: Rectangle
  cells: Cell[]
  minWidth: number
  minHeight: number
}
