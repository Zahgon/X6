import { Dom, disposable, FunctionExt } from '../common'
import { Config } from '../config'
import type { Graph } from '../graph'
import { Cell } from '../model'
import type { CellView } from '../view'
import { Markup, View } from '../view'
import type { MarkupJSONMarkup } from '../view/markup'

interface Moving {
  mouseMovedCount?: number
  startPosition?: { x: number; y: number }
  currentView?: CellView | null
}

const prefixCls = `${Config.prefixCls}-graph`
export class GraphView extends View {
  static markup: MarkupJSONMarkup[] = [
    {
      ns: Dom.ns.xhtml,
      tagName: 'div',
      selector: 'background',
      className: `${prefixCls}-background`,
    },
    {
      ns: Dom.ns.xhtml,
      tagName: 'div',
      selector: 'grid',
      className: `${prefixCls}-grid`,
    },
    {
      ns: Dom.ns.svg,
      tagName: 'svg',
      selector: 'svg',
      className: `${prefixCls}-svg`,
      attrs: {
        width: '100%',
        height: '100%',
        'xmlns:xlink': Dom.ns.xlink,
      },
      children: [
        {
          tagName: 'defs',
          selector: 'defs',
        },
        {
          tagName: 'g',
          selector: 'viewport',
          className: `${prefixCls}-svg-viewport`,
          children: [
            {
              tagName: 'g',
              selector: 'primer',
              className: `${prefixCls}-svg-primer`,
            },
            {
              tagName: 'g',
              selector: 'stage',
              className: `${prefixCls}-svg-stage`,
            },
            {
              tagName: 'g',
              selector: 'decorator',
              className: `${prefixCls}-svg-decorator`,
            },
            {
              tagName: 'g',
              selector: 'overlay',
              className: `${prefixCls}-svg-overlay`,
            },
          ],
        },
      ],
    },
  ]

  static snapshoot(elem: Element) {
      throw new Error("STUB");
  }
  static events = {
    dblclick: 'onDblClick',
    contextmenu: 'onContextMenu',
    touchstart: 'onMouseDown',
    mousedown: 'onMouseDown',
    mouseover: 'onMouseOver',
    mouseout: 'onMouseOut',
    mouseenter: 'onMouseEnter',
    mouseleave: 'onMouseLeave',
    mousewheel: 'onMouseWheel',
    DOMMouseScroll: 'onMouseWheel',
    [`mouseenter  .${Config.prefixCls}-cell`]: 'onMouseEnter',
    [`mouseleave  .${Config.prefixCls}-cell`]: 'onMouseLeave',
    [`mouseenter  .${Config.prefixCls}-cell-tools`]: 'onMouseEnter',
    [`mouseleave  .${Config.prefixCls}-cell-tools`]: 'onMouseLeave',
    [`mousedown   .${Config.prefixCls}-cell [event]`]: 'onCustomEvent',
    [`touchstart  .${Config.prefixCls}-cell [event]`]: 'onCustomEvent',
    [`mousedown   .${Config.prefixCls}-cell [data-event]`]: 'onCustomEvent',
    [`touchstart  .${Config.prefixCls}-cell [data-event]`]: 'onCustomEvent',
    [`dblclick    .${Config.prefixCls}-cell [magnet]`]: 'onMagnetDblClick',
    [`contextmenu .${Config.prefixCls}-cell [magnet]`]: 'onMagnetContextMenu',
    [`mousedown   .${Config.prefixCls}-cell [magnet]`]: 'onMagnetMouseDown',
    [`touchstart  .${Config.prefixCls}-cell [magnet]`]: 'onMagnetMouseDown',
    [`dblclick    .${Config.prefixCls}-cell [data-magnet]`]: 'onMagnetDblClick',
    [`contextmenu .${Config.prefixCls}-cell [data-magnet]`]:
      'onMagnetContextMenu',
    [`mousedown   .${Config.prefixCls}-cell [data-magnet]`]:
      'onMagnetMouseDown',
    [`touchstart  .${Config.prefixCls}-cell [data-magnet]`]:
      'onMagnetMouseDown',
    [`dragstart   .${Config.prefixCls}-cell image`]: 'onImageDragStart',
    [`mousedown   .${Config.prefixCls}-edge .${Config.prefixCls}-edge-label`]:
      'onLabelMouseDown',
    [`touchstart  .${Config.prefixCls}-edge .${Config.prefixCls}-edge-label`]:
      'onLabelMouseDown',
  }
  static documentEvents = {
    mousemove: 'onMouseMove',
    touchmove: 'onMouseMove',
    mouseup: 'onMouseUp',
    touchend: 'onMouseUp',
    touchcancel: 'onMouseUp',
  }

  public readonly container: HTMLElement
  public readonly background: HTMLDivElement
  public readonly grid: HTMLDivElement
  public readonly svg: SVGSVGElement
  public readonly defs: SVGDefsElement
  public readonly viewport: SVGGElement
  public readonly primer: SVGGElement
  public readonly stage: SVGGElement
  public readonly decorator: SVGGElement
  public readonly overlay: SVGGElement

  private restore: () => void

  /** Graph's `this.container` is from outer, should not dispose */
  protected get disposeContainer(): boolean {
      throw new Error("STUB");
  }

  protected get options() {
      throw new Error("STUB");
  }

  constructor(protected readonly graph: Graph) {
      throw new Error("STUB");
  }

  delegateEvents() {
    const ctor = this.constructor as typeof GraphView
    super.delegateEvents(ctor.events)
    return this
  }

  /**
   * Guard the specified event. If the event is not interesting, it
   * returns `true`, otherwise returns `false`.
   */
  guard(e: Dom.EventObject, view?: CellView | null) {
    // handled as `contextmenu` type
    if (e.type === 'mousedown' && e.button === 2) {
      return true
    }

    if (this.options.guard && this.options.guard(e, view)) {
      return true
    }

    if (e.data && e.data.guarded !== undefined) {
      return e.data.guarded
    }

    if (view && view.cell && Cell.isCell(view.cell)) {
      return false
    }

    if (
      this.svg === e.target ||
      this.container === e.target ||
      this.svg.contains(e.target)
    ) {
      return false
    }

    return true
  }

  protected findView(elem: Element) {
    return this.graph.findViewByElem(elem)
  }

  protected onDblClick(evt: Dom.DoubleClickEvent) {
      throw new Error("STUB");
  }

  protected onClick(evt: Dom.ClickEvent) {
    if (this.getMouseMovedCount(evt) <= this.options.clickThreshold) {
      const e = this.normalizeEvent(evt)
      const view = this.findView(e.target)
      if (this.guard(e, view)) {
        return
      }

      const localPoint = this.graph.snapToGrid(e.clientX, e.clientY)
      if (view) {
        view.onClick(e, localPoint.x, localPoint.y)
      } else {
        this.graph.trigger('blank:click', {
          e,
          x: localPoint.x,
          y: localPoint.y,
        })
      }
    }
  }

  protected isPreventDefaultContextMenu(view: CellView | null) {
      throw new Error("STUB");
  }

  protected onContextMenu(evt: Dom.ContextMenuEvent) {
      throw new Error("STUB");
  }

  delegateDragEvents(e: Dom.MouseDownEvent, view: CellView | null) {
    if (e.data == null) {
      e.data = {}
    }
    this.setEventData<Moving>(e, {
      currentView: view || null,
      mouseMovedCount: 0,
      startPosition: {
        x: e.clientX,
        y: e.clientY,
      },
    })
    const ctor = this.constructor as typeof GraphView
    this.delegateDocumentEvents(ctor.documentEvents, e.data)
    this.undelegateEvents()
  }

  getMouseMovedCount(e: Dom.EventObject) {
    const data = this.getEventData<Moving>(e)
    return data.mouseMovedCount || 0
  }

  protected onMouseDown(evt: Dom.MouseDownEvent) {
    const e = this.normalizeEvent(evt)
    const view = this.findView(e.target)
    if (this.guard(e, view)) {
      return
    }

    if (this.options.preventDefaultMouseDown) {
      evt.preventDefault()
    }

    const localPoint = this.graph.snapToGrid(e.clientX, e.clientY)

    if (view) {
      view.onMouseDown(e, localPoint.x, localPoint.y)
    } else {
      if (
        this.options.preventDefaultBlankAction &&
        ['touchstart'].includes(e.type)
      ) {
        evt.preventDefault()
      }

      this.graph.trigger('blank:mousedown', {
        e,
        x: localPoint.x,
        y: localPoint.y,
      })
    }

    this.delegateDragEvents(e, view)
  }

  protected onMouseMove(evt: Dom.MouseMoveEvent) {
    const data = this.getEventData<Moving>(evt)

    const startPosition = data.startPosition
    if (
      startPosition &&
      startPosition.x === evt.clientX &&
      startPosition.y === evt.clientY
    ) {
      return
    }

    if (data.mouseMovedCount == null) {
      data.mouseMovedCount = 0
    }
    data.mouseMovedCount += 1
    const mouseMovedCount = data.mouseMovedCount
    if (mouseMovedCount <= this.options.moveThreshold) {
      return
    }

    const e = this.normalizeEvent(evt)
    const localPoint = this.graph.snapToGrid(e.clientX, e.clientY)

    const view = data.currentView
    if (view) {
      view.onMouseMove(e, localPoint.x, localPoint.y)
    } else {
      this.graph.trigger('blank:mousemove', {
        e,
        x: localPoint.x,
        y: localPoint.y,
      })
    }

    this.setEventData(e, data)
  }

  protected onMouseUp(e: Dom.MouseUpEvent) {
    this.undelegateDocumentEvents()

    const normalized = this.normalizeEvent(e)
    const localPoint = this.graph.snapToGrid(
      normalized.clientX,
      normalized.clientY,
    )
    const data = this.getEventData<Moving>(e)
    const view = data.currentView
    if (view) {
      view.onMouseUp(normalized, localPoint.x, localPoint.y)
    } else {
      this.graph.trigger('blank:mouseup', {
        e: normalized,
        x: localPoint.x,
        y: localPoint.y,
      })
    }

    if (!e.isPropagationStopped()) {
      const ev = new Dom.EventObject(e as any, {
        type: 'click',
        data: e.data,
      }) as Dom.ClickEvent
      this.onClick(ev)
    }

    e.stopImmediatePropagation()

    this.delegateEvents()
  }

  protected onMouseOver(evt: Dom.MouseOverEvent) {
      throw new Error("STUB");
  }

  protected onMouseOut(evt: Dom.MouseOutEvent) {
      throw new Error("STUB");
  }

  protected onMouseEnter(evt: Dom.MouseEnterEvent) {
    const e = this.normalizeEvent(evt)
    const view = this.findView(e.target)
    if (this.guard(e, view)) {
      return
    }

    const relatedView = this.graph.findViewByElem(e.relatedTarget as Element)
    if (view) {
      if (relatedView === view) {
        // mouse moved from tool to view
        return
      }
      view.onMouseEnter(e)
    } else {
      if (relatedView) {
        return
      }
      this.graph.trigger('graph:mouseenter', { e })
    }
  }

  protected onMouseLeave(evt: Dom.MouseLeaveEvent) {
    const e = this.normalizeEvent(evt)
    const view = this.findView(e.target)
    if (this.guard(e, view)) {
      return
    }

    const relatedView = this.graph.findViewByElem(e.relatedTarget as Element)

    if (view) {
      if (relatedView === view) {
        // mouse moved from view to tool
        return
      }
      view.onMouseLeave(e)
    } else {
      if (relatedView) {
        return
      }
      this.graph.trigger('graph:mouseleave', { e })
    }
  }

  protected onMouseWheel(evt: Dom.EventObject) {
      throw new Error("STUB");
  }

  protected onCustomEvent(evt: Dom.MouseDownEvent) {
      throw new Error("STUB");
  }

  protected handleMagnetEvent<T extends Dom.EventObject>(
    evt: T,
    handler: (
      this: Graph,
      view: CellView,
      e: T,
      magnet: Element,
      x: number,
      y: number,
    ) => void,
  ) {
      throw new Error("STUB");
  }

  protected onMagnetMouseDown(e: Dom.MouseDownEvent) {
      throw new Error("STUB");
  }

  protected onMagnetDblClick(e: Dom.DoubleClickEvent) {
      throw new Error("STUB");
  }

  protected onMagnetContextMenu(e: Dom.ContextMenuEvent) {
      throw new Error("STUB");
  }

  protected onLabelMouseDown(evt: Dom.MouseDownEvent) {
      throw new Error("STUB");
  }

  protected onImageDragStart() {
      throw new Error("STUB");
  }

  @disposable()
  dispose() {
    this.undelegateEvents()
    this.undelegateDocumentEvents()
    this.restore()
    this.restore = () => {
        throw new Error("STUB");
    }
  }
}
