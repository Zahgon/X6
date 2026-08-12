import { Graph } from '../../graph'
import { Scroller } from './index'

declare module '../../graph/graph' {
  interface Graph {
    lockScroller: () => Graph
    unlockScroller: () => Graph
    updateScroller: () => Graph
    getScrollbarPosition: () => { left: number; top: number }
    setScrollbarPosition: (left?: number, top?: number) => Graph
  }
}

Graph.prototype.lockScroller = function () {
    throw new Error("STUB");
}

Graph.prototype.unlockScroller = function () {
    throw new Error("STUB");
}

Graph.prototype.updateScroller = function () {
    throw new Error("STUB");
}

Graph.prototype.getScrollbarPosition = function () {
    throw new Error("STUB");
}

Graph.prototype.setScrollbarPosition = function (left?: number, top?: number) {
    throw new Error("STUB");
}
