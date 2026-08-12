import { Graph } from '../../graph'
import type { Cell } from '../../model'
import type { Clipboard } from './index'
import type {
  ClipboardImplCopyOptions,
  ClipboardImplPasteOptions,
  ClipboardOptions,
} from './type'

declare module '../../graph/graph' {
  interface Graph {
    isClipboardEnabled: () => boolean
    enableClipboard: () => Graph
    disableClipboard: () => Graph
    toggleClipboard: (enabled?: boolean) => Graph
    isClipboardEmpty: (options?: ClipboardOptions) => boolean
    getCellsInClipboard: () => Cell[]
    cleanClipboard: () => Graph
    copy: (cells: Cell[], options?: ClipboardImplCopyOptions) => Graph
    cut: (cells: Cell[], options?: ClipboardImplCopyOptions) => Graph
    paste: (options?: ClipboardImplPasteOptions, graph?: Graph) => Cell[]
  }
}

declare module '../../graph/events' {
  interface EventArgs {
    'clipboard:changed': { cells: Cell[] }
  }
}

Graph.prototype.isClipboardEnabled = function () {
    throw new Error("STUB");
}

Graph.prototype.enableClipboard = function () {
    throw new Error("STUB");
}

Graph.prototype.disableClipboard = function () {
    throw new Error("STUB");
}

Graph.prototype.toggleClipboard = function (enabled?: boolean) {
    throw new Error("STUB");
}

Graph.prototype.isClipboardEmpty = function (options?: ClipboardOptions) {
    throw new Error("STUB");
}

Graph.prototype.getCellsInClipboard = function () {
    throw new Error("STUB");
}

Graph.prototype.cleanClipboard = function () {
    throw new Error("STUB");
}

Graph.prototype.copy = function (
  cells: Cell[],
  options?: ClipboardImplCopyOptions,
) {
    throw new Error("STUB");
}

Graph.prototype.cut = function (
  cells: Cell[],
  options?: ClipboardImplCopyOptions,
) {
    throw new Error("STUB");
}

Graph.prototype.paste = function (
  options?: ClipboardImplPasteOptions,
  graph?: Graph,
) {
    throw new Error("STUB");
}
