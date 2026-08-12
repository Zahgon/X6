import {
  Basecoat,
  CssLoader,
  Dom,
  disposable,
  isModifierKeyMatch,
  type ModifierKey,
} from '../../common'
import { Config } from '../../config'
import type { Point, PointLike, Rectangle, RectangleLike } from '../../geometry'
import type {
  BackgroundManagerOptions,
  GetContentAreaOptions,
  Graph,
  GraphPlugin,
  ScaleContentToFitOptions,
  ZoomOptions,
} from '../../graph'
import type { Cell } from '../../model'
import type {
  CenterOptions,
  Direction,
  EventArgs,
  PositionContentOptions,
  Options as SOptions,
  TransitionOptions,
  TransitionToRectOptions,
} from './scroller'
import { getOptions, ScrollerImpl } from './scroller'
import { content } from './style/raw'
import './api'

export interface ScrollerEventArgs extends EventArgs {}

interface Options extends SOptions {
  pannable?:
    | boolean
    | {
        enabled: boolean
        eventTypes: Array<'leftMouseDown' | 'rightMouseDown'>
      }
  modifiers?: string | ModifierKey[] | null // alt, ctrl, shift, meta
}

export type ScrollerOptions = Omit<Options, 'graph'>
export class Scroller
  extends Basecoat<ScrollerEventArgs>
  implements GraphPlugin
{
  public name = 'scroller'
  public options: ScrollerOptions
  private graph: Graph
  private scrollerImpl: ScrollerImpl

  get pannable() {
      throw new Error("STUB");
  }

  get container() {
      throw new Error("STUB");
  }

  constructor(options: ScrollerOptions = {}) {
      throw new Error("STUB");
  }

  public init(graph: Graph) {
    this.graph = graph
    const options = getOptions({
      enabled: true,
      ...this.options,
      graph,
    })
    this.options = options
    this.scrollerImpl = new ScrollerImpl(options)
    this.setup()
    this.autoDisableGraphPanning()
    this.startListening()
    this.updateClassName()
    this.scrollerImpl.center()
  }

  // #region api

  resize(width?: number, height?: number) {
    this.scrollerImpl.resize(width, height)
  }

  resizePage(width?: number, height?: number) {
      throw new Error("STUB");
  }

  zoom(): number
  zoom(factor: number, options?: ZoomOptions): this
  zoom(factor?: number, options?: ZoomOptions) {
    if (typeof factor === 'undefined') {
      return this.scrollerImpl.zoom()
    }
    this.scrollerImpl.zoom(factor, options)
    return this
  }

  zoomTo(factor: number, options: Omit<ZoomOptions, 'absolute'> = {}) {
    this.scrollerImpl.zoom(factor, { ...options, absolute: true })
    return this
  }

  zoomToRect(
    rect: RectangleLike,
    options: ScaleContentToFitOptions & ScaleContentToFitOptions = {},
  ) {
    this.scrollerImpl.zoomToRect(rect, options)
    return this
  }

  zoomToFit(options: GetContentAreaOptions & ScaleContentToFitOptions = {}) {
    this.scrollerImpl.zoomToFit(options)
    return this
  }

  center(optons?: CenterOptions) {
    return this.centerPoint(optons)
  }

  centerPoint(x: number, y: null | number, options?: CenterOptions): this
  centerPoint(x: null | number, y: number, options?: CenterOptions): this
  centerPoint(optons?: CenterOptions): this
  centerPoint(
    x?: number | null | CenterOptions,
    y?: number | null,
    options?: CenterOptions,
  ) {
    this.scrollerImpl.centerPoint(x as number, y as number, options)
    return this
  }

  centerContent(options?: PositionContentOptions) {
    this.scrollerImpl.centerContent(options)
    return this
  }

  centerCell(cell: Cell, options?: CenterOptions) {
    this.scrollerImpl.centerCell(cell, options)
    return this
  }

  positionPoint(
    point: PointLike,
    x: number | string,
    y: number | string,
    options: CenterOptions = {},
  ) {
    this.scrollerImpl.positionPoint(point, x, y, options)

    return this
  }

  positionRect(
    rect: RectangleLike,
    direction: Direction,
    options?: CenterOptions,
  ) {
    this.scrollerImpl.positionRect(rect, direction, options)
    return this
  }

  positionCell(cell: Cell, direction: Direction, options?: CenterOptions) {
    this.scrollerImpl.positionCell(cell, direction, options)
    return this
  }

  positionContent(pos: Direction, options?: PositionContentOptions) {
    this.scrollerImpl.positionContent(pos, options)
    return this
  }

  drawBackground(options?: BackgroundManagerOptions, onGraph?: boolean) {
    if (this.graph.options.background == null || !onGraph) {
      this.scrollerImpl.backgroundManager.draw(options)
    }
    return this
  }

  clearBackground(onGraph?: boolean) {
      throw new Error("STUB");
  }

  isPannable() {
      throw new Error("STUB");
  }

  enablePanning() {
      throw new Error("STUB");
  }

  disablePanning() {
    if (this.pannable) {
      this.options.pannable = false
      this.updateClassName()
    }
  }

  togglePanning(pannable?: boolean) {
      throw new Error("STUB");
  }

  lockScroller() {
    this.scrollerImpl.lock()
    return this
  }

  unlockScroller() {
    this.scrollerImpl.unlock()
    return this
  }

  updateScroller() {
    this.scrollerImpl.update()
    return this
  }

  getScrollbarPosition() {
    return this.scrollerImpl.scrollbarPosition()
  }

  setScrollbarPosition(left?: number, top?: number) {
    this.scrollerImpl.scrollbarPosition(left, top)
    return this
  }

  scrollToPoint(x: number | null | undefined, y: number | null | undefined) {
    this.scrollerImpl.scrollToPoint(x, y)
    return this
  }

  scrollToContent() {
      throw new Error("STUB");
  }

  scrollToCell(cell: Cell) {
      throw new Error("STUB");
  }

  transitionToPoint(p: PointLike, options?: TransitionOptions): this
  transitionToPoint(x: number, y: number, options?: TransitionOptions): this
  transitionToPoint(
    x: number | PointLike,
    y?: number | TransitionOptions,
    options?: TransitionOptions,
  ) {
      throw new Error("STUB");
  }

  transitionToRect(rect: RectangleLike, options: TransitionToRectOptions = {}) {
      throw new Error("STUB");
  }

  enableAutoResize() {
      throw new Error("STUB");
  }

  disableAutoResize() {
      throw new Error("STUB");
  }

  autoScroll(clientX: number, clientY: number) {
    return this.scrollerImpl.autoScroll(clientX, clientY)
  }

  clientToLocalPoint(x: number, y: number): Point {
    return this.scrollerImpl.clientToLocalPoint(x, y)
  }

  getVisibleArea(): Rectangle {
    return this.scrollerImpl.getVisibleArea()
  }

  isCellVisible(cell: Cell, options: { strict?: boolean } = {}) {
      throw new Error("STUB");
  }

  isPointVisible(point: PointLike) {
      throw new Error("STUB");
  }

  // #endregion

  protected setup() {
    this.scrollerImpl.on('*', (name, args) => {
        throw new Error("STUB");
    })
  }

  protected startListening() {
    let eventTypes = []
    const pannable = this.options.pannable
    if (typeof pannable === 'object') {
      eventTypes = pannable.eventTypes || []
    } else {
      eventTypes = ['leftMouseDown']
    }
    if (eventTypes.includes('leftMouseDown')) {
      this.graph.on('blank:mousedown', this.preparePanning, this)
      this.graph.on('node:unhandled:mousedown', this.preparePanning, this)
      this.graph.on('edge:unhandled:mousedown', this.preparePanning, this)
    }
    if (eventTypes.includes('rightMouseDown')) {
      this.onRightMouseDown = this.onRightMouseDown.bind(this)
      Dom.Event.on(
        this.scrollerImpl.container,
        'mousedown',
        this.onRightMouseDown,
      )
    }
  }

  protected stopListening() {
    let eventTypes = []
    const pannable = this.options.pannable
    if (typeof pannable === 'object') {
      eventTypes = pannable.eventTypes || []
    } else {
      eventTypes = ['leftMouseDown']
    }
    if (eventTypes.includes('leftMouseDown')) {
      this.graph.off('blank:mousedown', this.preparePanning, this)
      this.graph.off('node:unhandled:mousedown', this.preparePanning, this)
      this.graph.off('edge:unhandled:mousedown', this.preparePanning, this)
    }
    if (eventTypes.includes('rightMouseDown')) {
      Dom.Event.off(
        this.scrollerImpl.container,
        'mousedown',
        this.onRightMouseDown,
      )
    }
  }

  protected onRightMouseDown(e: Dom.MouseDownEvent) {
      throw new Error("STUB");
  }

  protected preparePanning({ e }: { e: Dom.MouseDownEvent }) {
      throw new Error("STUB");
  }

  protected allowPanning(e: Dom.MouseDownEvent, strict?: boolean) {
    return (
      this.pannable && isModifierKeyMatch(e, this.options.modifiers, strict)
    )
  }

  protected updateClassName(isPanning?: boolean) {
    const container = this.scrollerImpl.container!
    const pannable = Config.prefix('graph-scroller-pannable')
    if (this.pannable) {
      Dom.addClass(container, pannable)
      container.dataset.panning = (!!isPanning).toString() // Use dataset to control scroller panning style to avoid reflow caused by changing classList
    } else {
      Dom.removeClass(container, pannable)
    }
  }

  /**
   * 当 Scroller 插件启用时，默认关闭 Graph 的内置 panning，
   * 以避免滚动容器的拖拽与画布平移产生冲突。
   */
  protected autoDisableGraphPanning() {
    const graphPan = this.graph?.panning
    if (graphPan?.pannable) {
      graphPan.disablePanning()
      console.warn(
        'Detected Scroller plugin; Graph panning has been disabled by default to avoid conflicts.',
      )
    }
  }

  @disposable()
  dispose() {
    this.scrollerImpl.dispose()
    this.stopListening()
    this.off()
    CssLoader.clean(this.name)
  }
}
