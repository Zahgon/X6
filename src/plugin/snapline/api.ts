import { Graph } from '../../graph'
import type { Snapline } from './index'
import type { SnaplineFilter } from './type'

declare module '../../graph/graph' {
  interface Graph {
    isSnaplineEnabled: () => boolean
    enableSnapline: () => Graph
    disableSnapline: () => Graph
    toggleSnapline: (enabled?: boolean) => Graph
    hideSnapline: () => Graph
    setSnaplineFilter: (filter?: SnaplineFilter) => Graph
    isSnaplineOnResizingEnabled: () => boolean
    enableSnaplineOnResizing: () => Graph
    disableSnaplineOnResizing: () => Graph
    toggleSnaplineOnResizing: (enableOnResizing?: boolean) => Graph
    isSharpSnapline: () => boolean
    enableSharpSnapline: () => Graph
    disableSharpSnapline: () => Graph
    toggleSharpSnapline: (sharp?: boolean) => Graph
    getSnaplineTolerance: () => number | undefined
    setSnaplineTolerance: (tolerance: number) => Graph
  }
}

Graph.prototype.isSnaplineEnabled = function () {
    throw new Error("STUB");
}

Graph.prototype.enableSnapline = function () {
    throw new Error("STUB");
}

Graph.prototype.disableSnapline = function () {
    throw new Error("STUB");
}

Graph.prototype.toggleSnapline = function () {
    throw new Error("STUB");
}

Graph.prototype.hideSnapline = function () {
    throw new Error("STUB");
}

Graph.prototype.setSnaplineFilter = function (filter?: SnaplineFilter) {
    throw new Error("STUB");
}

Graph.prototype.isSnaplineOnResizingEnabled = function () {
    throw new Error("STUB");
}

Graph.prototype.enableSnaplineOnResizing = function () {
    throw new Error("STUB");
}

Graph.prototype.disableSnaplineOnResizing = function () {
    throw new Error("STUB");
}

Graph.prototype.toggleSnaplineOnResizing = function (
  enableOnResizing?: boolean,
) {
    throw new Error("STUB");
}

Graph.prototype.isSharpSnapline = function () {
    throw new Error("STUB");
}

Graph.prototype.enableSharpSnapline = function () {
    throw new Error("STUB");
}

Graph.prototype.disableSharpSnapline = function () {
    throw new Error("STUB");
}

Graph.prototype.toggleSharpSnapline = function (sharp?: boolean) {
    throw new Error("STUB");
}

Graph.prototype.getSnaplineTolerance = function () {
    throw new Error("STUB");
}

Graph.prototype.setSnaplineTolerance = function (tolerance: number) {
    throw new Error("STUB");
}
