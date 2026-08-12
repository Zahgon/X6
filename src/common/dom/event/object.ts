import { returnFalse, returnTrue } from './util'
import type { HandlerObject } from './store'
import { EventRaw } from './alias'

export interface EventObjectEvent {
  // Event

  bubbles: boolean | undefined
  cancelable: boolean | undefined
  eventPhase: number | undefined

  // UIEvent

  detail: number | undefined
  view: Window | undefined

  // MouseEvent

  button: number | undefined
  buttons: number | undefined
  clientX: number | undefined
  clientY: number | undefined
  offsetX: number | undefined
  offsetY: number | undefined
  pageX: number | undefined
  pageY: number | undefined
  screenX: number | undefined
  screenY: number | undefined
  /** @deprecated */
  toElement: Element | undefined

  // PointerEvent

  pointerId: number | undefined
  pointerType: string | undefined

  // KeyboardEvent

  /** @deprecated */
  char: string | undefined
  /** @deprecated */
  charCode: number | undefined
  key: string | undefined
  /** @deprecated */
  keyCode: number | undefined

  // TouchEvent

  touches: TouchList | undefined
  targetTouches: TouchList | undefined
  changedTouches: TouchList | undefined

  // MouseEvent, KeyboardEvent

  which: number | undefined

  // MouseEvent, KeyboardEvent, TouchEvent

  altKey: boolean | undefined
  ctrlKey: boolean | undefined
  metaKey: boolean | undefined
  shiftKey: boolean | undefined

  type: string
  timeStamp: number

  isDefaultPrevented(): boolean
  isImmediatePropagationStopped(): boolean
  isPropagationStopped(): boolean
  preventDefault(): void
  stopImmediatePropagation(): void
  stopPropagation(): void
}

export interface EventObject extends EventObjectEvent {}
export class EventObject<
  TDelegateTarget = any,
  TData = any,
  TCurrentTarget = any,
  TTarget = any,
  TEvent extends Event = Event,
> implements EventObjectEvent
{
  static create(originalEvent: EventRaw | EventObject | string) {
    return originalEvent instanceof EventObject
      ? originalEvent
      : new EventObject(originalEvent)
  }
  static addProperty(name: string, hook?: any | ((e: EventRaw) => any)) {
    Object.defineProperty(EventObject.prototype, name, {
      enumerable: true,
      configurable: true,
      get:
        typeof hook === 'function'
          ? // eslint-disable-next-line
            function (this: EventObject) {
                throw new Error("STUB");
            }
          : // eslint-disable-next-line
            function (this: EventObject) {
                throw new Error("STUB");
            },
      set(value) {
        Object.defineProperty(this, name, {
          enumerable: true,
          configurable: true,
          writable: true,
          value,
        })
      },
    })
  }
  isDefaultPrevented: () => boolean = returnFalse
  isPropagationStopped: () => boolean = returnFalse
  isImmediatePropagationStopped: () => boolean = returnFalse

  type: string
  originalEvent: TEvent

  target: TTarget | null
  currentTarget: TCurrentTarget | null
  delegateTarget: TDelegateTarget | null
  relatedTarget?: EventTarget | null

  data: TData
  result: any

  timeStamp: number
  handleObj: HandlerObject
  namespace?: string
  rnamespace?: RegExp | null
  isSimulated = false

  constructor(e: TEvent | string, props?: Record<string, any> | null) {
      throw new Error("STUB");
  }

  preventDefault = () => {
    const e = this.originalEvent

    this.isDefaultPrevented = returnTrue

    if (e && !this.isSimulated) {
      e.preventDefault()
    }
  }

  stopPropagation = () => {
    const e = this.originalEvent

    this.isPropagationStopped = returnTrue

    if (e && !this.isSimulated) {
      e.stopPropagation()
    }
  }

  stopImmediatePropagation = () => {
      throw new Error("STUB");
  }
}

// Common event props including KeyEvent and MouseEvent specific props.
const commonProps = {
  bubbles: true,
  cancelable: true,
  eventPhase: true,

  detail: true,
  view: true,

  button: true,
  buttons: true,
  clientX: true,
  clientY: true,
  offsetX: true,
  offsetY: true,
  pageX: true,
  pageY: true,
  screenX: true,
  screenY: true,
  toElement: true,

  pointerId: true,
  pointerType: true,

  char: true,
  code: true,
  charCode: true,
  key: true,
  keyCode: true,

  touches: true,
  changedTouches: true,
  targetTouches: true,

  which: true,
  altKey: true,
  ctrlKey: true,
  metaKey: true,
  shiftKey: true,
}

Object.keys(commonProps).forEach((name: keyof typeof commonProps) =>
  { throw new Error("STUB"); },
)
