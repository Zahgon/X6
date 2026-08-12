import { Graph } from '../../graph'
import { Node } from '../../model'
import { TransformImplEventArgs } from './transform'
import { Transform } from './index'

declare module '../../graph/graph' {
  interface Graph {
    createTransformWidget: (node: Node) => Graph
    clearTransformWidgets: () => Graph
  }
}

declare module '../../graph/events' {
  interface EventArgs extends TransformImplEventArgs {}
}

Graph.prototype.createTransformWidget = function (node) {
    throw new Error("STUB");
}

Graph.prototype.clearTransformWidgets = function () {
    throw new Error("STUB");
}
