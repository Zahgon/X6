import type { ModifierKey } from '../../common'
import { Graph } from '../../graph'
import type { Cell } from '../../model'
import type {
  SelectionFilter,
  SelectionContent,
  SelectionSetOptions,
  SelectionAddOptions,
  SelectionRemoveOptions,
} from './index'
import { Selection } from './index'
import type { SelectionImplEventArgsRecord } from './selection'

declare module '../../graph/graph' {
  interface Graph {
    isSelectionEnabled: () => boolean
    enableSelection: () => Graph
    disableSelection: () => Graph
    toggleSelection: (enabled?: boolean) => Graph
    isMultipleSelection: () => boolean
    enableMultipleSelection: () => Graph
    disableMultipleSelection: () => Graph
    toggleMultipleSelection: (multiple?: boolean) => Graph
    isSelectionMovable: () => boolean
    enableSelectionMovable: () => Graph
    disableSelectionMovable: () => Graph
    toggleSelectionMovable: (movable?: boolean) => Graph
    isRubberbandEnabled: () => boolean
    enableRubberband: () => Graph
    disableRubberband: () => Graph
    toggleRubberband: (enabled?: boolean) => Graph
    isStrictRubberband: () => boolean
    enableStrictRubberband: () => Graph
    disableStrictRubberband: () => Graph
    toggleStrictRubberband: (strict?: boolean) => Graph
    setRubberbandModifiers: (modifiers?: string | ModifierKey[] | null) => Graph
    setSelectionFilter: (filter?: SelectionFilter) => Graph
    setSelectionDisplayContent: (content?: SelectionContent) => Graph
    isSelectionEmpty: () => boolean
    cleanSelection: (options?: SelectionSetOptions) => Graph
    resetSelection: (
      cells?: Cell | string | (Cell | string)[],
      options?: SelectionSetOptions,
    ) => Graph
    getSelectedCells: () => Cell[]
    getSelectedCellCount: () => number
    isSelected: (cell: Cell | string) => boolean
    select: (
      cells: Cell | string | (Cell | string)[],
      options?: SelectionAddOptions,
    ) => Graph
    unselect: (
      cells: Cell | string | (Cell | string)[],
      options?: SelectionRemoveOptions,
    ) => Graph
  }
}

declare module '../../graph/events' {
  interface EventArgs extends SelectionImplEventArgsRecord {}
}

Graph.prototype.isSelectionEnabled = function () {
    throw new Error("STUB");
}

Graph.prototype.enableSelection = function () {
    throw new Error("STUB");
}

Graph.prototype.disableSelection = function () {
    throw new Error("STUB");
}

Graph.prototype.toggleSelection = function (enabled?: boolean) {
    throw new Error("STUB");
}

Graph.prototype.isMultipleSelection = function () {
    throw new Error("STUB");
}

Graph.prototype.enableMultipleSelection = function () {
    throw new Error("STUB");
}

Graph.prototype.disableMultipleSelection = function () {
    throw new Error("STUB");
}

Graph.prototype.toggleMultipleSelection = function (multiple?: boolean) {
    throw new Error("STUB");
}

Graph.prototype.isSelectionMovable = function () {
    throw new Error("STUB");
}

Graph.prototype.enableSelectionMovable = function () {
    throw new Error("STUB");
}

Graph.prototype.disableSelectionMovable = function () {
    throw new Error("STUB");
}

Graph.prototype.toggleSelectionMovable = function (movable?: boolean) {
    throw new Error("STUB");
}

Graph.prototype.isRubberbandEnabled = function () {
    throw new Error("STUB");
}

Graph.prototype.enableRubberband = function () {
    throw new Error("STUB");
}

Graph.prototype.disableRubberband = function () {
    throw new Error("STUB");
}

Graph.prototype.toggleRubberband = function (enabled?: boolean) {
    throw new Error("STUB");
}

Graph.prototype.isStrictRubberband = function () {
    throw new Error("STUB");
}

Graph.prototype.enableStrictRubberband = function () {
    throw new Error("STUB");
}

Graph.prototype.disableStrictRubberband = function () {
    throw new Error("STUB");
}

Graph.prototype.toggleStrictRubberband = function (strict?: boolean) {
    throw new Error("STUB");
}

Graph.prototype.setRubberbandModifiers = function (
  modifiers?: string | ModifierKey[] | null,
) {
    throw new Error("STUB");
}

Graph.prototype.setSelectionFilter = function (filter?: SelectionFilter) {
    throw new Error("STUB");
}

Graph.prototype.setSelectionDisplayContent = function (
  content?: SelectionContent,
) {
    throw new Error("STUB");
}

Graph.prototype.isSelectionEmpty = function () {
    throw new Error("STUB");
}

Graph.prototype.cleanSelection = function (options?: SelectionSetOptions) {
    throw new Error("STUB");
}

Graph.prototype.resetSelection = function (
  cells?: Cell | string | (Cell | string)[],
  options?: SelectionSetOptions,
) {
    throw new Error("STUB");
}

Graph.prototype.getSelectedCells = function () {
    throw new Error("STUB");
}

Graph.prototype.getSelectedCellCount = function () {
    throw new Error("STUB");
}

Graph.prototype.isSelected = function (cell: Cell | string) {
    throw new Error("STUB");
}

Graph.prototype.select = function (
  cells: Cell | string | (Cell | string)[],
  options?: SelectionAddOptions,
) {
    throw new Error("STUB");
}

Graph.prototype.unselect = function (
  cells: Cell | string | (Cell | string)[],
  options?: SelectionRemoveOptions,
) {
    throw new Error("STUB");
}
