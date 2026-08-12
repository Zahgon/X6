import type { KeyValue } from '../../common'
import { Graph } from '../../graph'
import type { History } from '.'
import type { HistoryArgs, HistoryCommand } from './type'

declare module '../../graph/graph' {
  interface Graph {
    isHistoryEnabled: () => boolean
    enableHistory: () => Graph
    disableHistory: () => Graph
    toggleHistory: (enabled?: boolean) => Graph
    undo: (options?: KeyValue) => Graph
    redo: (options?: KeyValue) => Graph
    undoAndCancel: (options?: KeyValue) => Graph
    canUndo: () => boolean
    canRedo: () => boolean
    getHistoryStackSize: () => number
    getUndoStackSize: () => number
    getRedoStackSize: () => number
    getUndoRemainSize: () => number
    cleanHistory: (options?: KeyValue) => Graph
  }
}

declare module '../../graph/events' {
  interface EventArgs {
    'history:undo': HistoryArgs
    'history:redo': HistoryArgs
    'history:cancel': HistoryArgs
    'history:add': HistoryArgs
    'history:clean': HistoryArgs<null>
    'history:change': HistoryArgs<null>
    'history:batch': { cmd: HistoryCommand; options: KeyValue }
  }
}

Graph.prototype.isHistoryEnabled = function () {
    throw new Error("STUB");
}

Graph.prototype.enableHistory = function () {
    throw new Error("STUB");
}

Graph.prototype.disableHistory = function () {
    throw new Error("STUB");
}

Graph.prototype.toggleHistory = function (enabled?: boolean) {
    throw new Error("STUB");
}

Graph.prototype.undo = function (options?: KeyValue) {
    throw new Error("STUB");
}

Graph.prototype.redo = function (options?: KeyValue) {
    throw new Error("STUB");
}

Graph.prototype.undoAndCancel = function (options?: KeyValue) {
    throw new Error("STUB");
}

Graph.prototype.canUndo = function () {
    throw new Error("STUB");
}

Graph.prototype.canRedo = function () {
    throw new Error("STUB");
}

Graph.prototype.cleanHistory = function (options?: KeyValue) {
    throw new Error("STUB");
}

Graph.prototype.getHistoryStackSize = function () {
    throw new Error("STUB");
}

Graph.prototype.getUndoStackSize = function () {
    throw new Error("STUB");
}

Graph.prototype.getRedoStackSize = function () {
    throw new Error("STUB");
}

Graph.prototype.getUndoRemainSize = function () {
    throw new Error("STUB");
}
