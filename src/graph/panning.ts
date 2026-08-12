import type { ModifierKey } from '../common'
import { Dom, disposable, isModifierKeyMatch } from '../common'
import { Base } from './base'

type EventType =
  | 'leftMouseDown'
  | 'rightMouseDown'
  | 'mouseWheel'
  | 'mouseWheelDown'
export interface PanningOptions {
  enabled?: boolean
  modifiers?: string | ModifierKey[] | null
  eventTypes?: EventType[]
}

export class PanningManager extends Base {
  private panning: boolean
  private clientX: number
  private clientY: number
  private mousewheelHandle: Dom.MouseWheelHandle
  private isSpaceKeyPressed: boolean

  protected get widgetOptions() {
      throw new Error("STUB");
  }

  get pannable() {
      throw new Error("STUB");
  }

  protected init() {
    this.onRightMouseDown = this.onRightMouseDown.bind(this)
    this.onKeyDown = this.onKeyDown.bind(this)
    this.onKeyUp = this.onKeyUp.bind(this)
    this.startListening()
    this.updateClassName()
  }

  protected startListening() {
    this.graph.on('blank:mousedown', this.onMouseDown, this)
    this.graph.on('node:unhandled:mousedown', this.onMouseDown, this)
    this.graph.on('edge:unhandled:mousedown', this.onMouseDown, this)
    Dom.Event.on(this.graph.container, 'mousedown', this.onRightMouseDown)
    Dom.Event.on(document.body, {
      keydown: this.onKeyDown,
      keyup: this.onKeyUp,
    })
    this.mousewheelHandle = new Dom.MouseWheelHandle(
      this.graph.container,
      this.onMouseWheel.bind(this),
      this.allowMouseWheel.bind(this),
    )
    this.mousewheelHandle.enable()
  }

  protected stopListening() {
    this.graph.off('blank:mousedown', this.onMouseDown, this)
    this.graph.off('node:unhandled:mousedown', this.onMouseDown, this)
    this.graph.off('edge:unhandled:mousedown', this.onMouseDown, this)
    Dom.Event.off(this.graph.container, 'mousedown', this.onRightMouseDown)
    Dom.Event.off(document.body, {
      keydown: this.onKeyDown,
      keyup: this.onKeyUp,
    })
    if (this.mousewheelHandle) {
      this.mousewheelHandle.disable()
    }
  }

  allowPanning(e: Dom.EventObject, strict?: boolean) {
    ;(e as any).spaceKey = this.isSpaceKeyPressed
    return (
      this.pannable &&
      isModifierKeyMatch(e, this.widgetOptions.modifiers, strict)
    )
  }

  protected startPanning(evt: Dom.MouseDownEvent) {
    const e = this.view.normalizeEvent(evt)
    this.clientX = e.clientX
    this.clientY = e.clientY
    this.panning = true
    this.updateClassName(evt)
    Dom.Event.on(document.body, {
      'mousemove.panning touchmove.panning': this.pan.bind(this),
      'mouseup.panning touchend.panning': this.stopPanning.bind(this),
      'mouseleave.panning': this.stopPanning.bind(this),
    })
    Dom.Event.on(window as any, 'mouseup.panning', this.stopPanning.bind(this))
  }

  protected pan(evt: Dom.MouseMoveEvent) {
      throw new Error("STUB");
  }

  // eslint-disable-next-line
  protected stopPanning(e: Dom.MouseUpEvent) {
      throw new Error("STUB");
  }

  protected updateClassName(e?: Dom.EventObject) {
    const eventTypes = this.widgetOptions.eventTypes
    if (eventTypes?.length === 1 && eventTypes.includes('mouseWheel')) {
      return
    }
    const container = this.view.container
    const panning = this.view.prefixClassName('graph-panning')
    const pannable = this.view.prefixClassName('graph-pannable')
    const selection = this.graph.getPlugin<any>('selection')
    const allowRubberband = selection && selection.allowRubberband(e, true)
    const allowRightMouseRubberband =
      eventTypes?.includes('leftMouseDown') && !allowRubberband
    if (
      this.allowPanning(e ?? ({} as Dom.EventObject), true) ||
      (this.allowPanning(e ?? ({} as Dom.EventObject)) &&
        allowRightMouseRubberband)
    ) {
      if (this.panning) {
        Dom.addClass(container, panning)
        Dom.removeClass(container, pannable)
      } else {
        Dom.removeClass(container, panning)
        Dom.addClass(container, pannable)
      }
    } else if (!this.panning) {
      Dom.removeClass(container, panning)
      Dom.removeClass(container, pannable)
    }
  }

  protected onMouseDown({ e }: { e: Dom.MouseDownEvent }) {
    if (!this.allowBlankMouseDown(e)) {
      return
    }

    const selection = this.graph.getPlugin<any>('selection')
    const allowRubberband = selection && selection.allowRubberband(e, true)
    if (
      this.allowPanning(e, true) ||
      (this.allowPanning(e) && !allowRubberband)
    ) {
      this.startPanning(e)
    }
  }

  protected onRightMouseDown(e: Dom.MouseDownEvent) {
      throw new Error("STUB");
  }

  protected onMouseWheel(e: WheelEvent, deltaX: number, deltaY: number) {
      throw new Error("STUB");
  }

  protected onKeyDown(e: Dom.KeyDownEvent) {
      throw new Error("STUB");
  }

  protected onKeyUp(e: Dom.KeyUpEvent) {
      throw new Error("STUB");
  }

  protected allowBlankMouseDown(e: Dom.MouseDownEvent) {
    const eventTypes = this.widgetOptions.eventTypes
 
    const isTouchEvent = (typeof e.type === 'string' && e.type.startsWith('touch')) || e.pointerType === 'touch'
    if (isTouchEvent) return eventTypes?.includes('leftMouseDown')

    return (
      (eventTypes?.includes('leftMouseDown') && e.button === 0) ||
      (eventTypes?.includes('mouseWheelDown') && e.button === 1)
    )
  }

  protected allowMouseWheel(e: WheelEvent) {
      throw new Error("STUB");
  }

  autoPanning(x: number, y: number) {
      throw new Error("STUB");
  }

  enablePanning() {
      throw new Error("STUB");
  }

  disablePanning() {
    if (this.pannable) {
      this.widgetOptions.enabled = false
      this.updateClassName()
    }
  }

  @disposable()
  dispose() {
    this.stopListening()
  }
}
