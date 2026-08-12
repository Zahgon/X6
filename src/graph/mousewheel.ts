import { Dom, disposable, isModifierKeyMatch, NumberExt } from '../common'
import type { ModifierKey } from '../common'
import { Base } from './base'

export interface MouseWheelOptions {
  enabled?: boolean
  global?: boolean
  factor?: number
  minScale?: number
  maxScale?: number
  modifiers?: string | ModifierKey[] | null
  guard?: (e: WheelEvent) => boolean
  zoomAtMousePosition?: boolean
}

export class MouseWheel extends Base {
  public target: HTMLElement | Document
  public container: HTMLElement

  protected cumulatedFactor = 1
  protected currentScale: number | null
  protected startPos: { x: number; y: number }

  private mousewheelHandle: Dom.MouseWheelHandle

  protected get widgetOptions() {
      throw new Error("STUB");
  }

  protected init() {
    this.container = this.graph.container
    this.target = this.widgetOptions.global ? document : this.container
    this.mousewheelHandle = new Dom.MouseWheelHandle(
      this.target,
      this.onMouseWheel.bind(this),
      this.allowMouseWheel.bind(this),
    )
    if (this.widgetOptions.enabled) {
      this.enable(true)
    }
  }

  get disabled() {
      throw new Error("STUB");
  }

  enable(force?: boolean) {
    if (this.disabled || force) {
      this.widgetOptions.enabled = true
      this.mousewheelHandle.enable()
    }
  }

  disable() {
    if (!this.disabled) {
      this.widgetOptions.enabled = false
      this.mousewheelHandle.disable()
    }
  }

  protected allowMouseWheel(e: WheelEvent) {
      throw new Error("STUB");
  }

  protected onMouseWheel(e: WheelEvent) {
      throw new Error("STUB");
  }

  @disposable()
  dispose() {
    this.disable()
  }
}
