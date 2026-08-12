import { isEventSupported } from '../platform'
import type { OnWheelCallback, OnWheelGuard } from '../../types'
export class MouseWheelHandle {
  private target: HTMLElement | Document
  private onWheelCallback: OnWheelCallback
  private onWheelGuard?: OnWheelGuard
  private animationFrameId = 0
  private deltaX = 0
  private deltaY = 0
  private eventName = isEventSupported('wheel') ? 'wheel' : 'mousewheel'

  constructor(
    target: HTMLElement | Document,
    onWheelCallback: OnWheelCallback,
    onWheelGuard?: OnWheelGuard,
  ) {
    this.target = target
    this.onWheelCallback = onWheelCallback
    this.onWheelGuard = onWheelGuard
    this.onWheel = this.onWheel.bind(this)
    this.didWheel = this.didWheel.bind(this)
  }

  public enable() {
    this.target.addEventListener(this.eventName, this.onWheel, {
      passive: false,
    })
  }

  public disable() {
    this.target.removeEventListener(this.eventName, this.onWheel)
  }

  private onWheel(e: WheelEvent) {
      throw new Error("STUB");
  }

  private didWheel(e: WheelEvent) {
      throw new Error("STUB");
  }
}
