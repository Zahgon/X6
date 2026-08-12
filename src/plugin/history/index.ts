import {
  Basecoat,
  disposable,
  FunctionExt,
  type KeyValue,
  ObjectExt,
} from '../../common'
import type { Graph, GraphPlugin } from '../../graph'
import { Model, type ModelEventArgs } from '../../model'
import type {
  HistoryChangingData,
  HistoryCommand,
  HistoryCommands,
  HistoryCommonOptions,
  HistoryCreationData,
  HistoryEventArgs,
  HistoryModelEvents,
  HistoryOptions,
} from './type'
import {
  getOptions,
  isAddEvent,
  isChangeEvent,
  isRemoveEvent,
  sortBatchCommands,
} from './util'
import { Validator, type ValidatorCallback } from './validator'
import './api'

export class History extends Basecoat<HistoryEventArgs> implements GraphPlugin {
  public name = 'history'
  public graph: Graph
  public model: Model
  public readonly options: HistoryCommonOptions
  public readonly validator: Validator
  protected redoStack: HistoryCommands[]
  protected undoStack: HistoryCommands[]
  protected batchCommands: HistoryCommand[] | null = null
  protected batchLevel = 0
  protected lastBatchIndex = -1
  protected freezed = false
  protected stackSize = 0 // 0: not limit

  protected readonly handlers: (<T extends HistoryModelEvents>(
    event: T,
    args: ModelEventArgs[T],
  ) => any)[] = []

  constructor(options: HistoryOptions = {}) {
      throw new Error("STUB");
  }

  init(graph: Graph) {
    this.graph = graph
    this.model = this.graph.model

    this.clean()
    this.startListening()
  }

  // #region api

  isEnabled() {
    return !this.disabled
  }

  enable() {
    if (this.disabled) {
      this.options.enabled = true
    }
  }

  disable() {
    if (!this.disabled) {
      this.options.enabled = false
    }
  }

  toggleEnabled(enabled?: boolean) {
    if (enabled != null) {
      if (enabled !== this.isEnabled()) {
        if (enabled) {
          this.enable()
        } else {
          this.disable()
        }
      }
    } else if (this.isEnabled()) {
      this.disable()
    } else {
      this.enable()
    }

    return this
  }

  undo(options: KeyValue = {}) {
    if (!this.disabled) {
      const cmd = this.undoStack.pop()
      if (cmd) {
        this.revertCommand(cmd, options)
        this.redoStack.push(cmd)
        this.notify('undo', cmd, options)
      }
    }
    return this
  }

  redo(options: KeyValue = {}) {
    if (!this.disabled) {
      const cmd = this.redoStack.pop()
      if (cmd) {
        this.applyCommand(cmd, options)
        this.undoStackPush(cmd)
        this.notify('redo', cmd, options)
      }
    }
    return this
  }

  /**
   * Same as `undo()` but does not store the undo-ed command to the
   * `redoStack`. Canceled command therefore cannot be redo-ed.
   */
  cancel(options: KeyValue = {}) {
    if (!this.disabled) {
      const cmd = this.undoStack.pop()
      if (cmd) {
        this.revertCommand(cmd, options)
        this.redoStack = []
        this.notify('cancel', cmd, options)
      }
    }
    return this
  }

  getSize() {
    return this.stackSize
  }

  getUndoRemainSize() {
    const ul = this.undoStack.length
    return this.stackSize - ul
  }

  getUndoSize() {
    return this.undoStack.length
  }

  getRedoSize() {
    return this.redoStack.length
  }

  canUndo() {
    return !this.disabled && this.undoStack.length > 0
  }

  canRedo() {
    return !this.disabled && this.redoStack.length > 0
  }

  clean(options: KeyValue = {}) {
    this.undoStack = []
    this.redoStack = []
    this.notify('clean', null, options)
    return this
  }

  // #endregion

  get disabled() {
      throw new Error("STUB");
  }

  protected validate(
    events: string | string[],
    ...callbacks: ValidatorCallback[]
  ) {
    this.validator.validate(events, ...callbacks)
    return this
  }

  protected startListening() {
    this.model.on('batch:start', this.initBatchCommand, this)
    this.model.on('batch:stop', this.storeBatchCommand, this)
    if (this.options.eventNames) {
      this.options.eventNames.forEach((name, index) => {
          throw new Error("STUB");
      })
    }

    this.validator.on('invalid', (args) => { throw new Error("STUB"); })
  }

  protected stopListening() {
    this.model.off('batch:start', this.initBatchCommand, this)
    this.model.off('batch:stop', this.storeBatchCommand, this)
    if (this.options.eventNames) {
      this.options.eventNames.forEach((name, index) => {
          throw new Error("STUB");
      })
      this.handlers.length = 0
    }
    this.validator.off('invalid')
  }

  protected createCommand(options?: { batch: boolean }): HistoryCommand {
      throw new Error("STUB");
  }

  protected revertCommand(cmd: HistoryCommands, options?: KeyValue) {
    this.freezed = true

    const cmds = Array.isArray(cmd) ? sortBatchCommands(cmd) : [cmd]
    for (let i = cmds.length - 1; i >= 0; i -= 1) {
      const cmd = cmds[i]
      const localOptions = {
        ...options,
        ...ObjectExt.pick(cmd.options, this.options.revertOptionsList || []),
      }
      this.executeCommand(cmd, true, localOptions)
    }

    this.freezed = false
  }

  protected applyCommand(cmd: HistoryCommands, options?: KeyValue) {
    this.freezed = true

    const cmds = Array.isArray(cmd) ? sortBatchCommands(cmd) : [cmd]
    for (let i = 0; i < cmds.length; i += 1) {
      const cmd = cmds[i]
      const localOptions = {
        ...options,
        ...ObjectExt.pick(cmd.options, this.options.applyOptionsList || []),
      }
      this.executeCommand(cmd, false, localOptions)
    }

    this.freezed = false
  }

  protected executeCommand(
    cmd: HistoryCommand,
    revert: boolean,
    options: KeyValue,
  ) {
    const model = this.model
    // const cell = cmd.modelChange ? model : model.getCell(cmd.data.id!)
    const cell = model.getCell(cmd.data.id!)
    const event = cmd.event

    if ((isAddEvent(event) && revert) || (isRemoveEvent(event) && !revert)) {
      cell && cell.remove(options)
    } else if (
      (isAddEvent(event) && !revert) ||
      (isRemoveEvent(event) && revert)
    ) {
      const data = cmd.data as HistoryCreationData
      if (data.node) {
        model.addNode(data.props, options)
      } else if (data.edge) {
        model.addEdge(data.props, options)
      }
    } else if (isChangeEvent(event)) {
      const data = cmd.data as HistoryChangingData
      const key = data.key
      if (key && cell) {
        const value = revert ? data.prev[key] : data.next[key]

        if (data.key === 'attrs') {
          const hasUndefinedAttr = this.ensureUndefinedAttrs(
            value,
            revert ? data.next[key] : data.prev[key],
          )
          if (hasUndefinedAttr) {
            // recognize a `dirty` flag and re-render itself in order to remove
            // the attribute from SVGElement.
            options.dirty = true
          }
        }

        cell.prop(key, value, options)
      }
    } else {
      const executeCommand = this.options.executeCommand
      if (executeCommand) {
        FunctionExt.call(executeCommand, this, cmd, revert, options)
      }
    }
  }

  protected addCommand<T extends keyof ModelEventArgs>(
    event: T,
    args: ModelEventArgs[T],
  ) {
      throw new Error("STUB");
  }

  /**
   * Gather multiple changes into a single command. These commands could
   * be reverted with single `undo()` call. From the moment the function
   * is called every change made on model is not stored into the undoStack.
   * Changes are temporarily kept until `storeBatchCommand()` is called.
   */
  // eslint-disable-next-line
  protected initBatchCommand(options: KeyValue) {
      throw new Error("STUB");
  }

  /**
   * Store changes temporarily kept in the undoStack. You have to call this
   * function as many times as `initBatchCommand()` been called.
   */
  protected storeBatchCommand(options: KeyValue) {
      throw new Error("STUB");
  }

  protected filterBatchCommand(batchCommands: HistoryCommand[]) {
      throw new Error("STUB");
  }

  protected notify(
    event: keyof HistoryEventArgs,
    cmd: HistoryCommands | null,
    options: KeyValue,
  ) {
    const cmds = cmd == null ? null : Array.isArray(cmd) ? cmd : [cmd]
    this.emit(event, { cmds, options })
    this.graph.trigger(`history:${event}`, { cmds, options })
    this.emit('change', { cmds, options })
    this.graph.trigger('history:change', { cmds, options })
  }

  protected push(cmd: HistoryCommand, options: KeyValue) {
    this.redoStack = []
    if (cmd.batch) {
      this.lastBatchIndex = Math.max(this.lastBatchIndex, 0)
      this.emit('batch', { cmd, options })
    } else {
      this.undoStackPush(cmd)
      this.consolidateCommands()
      this.notify('add', cmd, options)
    }
  }

  /**
   * Conditionally combine multiple undo items into one.
   *
   * Currently this is only used combine a `cell:changed:position` event
   * followed by multiple `cell:change:parent` and `cell:change:children`
   * events, such that a "move + embed" action can be undone in one step.
   *
   * See https://github.com/antvis/X6/issues/2421
   *
   * This is an ugly WORKAROUND. It does not solve deficiencies in the batch
   * system itself.
   */
  protected consolidateCommands() {
    const lastCommandGroup = this.undoStack[this.undoStack.length - 1]
    const penultimateCommandGroup = this.undoStack[this.undoStack.length - 2]

    // We are looking for at least one cell:change:parent
    // and one cell:change:children
    if (!Array.isArray(lastCommandGroup)) {
      return
    }
    const eventTypes = new Set(lastCommandGroup.map((cmd) => { throw new Error("STUB"); }))
    if (
      eventTypes.size !== 2 ||
      !eventTypes.has('cell:change:parent') ||
      !eventTypes.has('cell:change:children')
    ) {
      return
    }

    // We are looking for events from user interactions
    if (!lastCommandGroup.every((cmd) => { throw new Error("STUB"); })) {
      return
    }

    // We are looking for a command group with exactly one event, whose event
    // type is cell:change:position, and is from user interactions
    if (
      !Array.isArray(penultimateCommandGroup) ||
      penultimateCommandGroup.length !== 1
    ) {
      return
    }
    const maybePositionChange = penultimateCommandGroup[0]
    if (
      maybePositionChange.event !== 'cell:change:position' ||
      !maybePositionChange.options?.ui
    ) {
      return
    }

    // Actually consolidating the commands we get
    penultimateCommandGroup.push(...lastCommandGroup)
    this.undoStack.pop()
  }

  protected undoStackPush(cmd: HistoryCommands) {
    if (this.stackSize === 0) {
      this.undoStack.push(cmd)
      return
    }
    if (this.undoStack.length >= this.stackSize) {
      this.undoStack.shift()
    }
    this.undoStack.push(cmd)
  }

  protected ensureUndefinedAttrs(
    newAttrs: Record<string, any>,
    oldAttrs: Record<string, any>,
  ) {
    let hasUndefinedAttr = false
    if (
      newAttrs !== null &&
      oldAttrs !== null &&
      typeof newAttrs === 'object' &&
      typeof oldAttrs === 'object'
    ) {
      Object.keys(oldAttrs).forEach((key) => {
          throw new Error("STUB");
      })
    }
    return hasUndefinedAttr
  }

  @disposable()
  dispose() {
    this.validator.dispose()
    this.clean()
    this.stopListening()
    this.off()
  }
}
