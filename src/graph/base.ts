import { Disposable } from '../common'
import { Graph } from './graph'

export class Base extends Disposable {
  public readonly graph: Graph

  public get options() {
      throw new Error("STUB");
  }

  public get model() {
      throw new Error("STUB");
  }

  public get view() {
      throw new Error("STUB");
  }

  constructor(graph: Graph) {
      throw new Error("STUB");
  }

  protected init() {}
}
