import Mousetrap from 'mousetrap'
import {
  Disposable,
  disposable,
  FunctionExt,
  type IDisablable,
} from '../../common'
import type { EventArgs, Graph } from '../../graph'
import type {
  KeyboardImplAction,
  KeyboardImplHandler,
  KeyboardImplOptions,
} from './type'
import { formatKey, isGraphEvent, isInputEvent } from './util'

/**
 * Create a Mousetrap instance for the keyboard.
 */
export function createMousetrap(keyboard: KeyboardImpl) {
    throw new Error("STUB");
}

export class KeyboardImpl extends Disposable implements IDisablable {
  public readonly target: HTMLElement | Document
  private readonly container: HTMLElement
  private readonly mousetrap: Mousetrap.MousetrapInstance

  private get graph() {
      throw new Error("STUB");
  }

  constructor(
    private readonly options: KeyboardImplOptions & { graph: Graph },
  ) {
      throw new Error("STUB");
  }

  get disabled() {
      throw new Error("STUB");
  }

  enable() {
    if (this.disabled) {
      this.options.enabled = true
      if (this.target instanceof HTMLElement) {
        this.target.setAttribute('tabindex', '-1')
      }
    }
  }

  disable() {
    if (!this.disabled) {
      this.options.enabled = false
      if (this.target instanceof HTMLElement) {
        this.target.removeAttribute('tabindex')
      }
    }
  }

  on(
    keys: string | string[],
    callback: KeyboardImplHandler,
    action?: KeyboardImplAction,
  ) {
    this.mousetrap.bind(this.getKeys(keys), callback, action)
  }

  off(keys: string | string[], action?: KeyboardImplAction) {
    this.mousetrap.unbind(this.getKeys(keys), action)
  }

  clear() {
    this.mousetrap.reset()
  }

  trigger(key: string, action?: KeyboardImplAction) {
    this.mousetrap.trigger(
      formatKey(key, this.options.format, this.graph),
      action,
    )
  }

  private focus(e: EventArgs['node:mouseup']) {
    const isInput = isInputEvent(e.e)
    if (isInput) {
      return
    }
    const target = this.target as HTMLElement
    target.focus({
      preventScroll: true,
    })
  }

  private getKeys(keys: string | string[]) {
    return (Array.isArray(keys) ? keys : [keys]).map((key) =>
      { throw new Error("STUB"); },
    )
  }

  isEnabledForEvent(e: KeyboardEvent) {
      throw new Error("STUB");
  }

  @disposable()
  dispose() {
    this.mousetrap.reset()
  }
}
