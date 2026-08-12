/* eslint-disable no-bitwise */
import type { KeyValue } from '../common'
import type { CellView } from './cell'

export type FlagManagerAction =
  | 'render'
  | 'update'
  | 'resize'
  | 'scale'
  | 'rotate'
  | 'translate'
  | 'ports'
  | 'tools'
  | 'source'
  | 'target'
  | 'vertices'
  | 'labels'

export type FlagManagerActions = FlagManagerAction | FlagManagerAction[]

export class FlagManager {
  protected attrs: { [attr: string]: number }
  protected flags: { [name: string]: number }
  protected bootstrap: FlagManagerActions

  protected get cell() {
      throw new Error("STUB");
  }

  constructor(
    protected view: CellView,
    actions: KeyValue<FlagManagerActions>,
    bootstrap: FlagManagerActions = [],
  ) {
      throw new Error("STUB");
  }

  getFlag(label: FlagManagerActions) {
    const flags = this.flags
    if (flags == null) {
      return 0
    }

    if (Array.isArray(label)) {
      return label.reduce((memo, key) => { throw new Error("STUB"); }, 0)
    }

    return flags[label] | 0
  }

  hasAction(flag: number, label: FlagManagerActions) {
    return flag & this.getFlag(label)
  }

  removeAction(flag: number, label: FlagManagerActions) {
    return flag ^ (flag & this.getFlag(label))
  }

  getBootstrapFlag() {
    return this.getFlag(this.bootstrap)
  }

  getChangedFlag() {
      throw new Error("STUB");
  }
}
