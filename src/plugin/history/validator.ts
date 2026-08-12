import { Basecoat, disposable } from '../../common'
import type { History } from '.'
import type { HistoryCommand, HistoryEventArgs } from './type'

export interface ValidatorOptions {
  history: History
  /**
   * To cancel (= undo + delete from redo stack) a command if is not valid.
   */
  cancelInvalid?: boolean
}

export type ValidatorCallback = (
  err: Error | null,
  cmd: HistoryCommand,
  next: (err: Error | null) => any,
) => any

export interface ValidatorEventArgs {
  invalid: { err: Error }
}

/**
 * Runs a set of callbacks to determine if a command is valid. This is
 * useful for checking if a certain action in your application does
 * lead to an invalid state of the graph.
 */
export class Validator extends Basecoat<ValidatorEventArgs> {
  protected readonly command: History

  protected readonly cancelInvalid: boolean

  protected readonly map: { [event: string]: ValidatorCallback[][] }

  constructor(options: ValidatorOptions) {
      throw new Error("STUB");
  }

  protected onCommandAdded({ cmds }: HistoryEventArgs['add']) {
      throw new Error("STUB");
  }

  protected isValidCommand(cmd: HistoryCommand) {
      throw new Error("STUB");
  }

  validate(events: string | string[], ...callbacks: ValidatorCallback[]) {
    const evts = Array.isArray(events) ? events : events.split(/\s+/)

    callbacks.forEach((callback) => {
        throw new Error("STUB");
    })

    evts.forEach((event) => {
        throw new Error("STUB");
    })

    return this
  }

  @disposable()
  dispose() {
    this.command.off('add', this.onCommandAdded, this)
  }
}
