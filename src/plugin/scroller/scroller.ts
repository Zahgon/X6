import {
  Dom,
  disposable,
  FunctionExt,
  NumberExt,
  ObjectExt,
  IS_EDGE,
  IS_IE,
  Util,
} from '../../common'
import {
  Point,
  Rectangle,
  type PointLike,
  type RectangleLike,
} from '../../geometry'
import {
  BackgroundManager,
  type BackgroundManagerOptions,
  type EventArgs as TEventArgs,
  type Graph,
  GraphView,
  FitToContentFullOptions,
  ZoomOptions,
  ScaleContentToFitOptions,
  GetContentAreaOptions,
} from '../../graph'
import type { Cell } from '../../model'
import type { ViewEvents } from '../../types'
import { View } from '../../view'

export interface EventArgs {
  'pan:start': { e: Dom.MouseDownEvent }
  panning: { e: Dom.MouseMoveEvent }
  'pan:stop': { e: Dom.MouseUpEvent }
}
export interface Options {
  graph: Graph
  enabled?: boolean
  className?: string
  width?: number
  height?: number
  pageWidth?: number
  pageHeight?: number
  pageVisible?: boolean
  pageBreak?: boolean
  minVisibleWidth?: number
  minVisibleHeight?: number
  background?: false | BackgroundManagerOptions
  autoResize?: boolean
  padding?:
    | NumberExt.SideOptions
    | ((this: ScrollerImpl, scroller: ScrollerImpl) => NumberExt.SideOptions)
  autoResizeOptions?:
    | FitToContentFullOptions
    | ((this: ScrollerImpl, scroller: ScrollerImpl) => FitToContentFullOptions)
}
export interface CenterOptions {
  padding?: NumberExt.SideOptions
}

export type PositionContentOptions = GetContentAreaOptions & CenterOptions

export type Direction =
  | 'center'
  | 'top'
  | 'top-right'
  | 'top-left'
  | 'right'
  | 'bottom-right'
  | 'bottom'
  | 'bottom-left'
  | 'left'

export interface TransitionOptions {
  /**
   * The zoom level to reach at the end of the transition.
   */
  scale?: number
  duration?: string
  delay?: string
  timing?: string
  onTransitionEnd?: (this: ScrollerImpl, e: TransitionEvent) => void
}

export interface TransitionToRectOptions extends TransitionOptions {
  minScale?: number
  maxScale?: number
  scaleGrid?: number
  visibility?: number
  center?: PointLike
}

export type AutoResizeDirection = 'top' | 'right' | 'bottom' | 'left'

export const containerClass = 'graph-scroller'
export const panningClass = `${containerClass}-panning`
export const pannableClass = `${containerClass}-pannable`
export const pagedClass = `${containerClass}-paged`
export const contentClass = `${containerClass}-content`
export const backgroundClass = `${containerClass}-background`
export const transitionClassName = 'transition-in-progress'
export const transitionEventName = 'transitionend.graph-scroller-transition'

export const defaultOptions: Partial<Options> = {
  padding() {
        throw new Error("STUB");
    },
  minVisibleWidth: 50,
  minVisibleHeight: 50,
  pageVisible: false,
  pageBreak: false,
  autoResize: true,
}

export function getOptions(options: Options) {
  const result = ObjectExt.merge({}, defaultOptions, options)

  if (result.pageWidth == null) {
    result.pageWidth = options.graph.options.width
  }
  if (result.pageHeight == null) {
    result.pageHeight = options.graph.options.height
  }

  const graphOptions = options.graph.options
  if (graphOptions.background && result.enabled && result.background == null) {
    result.background = graphOptions.background
    options.graph.background.clear()
  }

  return result as Options
}

export class ScrollerImpl extends View<EventArgs> {
  private readonly content: HTMLDivElement
  protected pageBreak: HTMLDivElement | null
  public readonly options: Options
  public readonly container: HTMLDivElement
  public readonly background: HTMLDivElement
  public readonly backgroundManager: ScrollerImplBackground

  public get graph() {
      throw new Error("STUB");
  }

  private get model() {
      throw new Error("STUB");
  }

  protected sx: number
  protected sy: number
  protected clientX: number
  protected clientY: number
  protected padding = { left: 0, top: 0, right: 0, bottom: 0 }
  protected cachedScrollLeft: number | null
  protected cachedScrollTop: number | null
  protected cachedCenterPoint: PointLike | null
  protected cachedClientSize: { width: number; height: number } | null
  protected delegatedHandlers: { [name: string]: (...args: any) => any }

  constructor(options: Options) {
      throw new Error("STUB");
  }

  protected startListening() {
    const graph = this.graph
    const model = this.model

    graph.on('scale', this.onScale, this)
    graph.on('resize', this.onResize, this)
    graph.on('before:print', this.storeScrollPosition, this)
    graph.on('before:export', this.storeScrollPosition, this)
    graph.on('after:print', this.restoreScrollPosition, this)
    graph.on('after:export', this.restoreScrollPosition, this)

    model.on('reseted', this.onUpdate, this)
    model.on('cell:added', this.onUpdate, this)
    model.on('cell:removed', this.onUpdate, this)
    model.on('cell:changed', this.onUpdate, this)

    this.delegateBackgroundEvents()
  }

  protected stopListening() {
    const graph = this.graph
    const model = this.model

    graph.off('scale', this.onScale, this)
    graph.off('resize', this.onResize, this)
    graph.off('beforeprint', this.storeScrollPosition, this)
    graph.off('beforeexport', this.storeScrollPosition, this)
    graph.off('afterprint', this.restoreScrollPosition, this)
    graph.off('afterexport', this.restoreScrollPosition, this)

    model.off('reseted', this.onUpdate, this)
    model.off('cell:added', this.onUpdate, this)
    model.off('cell:removed', this.onUpdate, this)
    model.off('cell:changed', this.onUpdate, this)

    this.undelegateBackgroundEvents()
  }

  public enableAutoResize() {
      throw new Error("STUB");
  }

  public disableAutoResize() {
      throw new Error("STUB");
  }

  protected onUpdate() {
      throw new Error("STUB");
  }

  protected delegateBackgroundEvents(events?: ViewEvents) {
    const evts = events || GraphView.events
    this.delegatedHandlers = Object.keys(evts).reduce<{
      [name: string]: (...args: any) => any
    }>((memo, name) => {
        throw new Error("STUB");
    }, {})

    this.onBackgroundEvent = this.onBackgroundEvent.bind(this)
    Object.keys(this.delegatedHandlers).forEach((name) => {
        throw new Error("STUB");
    })
  }

  protected undelegateBackgroundEvents() {
    Object.keys(this.delegatedHandlers).forEach((name) => {
        throw new Error("STUB");
    })
  }

  protected onBackgroundEvent(e: Dom.EventObject) {
      throw new Error("STUB");
  }

  protected onResize() {
      throw new Error("STUB");
  }

  protected onScale({ sx, sy, ox, oy }: TEventArgs['scale']) {
      throw new Error("STUB");
  }

  protected storeScrollPosition() {
      throw new Error("STUB");
  }

  protected restoreScrollPosition() {
      throw new Error("STUB");
  }

  protected storeClientSize() {
    this.cachedClientSize = {
      width: this.container.clientWidth,
      height: this.container.clientHeight,
    }
  }

  protected restoreClientSize() {
    this.cachedClientSize = null
  }

  protected beforeManipulation() {
    if (IS_IE || IS_EDGE) {
      Dom.css(this.container, { visibility: 'hidden' })
    }
  }

  protected afterManipulation() {
    if (IS_IE || IS_EDGE) {
      Dom.css(this.container, { visibility: 'visible' })
    }
  }

  public updatePageSize(width?: number, height?: number) {
      throw new Error("STUB");
  }

  protected updatePageBreak() {
      throw new Error("STUB");
  }

  update() {
    const size = this.getClientSize()
    this.cachedCenterPoint = this.clientToLocalPoint(
      size.width / 2,
      size.height / 2,
    )

    let resizeOptions = this.options.autoResizeOptions
    if (typeof resizeOptions === 'function') {
      resizeOptions = FunctionExt.call(resizeOptions, this, this)
    }

    const options: FitToContentFullOptions = {
      gridWidth: this.options.pageWidth,
      gridHeight: this.options.pageHeight,
      allowNewOrigin: 'negative',
      ...resizeOptions,
    }

    this.graph.fitToContent(this.getFitToContentOptions(options))
  }

  protected getFitToContentOptions(options: FitToContentFullOptions) {
    const sx = this.sx
    const sy = this.sy

    options.gridWidth && (options.gridWidth *= sx)
    options.gridHeight && (options.gridHeight *= sy)
    options.minWidth && (options.minWidth *= sx)
    options.minHeight && (options.minHeight *= sy)

    if (typeof options.padding === 'object') {
      options.padding = {
        left: (options.padding.left || 0) * sx,
        right: (options.padding.right || 0) * sx,
        top: (options.padding.top || 0) * sy,
        bottom: (options.padding.bottom || 0) * sy,
      }
    } else if (typeof options.padding === 'number') {
      options.padding *= sx
    }

    if (!this.options.autoResize) {
      options.contentArea = Rectangle.create()
    }

    return options
  }

  protected updateScale(sx: number, sy: number) {
      throw new Error("STUB");
  }

  scrollbarPosition(): { left: number; top: number }
  scrollbarPosition(left?: number, top?: number): this
  scrollbarPosition(left?: number, top?: number) {
    if (left == null && top == null) {
      return {
        left: this.container.scrollLeft,
        top: this.container.scrollTop,
      }
    }

    const prop: { [key: string]: number } = {}
    if (typeof left === 'number') {
      prop.scrollLeft = left
    }

    if (typeof top === 'number') {
      prop.scrollTop = top
    }

    Dom.prop(this.container, prop)

    return this
  }

  /**
   * Try to scroll to ensure that the position (x,y) on the graph (in local
   * coordinates) is at the center of the viewport. If only one of the
   * coordinates is specified, only scroll in the specified dimension and
   * keep the other coordinate unchanged.
   */
  scrollToPoint(x: number | null | undefined, y: number | null | undefined) {
    const size = this.getClientSize()
    const ctm = this.graph.matrix()
    const prop: { [key: string]: number } = {}

    if (typeof x === 'number') {
      prop.scrollLeft = x - size.width / 2 + ctm.e + (this.padding.left || 0)
    }

    if (typeof y === 'number') {
      prop.scrollTop = y - size.height / 2 + ctm.f + (this.padding.top || 0)
    }

    Dom.prop(this.container, prop)

    return this
  }

  /**
   * Try to scroll to ensure that the center of graph content is at the
   * center of the viewport.
   */
  scrollToContent() {
      throw new Error("STUB");
  }

  /**
   * Try to scroll to ensure that the center of cell is at the center of
   * the viewport.
   */
  scrollToCell(cell: Cell) {
      throw new Error("STUB");
  }

  /**
   * The center methods are more aggressive than the scroll methods. These
   * methods position the graph so that a specific point on the graph lies
   * at the center of the viewport, adding paddings around the paper if
   * necessary (e.g. if the requested point lies in a corner of the paper).
   * This means that the requested point will always move into the center
   * of the viewport. (Use the scroll functions to avoid adding paddings
   * and only scroll the viewport as far as the graph boundary.)
   */

  /**
   * Position the center of graph to the center of the viewport.
   */
  center(optons?: CenterOptions) {
    return this.centerPoint(optons)
  }

  /**
   * Position the point (x,y) on the graph (in local coordinates) to the
   * center of the viewport. If only one of the coordinates is specified,
   * only center along the specified dimension and keep the other coordinate
   * unchanged.
   */
  centerPoint(x: number, y: null | number, options?: CenterOptions): this
  centerPoint(x: null | number, y: number, options?: CenterOptions): this
  centerPoint(optons?: CenterOptions): this
  centerPoint(
    x?: number | null | CenterOptions,
    y?: number | null,
    options?: CenterOptions,
  ) {
    const ctm = this.graph.matrix()
    const sx = ctm.a
    const sy = ctm.d
    const tx = -ctm.e
    const ty = -ctm.f
    const tWidth = tx + this.graph.options.width
    const tHeight = ty + this.graph.options.height

    let localOptions: CenterOptions | null | undefined

    this.storeClientSize() // avoid multilple reflow

    if (typeof x === 'number' || typeof y === 'number') {
      localOptions = options
      const visibleCenter = this.getVisibleArea().getCenter()
      if (typeof x === 'number') {
        x *= sx // eslint-disable-line
      } else {
        x = visibleCenter.x // eslint-disable-line
      }

      if (typeof y === 'number') {
        y *= sy // eslint-disable-line
      } else {
        y = visibleCenter.y // eslint-disable-line
      }
    } else {
      localOptions = x
      x = (tx + tWidth) / 2 // eslint-disable-line
      y = (ty + tHeight) / 2 // eslint-disable-line
    }

    if (localOptions && localOptions.padding) {
      return this.positionPoint({ x, y }, '50%', '50%', localOptions)
    }

    const padding = this.getPadding()
    const clientSize = this.getClientSize()
    const cx = clientSize.width / 2
    const cy = clientSize.height / 2
    const left = cx - padding.left - x + tx
    const right = cx - padding.right + x - tWidth
    const top = cy - padding.top - y + ty
    const bottom = cy - padding.bottom + y - tHeight

    this.addPadding(
      Math.max(left, 0),
      Math.max(right, 0),
      Math.max(top, 0),
      Math.max(bottom, 0),
    )

    const result = this.scrollToPoint(x, y)

    this.restoreClientSize()

    return result
  }

  centerContent(options?: PositionContentOptions) {
    return this.positionContent('center', options)
  }

  centerCell(cell: Cell, options?: CenterOptions) {
    return this.positionCell(cell, 'center', options)
  }

  /**
   * The position methods are a more general version of the center methods.
   * They position the graph so that a specific point on the graph lies at
   * requested coordinates inside the viewport.
   */

  /**
   *
   */
  positionContent(pos: Direction, options?: PositionContentOptions) {
    const rect = this.graph.getContentArea(options)
    return this.positionRect(rect, pos, options)
  }

  positionCell(cell: Cell, pos: Direction, options?: CenterOptions) {
    const bbox = cell.getBBox()
    return this.positionRect(bbox, pos, options)
  }

  positionRect(rect: RectangleLike, pos: Direction, options?: CenterOptions) {
    const bbox = Rectangle.create(rect)
    switch (pos) {
      case 'center':
        return this.positionPoint(bbox.getCenter(), '50%', '50%', options)
      case 'top':
        return this.positionPoint(bbox.getTopCenter(), '50%', 0, options)
      case 'top-right':
        return this.positionPoint(bbox.getTopRight(), '100%', 0, options)
      case 'right':
        return this.positionPoint(bbox.getRightMiddle(), '100%', '50%', options)
      case 'bottom-right':
        return this.positionPoint(
          bbox.getBottomRight(),
          '100%',
          '100%',
          options,
        )
      case 'bottom':
        return this.positionPoint(
          bbox.getBottomCenter(),
          '50%',
          '100%',
          options,
        )
      case 'bottom-left':
        return this.positionPoint(bbox.getBottomLeft(), 0, '100%', options)
      case 'left':
        return this.positionPoint(bbox.getLeftMiddle(), 0, '50%', options)
      case 'top-left':
        return this.positionPoint(bbox.getTopLeft(), 0, 0, options)
      default:
        return this
    }
  }

  positionPoint(
    point: PointLike,
    x: number | string,
    y: number | string,
    options: CenterOptions = {},
  ) {
    const { padding: pad, ...localOptions } = options
    const padding = NumberExt.normalizeSides(pad)
    const clientRect = Rectangle.fromSize(this.getClientSize())
    const targetRect = clientRect.clone().moveAndExpand({
      x: padding.left,
      y: padding.top,
      width: -padding.right - padding.left,
      height: -padding.top - padding.bottom,
    })

    // eslint-disable-next-line
    x = NumberExt.normalizePercentage(x, Math.max(0, targetRect.width))
    if (x < 0) {
      x = targetRect.width + x // eslint-disable-line
    }

    // eslint-disable-next-line
    y = NumberExt.normalizePercentage(y, Math.max(0, targetRect.height))
    if (y < 0) {
      y = targetRect.height + y // eslint-disable-line
    }

    const origin = targetRect.getTopLeft().translate(x, y)
    const diff = clientRect.getCenter().diff(origin)
    const scale = this.zoom()
    const rawDiff = diff.scale(1 / scale, 1 / scale)
    const result = Point.create(point).translate(rawDiff)
    return this.centerPoint(result.x, result.y, localOptions)
  }

  zoom(): number
  zoom(factor: number, options?: ZoomOptions): this
  zoom(factor?: number, options?: ZoomOptions) {
    if (factor == null) {
      return this.sx
    }

    options = options || {} // eslint-disable-line

    let cx
    let cy
    const clientSize = this.getClientSize()
    const center = this.clientToLocalPoint(
      clientSize.width / 2,
      clientSize.height / 2,
    )

    let sx = factor
    let sy = factor

    if (!options.absolute) {
      sx += this.sx
      sy += this.sy
    }

    if (options.scaleGrid) {
      sx = Math.round(sx / options.scaleGrid) * options.scaleGrid
      sy = Math.round(sy / options.scaleGrid) * options.scaleGrid
    }

    if (options.maxScale) {
      sx = Math.min(options.maxScale, sx)
      sy = Math.min(options.maxScale, sy)
    }

    if (options.minScale) {
      sx = Math.max(options.minScale, sx)
      sy = Math.max(options.minScale, sy)
    }

    sx = this.graph.transform.clampScale(sx)
    sy = this.graph.transform.clampScale(sy)

    if (options.center) {
      const fx = sx / this.sx
      const fy = sy / this.sy
      cx = options.center.x - (options.center.x - center.x) / fx
      cy = options.center.y - (options.center.y - center.y) / fy
    } else {
      cx = center.x
      cy = center.y
    }

    this.beforeManipulation()
    this.graph.transform.scale(sx, sy, cx, cy, false)
    this.centerPoint(cx, cy)
    this.afterManipulation()

    return this
  }

  zoomToRect(rect: RectangleLike, options: ScaleContentToFitOptions = {}) {
    const area = Rectangle.create(rect)
    const graph = this.graph

    options.contentArea = area
    if (options.viewportArea == null) {
      const bound = this.container.getBoundingClientRect()
      options.viewportArea = {
        x: graph.options.x,
        y: graph.options.y,
        width: bound.width,
        height: bound.height,
      }
    }

    this.beforeManipulation()
    graph.transform.scaleContentToFitImpl(options, false)
    const center = area.getCenter()
    this.centerPoint(center.x, center.y)
    this.afterManipulation()

    return this
  }

  zoomToFit(options: GetContentAreaOptions & ScaleContentToFitOptions = {}) {
    return this.zoomToRect(this.graph.getContentArea(options), options)
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

  protected syncTransition(scale: number, p: PointLike) {
      throw new Error("STUB");
  }

  protected removeTransition() {
      throw new Error("STUB");
  }

  transitionToRect(
    rectangle: RectangleLike,
    options: TransitionToRectOptions = {},
  ) {
      throw new Error("STUB");
  }

  startPanning(evt: Dom.MouseDownEvent) {
    const e = this.normalizeEvent(evt)
    this.clientX = e.clientX
    this.clientY = e.clientY
    this.trigger('pan:start', { e })
    Dom.Event.on(document.body, {
      'mousemove.panning touchmove.panning': this.pan.bind(this),
      'mouseup.panning touchend.panning': this.stopPanning.bind(this),
      'mouseleave.panning': this.stopPanning.bind(this),
    })
    Dom.Event.on(window as any, 'mouseup.panning', this.stopPanning.bind(this))
  }

  pan(evt: Dom.MouseMoveEvent) {
      throw new Error("STUB");
  }

  stopPanning(e: Dom.MouseUpEvent) {
      throw new Error("STUB");
  }

  clientToLocalPoint(p: PointLike): Point
  clientToLocalPoint(x: number, y: number): Point
  clientToLocalPoint(a: number | PointLike, b?: number) {
    let x = typeof a === 'object' ? a.x : a
    let y = typeof a === 'object' ? a.y : (b as number)

    const ctm = this.graph.matrix()

    x += this.container.scrollLeft - this.padding.left - ctm.e
    y += this.container.scrollTop - this.padding.top - ctm.f

    return new Point(x / ctm.a, y / ctm.d)
  }

  localToBackgroundPoint(p: PointLike): Point
  localToBackgroundPoint(x: number, y: number): Point
  localToBackgroundPoint(x: number | PointLike, y?: number) {
      throw new Error("STUB");
  }

  resize(width?: number, height?: number) {
    let w = width != null ? width : this.container.offsetWidth
    let h = height != null ? height : this.container.offsetHeight

    if (typeof w === 'number') {
      w = Math.round(w)
    }
    if (typeof h === 'number') {
      h = Math.round(h)
    }

    this.options.width = w
    this.options.height = h
    Dom.css(this.container, { width: w, height: h })
    this.update()
  }

  getClientSize() {
    if (this.cachedClientSize) {
      return this.cachedClientSize
    }
    return {
      width: this.container.clientWidth,
      height: this.container.clientHeight,
    }
  }

  autoScroll(clientX: number, clientY: number) {
    const buffer = 10
    const container = this.container
    const rect = container.getBoundingClientRect()

    let dx = 0
    let dy = 0
    if (clientX <= rect.left + buffer) {
      dx = -buffer
    }

    if (clientY <= rect.top + buffer) {
      dy = -buffer
    }

    if (clientX >= rect.right - buffer) {
      dx = buffer
    }

    if (clientY >= rect.bottom - buffer) {
      dy = buffer
    }

    if (dx !== 0) {
      container.scrollLeft += dx
    }

    if (dy !== 0) {
      container.scrollTop += dy
    }

    return {
      scrollerX: dx,
      scrollerY: dy,
    }
  }

  protected addPadding(
    left?: number,
    right?: number,
    top?: number,
    bottom?: number,
  ) {
    let padding = this.getPadding()
    this.padding = {
      left: Math.round(padding.left + (left || 0)),
      top: Math.round(padding.top + (top || 0)),
      bottom: Math.round(padding.bottom + (bottom || 0)),
      right: Math.round(padding.right + (right || 0)),
    }

    padding = this.padding

    Dom.css(this.content, {
      width: padding.left + this.graph.options.width + padding.right,
      height: padding.top + this.graph.options.height + padding.bottom,
    })

    const container = this.graph.container
    container.style.left = `${this.padding.left}px`
    container.style.top = `${this.padding.top}px`

    return this
  }

  protected getPadding() {
    const padding = this.options.padding
    if (typeof padding === 'function') {
      return NumberExt.normalizeSides(FunctionExt.call(padding, this, this))
    }

    return NumberExt.normalizeSides(padding)
  }

  /**
   * Returns the untransformed size and origin of the current viewport.
   */
  getVisibleArea() {
    const ctm = this.graph.matrix()
    const size = this.getClientSize()
    const box = {
      x: this.container.scrollLeft || 0,
      y: this.container.scrollTop || 0,
      width: size.width,
      height: size.height,
    }
    const area = Util.transformRectangle(box, ctm.inverse())
    area.x -= (this.padding.left || 0) / this.sx
    area.y -= (this.padding.top || 0) / this.sy
    return area
  }

  isCellVisible(cell: Cell, options: { strict?: boolean } = {}) {
      throw new Error("STUB");
  }

  isPointVisible(point: PointLike) {
      throw new Error("STUB");
  }

  /**
   * Lock the current viewport by disabling user scrolling.
   */
  lock() {
    Dom.css(this.container, { overflow: 'hidden' })
    return this
  }

  /**
   * Enable user scrolling if previously locked.
   */
  unlock() {
    Dom.css(this.container, { overflow: 'scroll' })
    return this
  }

  protected onRemove() {
    this.stopListening()
  }

  @disposable()
  dispose() {
    Dom.before(this.container, this.graph.container)
    this.remove()
  }
}

export class ScrollerImplBackground extends BackgroundManager {
  protected readonly scroller: ScrollerImpl

  protected get elem() {
      throw new Error("STUB");
  }

  constructor(scroller: ScrollerImpl) {
      throw new Error("STUB");
  }

  protected init() {
    this.graph.on('scale', this.update, this)
    this.graph.on('translate', this.update, this)
  }

  protected updateBackgroundOptions(options?: BackgroundManagerOptions) {
    this.scroller.options.background = options
  }
}
