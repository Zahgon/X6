import { Graph } from '../../graph'
import type { Keyboard } from './index'
import { KeyboardImpl } from './keyboard'
import type { KeyboardImplAction, KeyboardImplHandler } from './type'

declare module '../../graph/graph' {
  interface Graph {
    isKeyboardEnabled: () => boolean
    enableKeyboard: () => Graph
    disableKeyboard: () => Graph
    toggleKeyboard: (enabled?: boolean) => Graph
    bindKey: (
      keys: string | string[],
      callback: KeyboardImplHandler,
      action?: KeyboardImplAction,
    ) => Graph
    unbindKey: (keys: string | string[], action?: KeyboardImplAction) => Graph
    clearKeys: () => Graph
    triggerKey: (key: string, action: KeyboardImplAction) => Graph
  }
}

Graph.prototype.isKeyboardEnabled = function () {
    throw new Error("STUB");
}

Graph.prototype.enableKeyboard = function () {
    throw new Error("STUB");
}

Graph.prototype.disableKeyboard = function () {
    throw new Error("STUB");
}

Graph.prototype.toggleKeyboard = function (enabled?: boolean) {
    throw new Error("STUB");
}

Graph.prototype.bindKey = function (
  keys: string | string[],
  callback: KeyboardImplHandler,
  action?: KeyboardImplAction,
) {
    throw new Error("STUB");
}

Graph.prototype.unbindKey = function (
  keys: string | string[],
  action?: KeyboardImplAction,
) {
    throw new Error("STUB");
}

Graph.prototype.clearKeys = function () {
    throw new Error("STUB");
}

Graph.prototype.triggerKey = function (
  key: string,
  action: KeyboardImplAction,
) {
    throw new Error("STUB");
}
