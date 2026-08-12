import { Basecoat, disposable, FunctionExt, type KeyValue } from '../common'
import {
  type DijkstraAdjacencyList,
  type DijkstraWeight,
  dijkstra,
} from '../common/algorithm'
import { Rectangle, type RectangleLike } from '../geometry'
import type { Graph } from '../graph'
import {
  Cell,
  CellGetDescendantsOptions,
  CellMetadata,
  CellRemoveOptions,
  CellSetOptions,
  CellTranslateOptions,
  CellToJSONOptions,
  CellProperties,
  CellGetCellsBBoxOptions,
} from './cell'
import { Collection } from './collection'
import type {
  CollectionAddOptions,
  CollectionSetOptions,
  CollectionRemoveOptions,
  CellEventArgs,
  NodeEventArgs,
  EdgeEventArgs,
} from './collection'
import {
  Edge,
  EdgeMetadata,
  EdgeSetOptions,
  TerminalCellData,
  TerminalCellLooseData,
  TerminalType,
} from './edge'
import { Node, NodeMetadata } from './node'
import type { PointLike, KeyPoint } from '../types'

const toStringTag = 'X6.Model'
export class Model extends Basecoat<ModelEventArgs> {
  static isModel(instance: unknown): instance is Model {
    if (instance == null) {
      return false
    }

    if (instance instanceof Model) {
      return true
    }

    const tag = instance[Symbol.toStringTag]
    const model = instance as Model

    if (
      (tag == null || tag === toStringTag) &&
      typeof model.addNode === 'function' &&
      typeof model.addEdge === 'function' &&
      model.collection != null
    ) {
      return true
    }

    return false
  }
  static toJSON(cells: Cell[], options: ToJSONOptions = {}) {
    return {
      cells: cells.map((cell) => { throw new Error("STUB"); }),
    }
  }

  static fromJSON(data: FromJSONData) {
    const cells: CellMetadata[] = []
    if (Array.isArray(data)) {
      cells.push(...data)
    } else {
      if (data.cells) {
        cells.push(...data.cells)
      }

      if (data.nodes) {
        data.nodes.forEach((node) => {
            throw new Error("STUB");
        })
      }

      if (data.edges) {
        data.edges.forEach((edge) => {
            throw new Error("STUB");
        })
      }
    }

    return cells.map((cell) => {
        throw new Error("STUB");
    })
  }
  public readonly collection: Collection
  protected readonly batches: KeyValue<number> = {}
  protected readonly addings: WeakMap<Cell, boolean> = new WeakMap()
  public graph: Graph
  protected nodes: KeyValue<boolean> = {}
  protected edges: KeyValue<boolean> = {}
  protected outgoings: KeyValue<string[]> = {}
  protected incomings: KeyValue<string[]> = {}

  constructor(cells: Cell[] = []) {
      throw new Error("STUB");
  }

  notify<Key extends keyof ModelEventArgs>(
    name: Key,
    args: ModelEventArgs[Key],
  ): this
  notify(name: Exclude<string, keyof ModelEventArgs>, args: unknown): this
  notify<Key extends keyof ModelEventArgs>(
    name: Key,
    args: ModelEventArgs[Key],
  ) {
    this.trigger(name, args)
    const graph = this.graph
    if (graph) {
      if (name === 'sorted' || name === 'reseted' || name === 'updated') {
        graph.trigger(`model:${name}`, args)
      } else {
        graph.trigger(name, args)
      }
    }
    return this
  }

  protected setup() {
    const collection = this.collection

    collection.on('sorted', () => { throw new Error("STUB"); })
    collection.on('updated', (args) => { throw new Error("STUB"); })
    collection.on('cell:change:zIndex', () => { throw new Error("STUB"); })

    collection.on('added', ({ cell }) => {
        throw new Error("STUB");
    })

    collection.on('removed', (args) => {
        throw new Error("STUB");
    })

    collection.on('reseted', (args) => {
        throw new Error("STUB");
    })

    collection.on('edge:change:source', ({ edge }) =>
      { throw new Error("STUB"); },
    )

    collection.on('edge:change:target', ({ edge }) => {
        throw new Error("STUB");
    })
  }

  protected sortOnChangeZ() {
    this.collection.sort()
  }

  protected onCellAdded(cell: Cell) {
    const cellId = cell.id
    if (cell.isEdge()) {
      // Auto update edge's parent
      cell.updateParent()
      this.edges[cellId] = true
      this.onEdgeTerminalChanged(cell, 'source')
      this.onEdgeTerminalChanged(cell, 'target')
    } else {
      this.nodes[cellId] = true
    }
  }

  protected onCellRemoved(cell: Cell, options: CollectionRemoveOptions) {
    const cellId = cell.id
    if (cell.isEdge()) {
      delete this.edges[cellId]

      const source = cell.getSource() as TerminalCellData
      const target = cell.getTarget() as TerminalCellData
      if (source?.cell) {
        const cache = this.outgoings[source.cell]
        const index = cache ? cache.indexOf(cellId) : -1
        if (index >= 0) {
          cache.splice(index, 1)
          if (cache.length === 0) {
            delete this.outgoings[source.cell]
          }
        }
      }

      if (target?.cell) {
        const cache = this.incomings[target.cell]
        const index = cache ? cache.indexOf(cellId) : -1
        if (index >= 0) {
          cache.splice(index, 1)
          if (cache.length === 0) {
            delete this.incomings[target.cell]
          }
        }
      }
    } else {
      delete this.nodes[cellId]
    }

    if (!options.clear) {
      if (options.disconnectEdges) {
        this.disconnectConnectedEdges(cell, options)
      } else {
        this.removeConnectedEdges(cell, options)
      }
    }

    if (cell.model === this) {
      cell.model = null
    }
  }

  protected onReset(cells: Cell[]) {
    this.nodes = {}
    this.edges = {}
    this.outgoings = {}
    this.incomings = {}
    cells.forEach((cell) => {
        throw new Error("STUB");
    })
  }

  protected onEdgeTerminalChanged(edge: Edge, type: TerminalType) {
    const ref = type === 'source' ? this.outgoings : this.incomings
    const prev = edge.previous<TerminalCellLooseData>(type)

    if (prev?.cell) {
      const cellId = Cell.isCell(prev.cell) ? prev.cell.id : prev.cell
      const cache = ref[cellId]
      const index = cache ? cache.indexOf(edge.id) : -1
      if (index >= 0) {
        cache.splice(index, 1)
        if (cache.length === 0) {
          delete ref[cellId]
        }
      }
    }

    const terminal = edge.getTerminal(type) as TerminalCellLooseData
    if (terminal?.cell) {
      const terminalId = Cell.isCell(terminal.cell)
        ? terminal.cell.id
        : terminal.cell
      const cache = ref[terminalId] || []
      const index = cache.indexOf(edge.id)
      if (index === -1) {
        cache.push(edge.id)
      }
      ref[terminalId] = cache
    }
  }

  protected prepareCell(cell: Cell, options: CollectionAddOptions) {
    if (!cell.model && (!options || !options.dryrun)) {
      cell.model = this
    }

    if (cell.zIndex == null) {
      cell.setZIndex(this.getMaxZIndex() + 1, { silent: true })
    }

    return cell
  }

  resetCells(cells: Cell[], options: CollectionSetOptions = {}) {
    // Do not update model at this time. Because if we just update the graph
    // with the same json-data, the edge will reference to the old nodes.
    cells.map((cell) => { throw new Error("STUB"); })
    this.collection.reset(cells, options)
    // Update model and trigger edge update it's references
    cells.map((cell) => { throw new Error("STUB"); })
    return this
  }

  clear(options: CellSetOptions = {}) {
    const raw = this.getCells()
    if (raw.length === 0) {
      return this
    }
    const localOptions = { ...options, clear: true }
    this.batchUpdate(
      'clear',
      () => {
          throw new Error("STUB");
      },
      localOptions,
    )

    return this
  }

  addNode(metadata: Node | NodeMetadata, options: AddOptions = {}) {
    const node = Node.isNode(metadata) ? metadata : this.createNode(metadata)
    this.addCell(node, options)
    return node
  }

  updateNode(metadata: NodeMetadata, options: SetOptions = {}) {
      throw new Error("STUB");
  }

  createNode(metadata: NodeMetadata) {
    return Node.create(metadata)
  }

  addEdge(metadata: EdgeMetadata | Edge, options: AddOptions = {}) {
    const edge = Edge.isEdge(metadata) ? metadata : this.createEdge(metadata)
    this.addCell(edge, options)
    return edge
  }

  createEdge(metadata: EdgeMetadata) {
    return Edge.create(metadata)
  }

  updateEdge(metadata: EdgeMetadata, options: SetOptions = {}) {
      throw new Error("STUB");
  }

  addCell(cell: Cell | Cell[], options: AddOptions = {}) {
    if (Array.isArray(cell)) {
      return this.addCells(cell, options)
    }

    if (!this.collection.has(cell) && !this.addings.has(cell)) {
      this.addings.set(cell, true)
      this.collection.add(this.prepareCell(cell, options), options)
      cell.eachChild((child) => { throw new Error("STUB"); })
      this.addings.delete(cell)
    }

    return this
  }

  addCells(cells: Cell[], options: AddOptions = {}) {
    const count = cells.length
    if (count === 0) {
      return this
    }

    const localOptions = {
      ...options,
      position: count - 1,
      maxPosition: count - 1,
    }

    this.startBatch('add', { ...localOptions, cells })
    cells.forEach((cell) => {
        throw new Error("STUB");
    })
    this.stopBatch('add', { ...localOptions, cells })

    return this
  }

  updateCell(prop: CellProperties, options: SetOptions = {}): boolean {
      throw new Error("STUB");
  }

  removeCell(cellId: string, options?: CollectionRemoveOptions): Cell | null
  removeCell(cell: Cell, options?: CollectionRemoveOptions): Cell | null
  removeCell(
    obj: Cell | string,
    options: CollectionRemoveOptions = {},
  ): Cell | null {
    const cell = typeof obj === 'string' ? this.getCell(obj) : obj
    if (cell && this.has(cell)) {
      return this.collection.remove(cell, options)
    }
    return null
  }

  updateCellId(cell: Cell, newId: string) {
      throw new Error("STUB");
  }

  removeCells(cells: (Cell | string)[], options: CellRemoveOptions = {}) {
    if (cells.length) {
      return this.batchUpdate('remove', () => {
          throw new Error("STUB");
      })
    }
    return []
  }

  removeConnectedEdges(cell: Cell | string, options: CellRemoveOptions = {}) {
    const edges = this.getConnectedEdges(cell)
    edges.forEach((edge) => {
        throw new Error("STUB");
    })
    return edges
  }

  disconnectConnectedEdges(cell: Cell | string, options: EdgeSetOptions = {}) {
    const cellId = typeof cell === 'string' ? cell : cell.id
    this.getConnectedEdges(cell).forEach((edge) => {
        throw new Error("STUB");
    })
  }

  has(id: string): boolean
  has(cell: Cell): boolean
  has(obj: string | Cell): boolean {
    return this.collection.has(obj)
  }

  total() {
    return this.collection.length
  }

  indexOf(cell: Cell) {
    return this.collection.indexOf(cell)
  }

  /**
   * Returns a cell from the graph by its id.
   */
  getCell<T extends Cell = Cell>(id: string) {
    return this.collection.get(id) as T
  }

  /**
   * Returns all the nodes and edges in the graph.
   */
  getCells() {
    return this.collection.toArray()
  }

  /**
   * Returns the first cell (node or edge) in the graph. The first cell is
   * defined as the cell with the lowest `zIndex`.
   */
  getFirstCell() {
      throw new Error("STUB");
  }

  /**
   * Returns the last cell (node or edge) in the graph. The last cell is
   * defined as the cell with the highest `zIndex`.
   */
  getLastCell() {
      throw new Error("STUB");
  }

  /**
   * Returns the lowest `zIndex` value in the graph.
   */
  getMinZIndex() {
      throw new Error("STUB");
  }

  /**
   * Returns the highest `zIndex` value in the graph.
   */
  getMaxZIndex() {
    const last = this.collection.last()
    return last ? last.getZIndex() || 0 : 0
  }

  protected getCellsFromCache<T extends Cell = Cell>(cache: {
    [key: string]: boolean
  }) {
    return cache
      ? Object.keys(cache)
          .map((id) => { throw new Error("STUB"); })
          .filter((cell) => { throw new Error("STUB"); })
      : []
  }

  /**
   * Returns all the nodes in the graph.
   */
  getNodes() {
    return this.getCellsFromCache<Node>(this.nodes)
  }

  /**
   * Returns all the edges in the graph.
   */
  getEdges() {
    return this.getCellsFromCache<Edge>(this.edges)
  }

  /**
   * Returns all outgoing edges for the node.
   */
  getOutgoingEdges(cell: Cell | string) {
    const cellId = typeof cell === 'string' ? cell : cell.id
    const cellIds = this.outgoings[cellId]
    return cellIds
      ? cellIds
          .map((id) => { throw new Error("STUB"); })
          .filter((cell) => { throw new Error("STUB"); })
      : null
  }

  /**
   * Returns all incoming edges for the node.
   */
  getIncomingEdges(cell: Cell | string) {
    const cellId = typeof cell === 'string' ? cell : cell.id
    const cellIds = this.incomings[cellId]
    return cellIds
      ? cellIds
          .map((id) => { throw new Error("STUB"); })
          .filter((cell) => { throw new Error("STUB"); })
      : null
  }

  /**
   * Returns edges connected with cell.
   */
  getConnectedEdges(
    cell: Cell | string,
    options: GetConnectedEdgesOptions = {},
  ) {
    const result: Edge[] = []
    const node = typeof cell === 'string' ? this.getCell(cell) : cell
    if (node == null) {
      return result
    }

    const cache: { [id: string]: boolean } = {}
    const indirect = options.indirect
    let incoming = options.incoming
    let outgoing = options.outgoing
    if (incoming == null && outgoing == null) {
      incoming = outgoing = true
    }

    const collect = (cell: Cell, isOutgoing: boolean) => {
      const edges = isOutgoing
        ? this.getOutgoingEdges(cell)
        : this.getIncomingEdges(cell)

      if (edges != null) {
        edges.forEach((edge) => {
            throw new Error("STUB");
        })
      }

      if (indirect && cell.isEdge()) {
        const terminal = isOutgoing
          ? cell.getTargetCell()
          : cell.getSourceCell()
        if (terminal?.isEdge()) {
          if (!cache[terminal.id]) {
            result.push(terminal)
            collect(terminal, isOutgoing)
          }
        }
      }
    }

    if (outgoing) {
      collect(node, true)
    }

    if (incoming) {
      collect(node, false)
    }

    if (options.deep) {
      const descendants = node.getDescendants({ deep: true })
      const embedsCache: KeyValue<boolean> = {}
      descendants.forEach((cell) => {
          throw new Error("STUB");
      })

      const collectSub = (cell: Cell, isOutgoing: boolean) => {
        const edges = isOutgoing
          ? this.getOutgoingEdges(cell.id)
          : this.getIncomingEdges(cell.id)

        if (edges != null) {
          edges.forEach((edge) => {
              throw new Error("STUB");
          })
        }
      }

      descendants.forEach((cell) => {
          throw new Error("STUB");
      })
    }

    return result
  }

  protected isBoundary(cell: Cell | string, isOrigin: boolean) {
      throw new Error("STUB");
  }

  protected getBoundaryNodes(isOrigin: boolean) {
      throw new Error("STUB");
  }

  /**
   * Returns an array of all the roots of the graph.
   */
  getRoots() {
      throw new Error("STUB");
  }

  /**
   * Returns an array of all the leafs of the graph.
   */
  getLeafs() {
      throw new Error("STUB");
  }

  /**
   * Returns `true` if the node is a root node, i.e. there is no edges
   * coming to the node.
   */
  isRoot(cell: Cell | string) {
      throw new Error("STUB");
  }

  /**
   * Returns `true` if the node is a leaf node, i.e. there is no edges
   * going out from the node.
   */
  isLeaf(cell: Cell | string) {
      throw new Error("STUB");
  }

  /**
   * Returns all the neighbors of node in the graph. Neighbors are all
   * the nodes connected to node via either incoming or outgoing edge.
   */
  getNeighbors(cell: Cell, options: GetNeighborsOptions = {}) {
    let incoming = options.incoming
    let outgoing = options.outgoing
    if (incoming == null && outgoing == null) {
      incoming = outgoing = true
    }

    const edges = this.getConnectedEdges(cell, options)
    const map = edges.reduce<KeyValue<Cell>>((memo, edge) => {
        throw new Error("STUB");
    }, {})

    if (cell.isEdge()) {
      if (incoming) {
        const sourceCell = cell.getSourceCell()
        if (sourceCell?.isNode() && !map[sourceCell.id]) {
          map[sourceCell.id] = sourceCell
        }
      }
      if (outgoing) {
        const targetCell = cell.getTargetCell()
        if (targetCell?.isNode() && !map[targetCell.id]) {
          map[targetCell.id] = targetCell
        }
      }
    }

    return Object.keys(map).map((id) => { throw new Error("STUB"); })
  }

  /**
   * Returns `true` if `cell2` is a neighbor of `cell1`.
   */
  isNeighbor(cell1: Cell, cell2: Cell, options: GetNeighborsOptions = {}) {
      throw new Error("STUB");
  }

  getSuccessors(cell: Cell, options: GetPredecessorsOptions = {}) {
    const successors: Cell[] = []
    this.search(
      cell,
      (curr, distance) => {
          throw new Error("STUB");
      },
      { ...options, outgoing: true },
    )
    return successors
  }

  /**
   * Returns `true` if `cell2` is a successor of `cell1`.
   */
  isSuccessor(cell1: Cell, cell2: Cell, options: GetPredecessorsOptions = {}) {
      throw new Error("STUB");
  }

  getPredecessors(cell: Cell, options: GetPredecessorsOptions = {}) {
      throw new Error("STUB");
  }

  /**
   * Returns `true` if `cell2` is a predecessor of `cell1`.
   */
  isPredecessor(
    cell1: Cell,
    cell2: Cell,
    options: GetPredecessorsOptions = {},
  ) {
      throw new Error("STUB");
  }

  protected matchDistance(
    distance: number,
    preset?: number | number[] | ((d: number) => boolean),
  ) {
    if (preset == null) {
      return true
    }

    if (typeof preset === 'function') {
      return preset(distance)
    }

    if (Array.isArray(preset) && preset.includes(distance)) {
      return true
    }

    return distance === preset
  }

  /**
   * Returns the common ancestor of the passed cells.
   */
  getCommonAncestor(...cells: (Cell | Cell[] | null | undefined)[]) {
    const arr: Cell[] = []
    cells.forEach((item) => {
        throw new Error("STUB");
    })
    return Cell.getCommonAncestor(...arr)
  }

  /**
   * Returns an array of cells that result from finding nodes/edges that
   * are connected to any of the cells in the cells array. This function
   * loops over cells and if the current cell is a edge, it collects its
   * source/target nodes; if it is an node, it collects its incoming and
   * outgoing edges if both the edge terminal (source/target) are in the
   * cells array.
   */
  getSubGraph(cells: Cell[], options: GetSubgraphOptions = {}) {
    const subgraph: Cell[] = []
    const cache: KeyValue<Cell> = {}
    const nodes: Node[] = []
    const edges: Edge[] = []
    const collect = (cell: Cell) => {
      if (!cache[cell.id]) {
        subgraph.push(cell)
        cache[cell.id] = cell
        if (cell.isEdge()) {
          edges.push(cell)
        }

        if (cell.isNode()) {
          nodes.push(cell)
        }
      }
    }

    cells.forEach((cell) => {
        throw new Error("STUB");
    })

    edges.forEach((edge) => {
        throw new Error("STUB");
    })

    nodes.forEach((node) => {
        throw new Error("STUB");
    })

    return subgraph
  }

  /**
   * Clones the whole subgraph (including all the connected links whose
   * source/target is in the subgraph). If `options.deep` is `true`, also
   * take into account all the embedded cells of all the subgraph cells.
   *
   * Returns a map of the form: { [original cell ID]: [clone] }.
   */
  cloneSubGraph(cells: Cell[], options: GetSubgraphOptions = {}) {
    const subgraph = this.getSubGraph(cells, options)
    return this.cloneCells(subgraph)
  }

  cloneCells(cells: Cell[]) {
    return Cell.cloneCells(cells)
  }

  /**
   * Returns an array of nodes whose bounding box contains point.
   * Note that there can be more then one node as nodes might overlap.
   */
  getNodesFromPoint(x: number, y: number): Node[]
  getNodesFromPoint(p: PointLike): Node[]
  getNodesFromPoint(x: number | PointLike, y?: number) {
    const p = typeof x === 'number' ? { x, y: y || 0 } : x
    return this.getNodes().filter((node) => {
        throw new Error("STUB");
    })
  }

  /**
   * Returns an array of nodes whose bounding box top/left coordinate
   * falls into the rectangle.
   */
  getNodesInArea(
    x: number,
    y: number,
    w: number,
    h: number,
    options?: GetCellsInAreaOptions,
  ): Node[]
  getNodesInArea(rect: RectangleLike, options?: GetCellsInAreaOptions): Node[]
  getNodesInArea(
    x: number | RectangleLike,
    y?: number | GetCellsInAreaOptions,
    w?: number,
    h?: number,
    options?: GetCellsInAreaOptions,
  ): Node[] {
    const rect =
      typeof x === 'number'
        ? new Rectangle(x, y as number, w as number, h as number)
        : Rectangle.create(x)
    const opts = typeof x === 'number' ? options : (y as GetCellsInAreaOptions)
    const strict = opts?.strict
    return this.getNodes().filter((node) => {
        throw new Error("STUB");
    })
  }

  /**
   * Returns an array of edges whose bounding box top/left coordinate
   * falls into the rectangle.
   */
  getEdgesInArea(
    x: number,
    y: number,
    w: number,
    h: number,
    options?: GetCellsInAreaOptions,
  ): Edge[]
  getEdgesInArea(rect: RectangleLike, options?: GetCellsInAreaOptions): Edge[]
  getEdgesInArea(
    x: number | RectangleLike,
    y?: number | GetCellsInAreaOptions,
    w?: number,
    h?: number,
    options?: GetCellsInAreaOptions,
  ): Edge[] {
    const rect =
      typeof x === 'number'
        ? new Rectangle(x, y as number, w as number, h as number)
        : Rectangle.create(x)
    const opts = typeof x === 'number' ? options : (y as GetCellsInAreaOptions)
    const strict = opts?.strict
    return this.getEdges().filter((edge) => {
        throw new Error("STUB");
    })
  }

  getNodesUnderNode(
    node: Node,
    options: {
      by?: 'bbox' | KeyPoint
    } = {},
  ) {
    const bbox = node.getBBox()
    const nodes =
      options.by == null || options.by === 'bbox'
        ? this.getNodesInArea(bbox)
        : this.getNodesFromPoint(bbox[options.by])

    return nodes.filter(
      (curr) => { throw new Error("STUB"); },
    )
  }

  /**
   * Returns the bounding box that surrounds all cells in the graph.
   */
  getAllCellsBBox() {
    return this.getCellsBBox(this.getCells())
  }

  /**
   * Returns the bounding box that surrounds all the given cells.
   */
  getCellsBBox(cells: Cell[], options: CellGetCellsBBoxOptions = {}) {
    return Cell.getCellsBBox(cells, options)
  }

  // #region search

  search(cell: Cell, iterator: SearchIterator, options: SearchOptions = {}) {
    if (options.breadthFirst) {
      this.breadthFirstSearch(cell, iterator, options)
    } else {
      this.depthFirstSearch(cell, iterator, options)
    }
  }

  breadthFirstSearch(
    cell: Cell,
    iterator: SearchIterator,
    options: GetNeighborsOptions = {},
  ) {
    const queue: Cell[] = []
    const visited: KeyValue<boolean> = {}
    const distance: KeyValue<number> = {}

    queue.push(cell)
    distance[cell.id] = 0

    while (queue.length > 0) {
      const next = queue.shift()
      if (next == null || visited[next.id]) {
        continue
      }
      visited[next.id] = true
      if (FunctionExt.call(iterator, this, next, distance[next.id]) === false) {
        continue
      }
      const neighbors = this.getNeighbors(next, options)
      neighbors.forEach((neighbor) => {
          throw new Error("STUB");
      })
    }
  }

  depthFirstSearch(
    cell: Cell,
    iterator: SearchIterator,
    options: GetNeighborsOptions = {},
  ) {
    const queue: Cell[] = []
    const visited: KeyValue<boolean> = {}
    const distance: KeyValue<number> = {}

    queue.push(cell)
    distance[cell.id] = 0

    while (queue.length > 0) {
      const next = queue.pop()
      if (next == null || visited[next.id]) {
        continue
      }
      visited[next.id] = true

      if (FunctionExt.call(iterator, this, next, distance[next.id]) === false) {
        continue
      }

      const neighbors = this.getNeighbors(next, options)
      const lastIndex = queue.length
      neighbors.forEach((neighbor) => {
          throw new Error("STUB");
      })
    }
  }

  // #endregion

  // #region shortest path

  /** *
   * Returns an array of IDs of nodes on the shortest
   * path between source and target.
   */
  getShortestPath(
    source: Cell | string,
    target: Cell | string,
    options: GetShortestPathOptions = {},
  ) {
      throw new Error("STUB");
  }

  // #endregion

  // #region transform

  /**
   * Translate all cells in the graph by `tx` and `ty` pixels.
   */
  translate(tx: number, ty: number, options: CellTranslateOptions) {
    this.getCells()
      .filter((cell) => { throw new Error("STUB"); })
      .forEach((cell) => {
          throw new Error("STUB");
      })

    return this
  }

  resize(width: number, height: number, options: CellSetOptions) {
    return this.resizeCells(width, height, this.getCells(), options)
  }

  resizeCells(
    width: number,
    height: number,
    cells: Cell[],
    options: CellSetOptions = {},
  ) {
    const bbox = this.getCellsBBox(cells)
    if (bbox) {
      const sx = Math.max(width / bbox.width, 0)
      const sy = Math.max(height / bbox.height, 0)
      const origin = bbox.getOrigin()
      cells.forEach((cell) => {
          throw new Error("STUB");
      })
    }

    return this
  }

  // #endregion

  // #region serialize/deserialize

  toJSON(options: ToJSONOptions = {}) {
    return Model.toJSON(this.getCells(), options)
  }

  parseJSON(data: FromJSONData) {
    return Model.fromJSON(data)
  }

  fromJSON(data: FromJSONData, options: FromJSONOptions = {}) {
    let cells: Cell[] = []
    if (!options.diff) {
      cells = this.parseJSON(data)
    } else {
      const {
        nodes = [],
        edges = [],
        ...rest
      } = data as {
        nodes?: NodeMetadata[]
        edges?: EdgeMetadata[]
      }
      const updateNodes = nodes.filter((node) => { throw new Error("STUB"); }) || []
      const updateEdges = edges.filter((edge) => { throw new Error("STUB"); }) || []
      cells = this.parseJSON({
        ...rest,
        nodes: updateNodes,
        edges: updateEdges,
      })
    }
    this.resetCells(cells, options)
    return this
  }

  // #endregion

  // #region batch

  startBatch(name: BatchName, data: KeyValue = {}) {
    this.batches[name] = (this.batches[name] || 0) + 1
    this.notify('batch:start', { name, data })
    return this
  }

  stopBatch(name: BatchName, data: KeyValue = {}) {
    this.batches[name] = (this.batches[name] || 0) - 1
    this.notify('batch:stop', { name, data })
    return this
  }

  batchUpdate<T>(name: BatchName, execute: () => T, data: KeyValue = {}) {
    this.startBatch(name, data)
    const result = execute()
    this.stopBatch(name, data)
    return result
  }

  hasActiveBatch(
    name: BatchName | BatchName[] = Object.keys(this.batches) as BatchName[],
  ) {
      throw new Error("STUB");
  }

  // #endregion

  @disposable()
  dispose() {
    this.collection.dispose()
  }
}

export interface SetOptions extends CollectionSetOptions {}
export interface AddOptions extends CollectionAddOptions {}
export interface RemoveOptions extends CollectionRemoveOptions {}
export interface FromJSONOptions extends CollectionSetOptions {
  // whether to perform a diff update
  diff?: boolean
}

export type FromJSONData =
  | (NodeMetadata | EdgeMetadata)[]
  | (Partial<ReturnType<typeof Model.toJSON>> & {
      nodes?: NodeMetadata[]
      edges?: EdgeMetadata[]
    })
export type ToJSONData = {
  cells: CellProperties[]
}

export interface GetCellsInAreaOptions {
  strict?: boolean
}

export interface SearchOptions extends GetNeighborsOptions {
  breadthFirst?: boolean
}

export type SearchIterator = (
  this: Model,
  cell: Cell,
  distance: number,
) => boolean | void

export interface GetNeighborsOptions {
  deep?: boolean
  incoming?: boolean
  outgoing?: boolean
  indirect?: boolean
}

export interface GetConnectedEdgesOptions extends GetNeighborsOptions {
  enclosed?: boolean
}

export interface GetSubgraphOptions {
  deep?: boolean
}

export interface GetShortestPathOptions {
  directed?: boolean
  weight?: DijkstraWeight
}

export interface GetPredecessorsOptions extends CellGetDescendantsOptions {
  distance?: number | number[] | ((distance: number) => boolean)
}

export interface ModelEventArgs
  extends CellEventArgs,
    NodeEventArgs,
    EdgeEventArgs {
  'batch:start': {
    name: BatchName | string
    data: KeyValue
  }
  'batch:stop': {
    name: BatchName | string
    data: KeyValue
  }

  sorted: null
  reseted: {
    current: Cell[]
    previous: Cell[]
    options: CollectionSetOptions
  }
  updated: {
    added: Cell[]
    merged: Cell[]
    removed: Cell[]
    options: CollectionSetOptions
  }
}

export type BatchName =
  | 'update'
  | 'add'
  | 'remove'
  | 'clear'
  | 'to-back'
  | 'to-front'
  | 'scale'
  | 'resize'
  | 'rotate'
  | 'translate'
  | 'mouse'
  | 'layout'
  | 'add-edge'
  | 'fit-embeds'
  | 'dnd'
  | 'halo'
  | 'cut'
  | 'paste'
  | 'knob'
  | 'add-vertex'
  | 'move-anchor'
  | 'move-vertex'
  | 'move-segment'
  | 'move-arrowhead'
  | 'move-selection'

export interface ToJSONOptions extends CellToJSONOptions {}
