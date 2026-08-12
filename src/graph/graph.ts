import type { Dom, KeyValue, NumberExt } from '../common'
import { Basecoat, disposable } from '../common'
import { Point, Rectangle, type RectangleLike } from '../geometry'
import type { PointLike } from '../geometry/point'
import type {
  CellGetCellsBBoxOptions,
  CellRemoveOptions,
  CellSetOptions,
  CollectionRemoveOptions,
  CollectionSetOptions,
  EdgeMetadata,
  EdgeSetOptions,
  NodeMetadata,
} from '../model'
import { Cell, Edge, Model, Node } from '../model'
import type {
  AddOptions,
  GetPredecessorsOptions,
  ToJSONOptions,
  FromJSONData,
  FromJSONOptions,
  GetConnectedEdgesOptions,
  GetNeighborsOptions,
  GetSubgraphOptions,
  GetCellsInAreaOptions,
  SearchIterator,
  GetShortestPathOptions,
  BatchName,
  SearchOptions,
} from '../model'
import type { BackgroundOptions } from '../registry'
import {
  attrRegistry,
  backgroundRegistry,
  connectionPointRegistry,
  connectorRegistry,
  edgeAnchorRegistry,
  edgeToolRegistry,
  filterRegistry,
  gridRegistry,
  highlighterRegistry,
  markerRegistry,
  nodeAnchorRegistry,
  nodeToolRegistry,
  portLabelLayoutRegistry,
  portLayoutRegistry,
  routerRegistry,
} from '../registry'
import { Renderer as ViewRenderer } from '../renderer'
import { CellView } from '../view'
import { BackgroundManager as Background } from './background'
import { CoordManager as Coord } from './coord'
import { CSSManager as Css } from './css'
import { DefsManager as Defs } from './defs'
import type { FilterOptions, GradientOptions, MarkerOptions } from './defs'
import type { EventArgs } from './events'
import { GridManager as Grid, GridDrawOptions } from './grid'
import { HighlightManager as Highlight } from './highlight'
import { MouseWheel as Wheel } from './mousewheel'
import { GraphDefinition, GraphManual, getOptions } from './options'
import { PanningManager as Panning } from './panning'
import { SizeManager as Size } from './size'
import { TransformManager as Transform } from './transform'
import type {
  GetContentAreaOptions,
  ZoomOptions,
  ScaleContentToFitOptions,
  FitToContentOptions,
  FitToContentFullOptions,
  CenterOptions,
  PositionContentOptions,
  Direction,
} from './transform'
import { GraphView } from './view'
import { VirtualRenderManager as VirtualRender } from './virtual-render'
import type { KeyPoint } from '../types'

type FindViewsInAreaOptions = {
  strict?: boolean
}

export interface Options extends GraphManual {}

export type GraphPlugin = {
  name: string
  init: (graph: Graph, ...options: any[]) => any
  dispose: () => void

  enable?: () => void
  disable?: () => void
  isEnabled?: () => boolean
}
export class Graph extends Basecoat<EventArgs> {
  static toStringTag = `X6.${Graph.name}`
  static isGraph(instance: any): instance is Graph {
    if (instance == null) {
      return false
    }

    if (instance instanceof Graph) {
      return true
    }

    const tag = instance[Symbol.toStringTag]

    if (tag == null || tag === Graph.toStringTag) {
      return true
    }

    return false
  }
  static render(options: Partial<Options>, data?: FromJSONData): Graph
  static render(container: HTMLElement | string, data?: FromJSONData): Graph
  static render(
    options: Partial<Options> | HTMLElement | string,
    data?: FromJSONData,
  ): Graph {
    const graph =
      typeof options === 'string' || options instanceof HTMLElement
        ? new Graph({ container: options })
        : new Graph(options)

    if (data != null) {
      graph.fromJSON(data)
    }

    return graph
  }
  static registerNode = Node.registry.register
  static registerEdge = Edge.registry.register
  static registerView = CellView.registry.register
  static registerAttr = attrRegistry.register
  static registerGrid = gridRegistry.register
  static registerFilter = filterRegistry.register
  static registerNodeTool = nodeToolRegistry.register
  static registerEdgeTool = edgeToolRegistry.register
  static registerBackground = backgroundRegistry.register
  static registerHighlighter = highlighterRegistry.register
  static registerPortLayout = portLayoutRegistry.register
  static registerPortLabelLayout = portLabelLayoutRegistry.register
  static registerMarker = markerRegistry.register
  static registerRouter = routerRegistry.register
  static registerConnector = connectorRegistry.register
  static registerAnchor = nodeAnchorRegistry.register
  static registerEdgeAnchor = edgeAnchorRegistry.register
  static registerConnectionPoint = connectionPointRegistry.register
  static unregisterNode = Node.registry.unregister
  static unregisterEdge = Edge.registry.unregister
  static unregisterView = CellView.registry.unregister
  static unregisterAttr = attrRegistry.unregister
  static unregisterGrid = gridRegistry.unregister
  static unregisterFilter = filterRegistry.unregister
  static unregisterNodeTool = nodeToolRegistry.unregister
  static unregisterEdgeTool = edgeToolRegistry.unregister
  static unregisterBackground = backgroundRegistry.unregister
  static unregisterHighlighter = highlighterRegistry.unregister
  static unregisterPortLayout = portLayoutRegistry.unregister
  static unregisterPortLabelLayout = portLabelLayoutRegistry.unregister
  static unregisterMarker = markerRegistry.unregister
  static unregisterRouter = routerRegistry.unregister
  static unregisterConnector = connectorRegistry.unregister
  static unregisterAnchor = nodeAnchorRegistry.unregister
  static unregisterEdgeAnchor = edgeAnchorRegistry.unregister
  static unregisterConnectionPoint = connectionPointRegistry.unregister
  private installedPlugins: Set<GraphPlugin> = new Set()
  public model: Model

  public readonly options: GraphDefinition
  public readonly css: Css
  public readonly view: GraphView
  public readonly grid: Grid
  public readonly defs: Defs
  public readonly coord: Coord
  public readonly renderer: ViewRenderer
  public readonly highlight: Highlight
  public readonly transform: Transform
  public readonly background: Background
  public readonly panning: Panning
  public readonly mousewheel: Wheel
  public readonly virtualRender: VirtualRender
  public readonly size: Size

  public get container() {
      throw new Error("STUB");
  }

  protected get [Symbol.toStringTag]() {
    return Graph.toStringTag
  }

  constructor(options: Partial<GraphManual>) {
      throw new Error("STUB");
  }

  // #region model

  isNode(cell: Cell): cell is Node {
    return cell.isNode()
  }

  isEdge(cell: Cell): cell is Edge {
    return cell.isEdge()
  }

  resetCells(cells: Cell[], options: CollectionSetOptions = {}) {
    this.model.resetCells(cells, options)
    return this
  }

  clearCells(options: CellSetOptions = {}) {
      throw new Error("STUB");
  }

  toJSON(options: ToJSONOptions = {}) {
    return this.model.toJSON(options)
  }

  parseJSON(data: FromJSONData) {
    return this.model.parseJSON(data)
  }

  fromJSON(data: FromJSONData, options: FromJSONOptions = {}) {
    this.model.fromJSON(data, options)
    return this
  }

  getCellById(id: string) {
    return this.model.getCell(id)
  }

  addNode(metadata: NodeMetadata, options?: AddOptions): Node
  addNode(node: Node, options?: AddOptions): Node
  addNode(node: Node | NodeMetadata, options: AddOptions = {}): Node {
    return this.model.addNode(node, options)
  }

  addNodes(nodes: (Node | NodeMetadata)[], options: AddOptions = {}) {
    return this.addCell(
      nodes.map((node) => { throw new Error("STUB"); }),
      options,
    )
  }

  createNode(metadata: NodeMetadata) {
    return this.model.createNode(metadata)
  }

  removeNode(nodeId: string, options?: CollectionRemoveOptions): Node | null
  removeNode(node: Node, options?: CollectionRemoveOptions): Node | null
  removeNode(node: Node | string, options: CollectionRemoveOptions = {}) {
    return this.model.removeCell(node as Node, options) as Node
  }

  addEdge(metadata: EdgeMetadata, options?: AddOptions): Edge
  addEdge(edge: Edge, options?: AddOptions): Edge
  addEdge(edge: Edge | EdgeMetadata, options: AddOptions = {}): Edge {
    return this.model.addEdge(edge, options)
  }

  addEdges(edges: (Edge | EdgeMetadata)[], options: AddOptions = {}) {
    return this.addCell(
      edges.map((edge) => { throw new Error("STUB"); }),
      options,
    )
  }

  removeEdge(edgeId: string, options?: CollectionRemoveOptions): Edge | null
  removeEdge(edge: Edge, options?: CollectionRemoveOptions): Edge | null
  removeEdge(edge: Edge | string, options: CollectionRemoveOptions = {}) {
    return this.model.removeCell(edge as Edge, options) as Edge
  }

  createEdge(metadata: EdgeMetadata) {
    return this.model.createEdge(metadata)
  }

  addCell(cell: Cell | Cell[], options: AddOptions = {}) {
    this.model.addCell(cell, options)
    return this
  }

  removeCell(cellId: string, options?: CollectionRemoveOptions): Cell | null
  removeCell(cell: Cell, options?: CollectionRemoveOptions): Cell | null
  removeCell(cell: Cell | string, options: CollectionRemoveOptions = {}) {
    return this.model.removeCell(cell as Cell, options)
  }

  removeCells(cells: (Cell | string)[], options: CellRemoveOptions = {}) {
    return this.model.removeCells(cells, options)
  }

  removeConnectedEdges(cell: Cell | string, options: CellRemoveOptions = {}) {
    return this.model.removeConnectedEdges(cell, options)
  }

  disconnectConnectedEdges(cell: Cell | string, options: EdgeSetOptions = {}) {
    this.model.disconnectConnectedEdges(cell, options)
    return this
  }

  hasCell(cellId: string): boolean
  hasCell(cell: Cell): boolean
  hasCell(cell: string | Cell): boolean {
    return this.model.has(cell as Cell)
  }

  getCells() {
    return this.model.getCells()
  }

  getCellCount() {
      throw new Error("STUB");
  }

  /**
   * Returns all the nodes in the graph.
   */
  getNodes() {
    return this.model.getNodes()
  }

  /**
   * Returns all the edges in the graph.
   */
  getEdges() {
    return this.model.getEdges()
  }

  /**
   * Returns all outgoing edges for the node.
   */
  getOutgoingEdges(cell: Cell | string) {
    return this.model.getOutgoingEdges(cell)
  }

  /**
   * Returns all incoming edges for the node.
   */
  getIncomingEdges(cell: Cell | string) {
    return this.model.getIncomingEdges(cell)
  }

  /**
   * Returns edges connected with cell.
   */
  getConnectedEdges(
    cell: Cell | string,
    options: GetConnectedEdgesOptions = {},
  ) {
    return this.model.getConnectedEdges(cell, options)
  }

  /**
   * Returns an array of all the roots of the graph.
   */
  getRootNodes() {
      throw new Error("STUB");
  }

  /**
   * Returns an array of all the leafs of the graph.
   */
  getLeafNodes() {
      throw new Error("STUB");
  }

  /**
   * Returns `true` if the node is a root node, i.e.
   * there is no  edges coming to the node.
   */
  isRootNode(cell: Cell | string) {
      throw new Error("STUB");
  }

  /**
   * Returns `true` if the node is a leaf node, i.e.
   * there is no edges going out from the node.
   */
  isLeafNode(cell: Cell | string) {
      throw new Error("STUB");
  }

  /**
   * Returns all the neighbors of node in the graph. Neighbors are all
   * the nodes connected to node via either incoming or outgoing edge.
   */
  getNeighbors(cell: Cell, options: GetNeighborsOptions = {}) {
    return this.model.getNeighbors(cell, options)
  }

  /**
   * Returns `true` if `cell2` is a neighbor of `cell1`.
   */
  isNeighbor(cell1: Cell, cell2: Cell, options: GetNeighborsOptions = {}) {
      throw new Error("STUB");
  }

  getSuccessors(cell: Cell, options: GetPredecessorsOptions = {}) {
    return this.model.getSuccessors(cell, options)
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

  getCommonAncestor(...cells: (Cell | null | undefined)[]) {
    return this.model.getCommonAncestor(...cells)
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
    return this.model.getSubGraph(cells, options)
  }

  /**
   * Clones the whole subgraph (including all the connected links whose
   * source/target is in the subgraph). If `options.deep` is `true`, also
   * take into account all the embedded cells of all the subgraph cells.
   *
   * Returns a map of the form: { [original cell ID]: [clone] }.
   */
  cloneSubGraph(cells: Cell[], options: GetSubgraphOptions = {}) {
    return this.model.cloneSubGraph(cells, options)
  }

  cloneCells(cells: Cell[]) {
    return this.model.cloneCells(cells)
  }

  /**
   * Returns an array of nodes whose bounding box contains point.
   * Note that there can be more then one node as nodes might overlap.
   */
  getNodesFromPoint(x: number, y: number): Node[]
  getNodesFromPoint(p: PointLike): Node[]
  getNodesFromPoint(x: number | PointLike, y?: number) {
    return this.model.getNodesFromPoint(x as number, y as number)
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
    return this.model.getNodesInArea(
      x as number,
      y as number,
      w as number,
      h as number,
      options,
    )
  }

  getNodesUnderNode(
    node: Node,
    options: {
      by?: 'bbox' | KeyPoint
    } = {},
  ) {
    return this.model.getNodesUnderNode(node, options)
  }

  searchCell(
    cell: Cell,
    iterator: SearchIterator,
    options: SearchOptions = {},
  ) {
      throw new Error("STUB");
  }

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

  /**
   * Returns the bounding box that surrounds all cells in the graph.
   */
  getAllCellsBBox() {
    return this.model.getAllCellsBBox()
  }

  /**
   * Returns the bounding box that surrounds all the given cells.
   */
  getCellsBBox(cells: Cell[], options: CellGetCellsBBoxOptions = {}) {
    return this.model.getCellsBBox(cells, options)
  }

  startBatch(name: string | BatchName, data: KeyValue = {}) {
    this.model.startBatch(name as BatchName, data)
  }

  stopBatch(name: string | BatchName, data: KeyValue = {}) {
    this.model.stopBatch(name as BatchName, data)
  }

  batchUpdate<T>(execute: () => T, data?: KeyValue): T
  batchUpdate<T>(name: string | BatchName, execute: () => T, data?: KeyValue): T
  batchUpdate<T>(
    arg1: string | BatchName | (() => T),
    arg2?: (() => T) | KeyValue,
    arg3?: KeyValue,
  ): T {
    const name = typeof arg1 === 'string' ? arg1 : 'update'
    const execute = typeof arg1 === 'string' ? (arg2 as () => T) : arg1
    const data = typeof arg2 === 'function' ? arg3 : arg2
    this.startBatch(name, data)
    const result = execute()
    this.stopBatch(name, data)
    return result
  }

  updateCellId(cell: Cell, newId: string) {
      throw new Error("STUB");
  }

  // #endregion

  // #region view

  findView(ref: Cell | Element) {
    if (Cell.isCell(ref)) {
      return this.findViewByCell(ref)
    }

    return this.findViewByElem(ref)
  }

  findViews(ref: PointLike | RectangleLike) {
      throw new Error("STUB");
  }

  findViewByCell(cellId: string | number): CellView | null
  findViewByCell(cell: Cell | null): CellView | null
  findViewByCell(
    cell: Cell | string | number | null | undefined,
  ): CellView | null {
    return this.renderer.findViewByCell(cell as Cell)
  }

  findViewByElem(elem: string | Element | undefined | null) {
    return this.renderer.findViewByElem(elem)
  }

  findViewsFromPoint(x: number, y: number): CellView[]
  findViewsFromPoint(p: PointLike): CellView[]
  findViewsFromPoint(x: number | PointLike, y?: number) {
      throw new Error("STUB");
  }

  findViewsInArea(
    x: number,
    y: number,
    width: number,
    height: number,
    options?: FindViewsInAreaOptions,
  ): CellView[]
  findViewsInArea(
    rect: RectangleLike,
    options?: FindViewsInAreaOptions,
  ): CellView[]
  findViewsInArea(
    x: number | RectangleLike,
    y?: number | FindViewsInAreaOptions,
    width?: number,
    height?: number,
    options?: FindViewsInAreaOptions,
  ) {
    const rect =
      typeof x === 'number'
        ? {
            x,
            y: y as number,
            width: width as number,
            height: height as number,
          }
        : x
    const localOptions =
      typeof x === 'number' ? options : (y as FindViewsInAreaOptions)
    return this.renderer.findViewsInArea(rect, localOptions)
  }

  // #endregion

  // #region transform

  /**
   * Returns the current transformation matrix of the graph.
   */
  matrix(): DOMMatrix
  /**
   * Sets new transformation with the given `matrix`
   */
  matrix(mat: DOMMatrix | Dom.MatrixLike | null): this
  matrix(mat?: DOMMatrix | Dom.MatrixLike | null) {
    if (typeof mat === 'undefined') {
      return this.transform.getMatrix()
    }
    this.transform.setMatrix(mat)
    return this
  }

  resize(width?: number, height?: number) {
    const scroller = this.getPlugin<any>('scroller')
    if (scroller) {
      scroller.resize(width, height)
    } else {
      this.transform.resize(width, height)
    }
    return this
  }

  scale(): Dom.Scale
  scale(sx: number, sy?: number, cx?: number, cy?: number): this
  scale(sx?: number, sy: number = sx as number, cx = 0, cy = 0) {
    if (typeof sx === 'undefined') {
      return this.transform.getScale()
    }
    this.transform.scale(sx, sy, cx, cy)
    return this
  }

  zoom(): number
  zoom(factor: number, options?: ZoomOptions): this
  zoom(factor?: number, options?: ZoomOptions) {
    const scroller = this.getPlugin<any>('scroller')
    if (scroller) {
      if (typeof factor === 'undefined') {
        return scroller.zoom()
      }
      scroller.zoom(factor, options)
    } else {
      if (typeof factor === 'undefined') {
        return this.transform.getZoom()
      }
      this.transform.zoom(factor, options)
    }

    return this
  }

  zoomTo(factor: number, options: Omit<ZoomOptions, 'absolute'> = {}) {
    const scroller = this.getPlugin<any>('scroller')
    if (scroller) {
      scroller.zoom(factor, { ...options, absolute: true })
    } else {
      this.transform.zoom(factor, { ...options, absolute: true })
    }

    return this
  }

  zoomToRect(
    rect: RectangleLike,
    options: ScaleContentToFitOptions & ScaleContentToFitOptions = {},
  ) {
    const scroller = this.getPlugin<any>('scroller')
    if (scroller) {
      scroller.zoomToRect(rect, options)
    } else {
      this.transform.zoomToRect(rect, options)
    }

    return this
  }

  zoomToFit(options: GetContentAreaOptions & ScaleContentToFitOptions = {}) {
    const scroller = this.getPlugin<any>('scroller')
    if (scroller) {
      scroller.zoomToFit(options)
    } else {
      this.transform.zoomToFit(options)
    }

    return this
  }

  rotate(): Dom.Rotation
  rotate(angle: number, cx?: number, cy?: number): this
  rotate(angle?: number, cx?: number, cy?: number) {
    if (typeof angle === 'undefined') {
      return this.transform.getRotation()
    }

    this.transform.rotate(angle, cx, cy)
    return this
  }

  translate(): Dom.Translation
  translate(tx: number, ty: number): this
  translate(tx?: number, ty?: number) {
    if (typeof tx === 'undefined') {
      return this.transform.getTranslation()
    }

    this.transform.translate(tx, ty as number)
    return this
  }

  translateBy(dx: number, dy: number): this {
      throw new Error("STUB");
  }

  getGraphArea() {
    const scroller = this.getPlugin<any>('scroller')
    if (scroller) {
      const area = scroller.getVisibleArea?.()
      if (area) return area
    }
    return this.transform.getGraphArea()
  }

  getContentArea(options: GetContentAreaOptions = {}) {
    return this.transform.getContentArea(options)
  }

  getContentBBox(options: GetContentAreaOptions = {}) {
    return this.transform.getContentBBox(options)
  }

  fitToContent(
    gridWidth?: number,
    gridHeight?: number,
    padding?: NumberExt.SideOptions,
    options?: FitToContentOptions,
  ): Rectangle
  fitToContent(options?: FitToContentFullOptions): Rectangle
  fitToContent(
    gridWidth?: number | FitToContentFullOptions,
    gridHeight?: number,
    padding?: NumberExt.SideOptions,
    options?: FitToContentOptions,
  ) {
    return this.transform.fitToContent(gridWidth, gridHeight, padding, options)
  }

  scaleContentToFit(options: ScaleContentToFitOptions = {}) {
    this.transform.scaleContentToFit(options)
    return this
  }

  /**
   * Position the center of graph to the center of the viewport.
   */
  center(options?: CenterOptions) {
    return this.centerPoint(options)
  }

  /**
   * Position the point (x,y) on the graph (in local coordinates) to the
   * center of the viewport. If only one of the coordinates is specified,
   * only center along the specified dimension and keep the other coordinate
   * unchanged.
   */
  centerPoint(x: number, y: null | number, options?: CenterOptions): this
  centerPoint(x: null | number, y: number, options?: CenterOptions): this
  centerPoint(optons?: CenterOptions): this
  centerPoint(
    x?: number | null | CenterOptions,
    y?: number | null,
    options?: CenterOptions,
  ) {
    const scroller = this.getPlugin<any>('scroller')
    if (scroller) {
      scroller.centerPoint(x as number, y as number, options)
    } else {
      this.transform.centerPoint(x as number, y as number)
    }

    return this
  }

  centerContent(options?: PositionContentOptions) {
    const scroller = this.getPlugin<any>('scroller')
    if (scroller) {
      scroller.centerContent(options)
    } else {
      this.transform.centerContent(options)
    }

    return this
  }

  centerCell(cell: Cell, options?: PositionContentOptions) {
    const scroller = this.getPlugin<any>('scroller')
    if (scroller) {
      scroller.centerCell(cell, options)
    } else {
      this.transform.centerCell(cell)
    }

    return this
  }

  positionPoint(
    point: PointLike,
    x: number | string,
    y: number | string,
    options: CenterOptions = {},
  ) {
    const scroller = this.getPlugin<any>('scroller')
    if (scroller) {
      scroller.positionPoint(point, x, y, options)
    } else {
      this.transform.positionPoint(point, x, y)
    }

    return this
  }

  positionRect(
    rect: RectangleLike,
    direction: Direction,
    options?: CenterOptions,
  ) {
    const scroller = this.getPlugin<any>('scroller')
    if (scroller) {
      scroller.positionRect(rect, direction, options)
    } else {
      this.transform.positionRect(rect, direction)
    }

    return this
  }

  positionCell(cell: Cell, direction: Direction, options?: CenterOptions) {
    const scroller = this.getPlugin<any>('scroller')
    if (scroller) {
      scroller.positionCell(cell, direction, options)
    } else {
      this.transform.positionCell(cell, direction)
    }

    return this
  }

  positionContent(pos: Direction, options?: PositionContentOptions) {
    const scroller = this.getPlugin<any>('scroller')
    if (scroller) {
      scroller.positionContent(pos, options)
    } else {
      this.transform.positionContent(pos, options)
    }

    return this
  }

  // #endregion

  // #region coord

  snapToGrid(p: PointLike): Point
  snapToGrid(x: number, y: number): Point
  snapToGrid(x: number | PointLike, y?: number) {
    return this.coord.snapToGrid(x, y)
  }

  pageToLocal(rect: RectangleLike): Rectangle
  pageToLocal(x: number, y: number, width: number, height: number): Rectangle
  pageToLocal(p: PointLike): Point
  pageToLocal(x: number, y: number): Point
  pageToLocal(
    x: number | PointLike | RectangleLike,
    y?: number,
    width?: number,
    height?: number,
  ) {
    if (Rectangle.isRectangleLike(x)) {
      return this.coord.pageToLocalRect(x)
    }

    if (
      typeof x === 'number' &&
      typeof y === 'number' &&
      typeof width === 'number' &&
      typeof height === 'number'
    ) {
      return this.coord.pageToLocalRect(x, y, width, height)
    }

    return this.coord.pageToLocalPoint(x, y)
  }

  localToPage(rect: RectangleLike): Rectangle
  localToPage(x: number, y: number, width: number, height: number): Rectangle
  localToPage(p: PointLike): Point
  localToPage(x: number, y: number): Point
  localToPage(
    x: number | PointLike | RectangleLike,
    y?: number,
    width?: number,
    height?: number,
  ) {
      throw new Error("STUB");
  }

  clientToLocal(rect: RectangleLike): Rectangle
  clientToLocal(x: number, y: number, width: number, height: number): Rectangle
  clientToLocal(p: PointLike): Point
  clientToLocal(x: number, y: number): Point
  clientToLocal(
    x: number | PointLike | RectangleLike,
    y?: number,
    width?: number,
    height?: number,
  ) {
    if (Rectangle.isRectangleLike(x)) {
      return this.coord.clientToLocalRect(x)
    }

    if (
      typeof x === 'number' &&
      typeof y === 'number' &&
      typeof width === 'number' &&
      typeof height === 'number'
    ) {
      return this.coord.clientToLocalRect(x, y, width, height)
    }

    return this.coord.clientToLocalPoint(x, y)
  }

  localToClient(rect: RectangleLike): Rectangle
  localToClient(x: number, y: number, width: number, height: number): Rectangle
  localToClient(p: PointLike): Point
  localToClient(x: number, y: number): Point
  localToClient(
    x: number | PointLike | RectangleLike,
    y?: number,
    width?: number,
    height?: number,
  ) {
      throw new Error("STUB");
  }

  /**
   * Transform the rectangle `rect` defined in the local coordinate system to
   * the graph coordinate system.
   */
  localToGraph(rect: RectangleLike): Rectangle
  /**
   * Transform the rectangle `x`, `y`, `width`, `height` defined in the local
   * coordinate system to the graph coordinate system.
   */
  localToGraph(x: number, y: number, width: number, height: number): Rectangle
  /**
   * Transform the point `p` defined in the local coordinate system to
   * the graph coordinate system.
   */
  localToGraph(p: PointLike): Point
  /**
   * Transform the point `x`, `y` defined in the local coordinate system to
   * the graph coordinate system.
   */
  localToGraph(x: number, y: number): Point
  localToGraph(
    x: number | PointLike | RectangleLike,
    y?: number,
    width?: number,
    height?: number,
  ) {
    if (Rectangle.isRectangleLike(x)) {
      return this.coord.localToGraphRect(x)
    }

    if (
      typeof x === 'number' &&
      typeof y === 'number' &&
      typeof width === 'number' &&
      typeof height === 'number'
    ) {
      return this.coord.localToGraphRect(x, y, width, height)
    }

    return this.coord.localToGraphPoint(x, y)
  }

  graphToLocal(rect: RectangleLike): Rectangle
  graphToLocal(x: number, y: number, width: number, height: number): Rectangle
  graphToLocal(p: PointLike): Point
  graphToLocal(x: number, y: number): Point
  graphToLocal(
    x: number | PointLike | RectangleLike,
    y?: number,
    width?: number,
    height?: number,
  ) {
    if (Rectangle.isRectangleLike(x)) {
      return this.coord.graphToLocalRect(x)
    }

    if (
      typeof x === 'number' &&
      typeof y === 'number' &&
      typeof width === 'number' &&
      typeof height === 'number'
    ) {
      return this.coord.graphToLocalRect(x, y, width, height)
    }
    return this.coord.graphToLocalPoint(x, y)
  }

  clientToGraph(rect: RectangleLike): Rectangle
  clientToGraph(x: number, y: number, width: number, height: number): Rectangle
  clientToGraph(p: PointLike): Point
  clientToGraph(x: number, y: number): Point
  clientToGraph(
    x: number | PointLike | RectangleLike,
    y?: number,
    width?: number,
    height?: number,
  ) {
    if (Rectangle.isRectangleLike(x)) {
      return this.coord.clientToGraphRect(x)
    }
    if (
      typeof x === 'number' &&
      typeof y === 'number' &&
      typeof width === 'number' &&
      typeof height === 'number'
    ) {
      return this.coord.clientToGraphRect(x, y, width, height)
    }
    return this.coord.clientToGraphPoint(x, y)
  }

  // #endregion

  // #region defs

  defineFilter(options: FilterOptions) {
    return this.defs.filter(options)
  }

  defineGradient(options: GradientOptions) {
    return this.defs.gradient(options)
  }

  defineMarker(options: MarkerOptions) {
    return this.defs.marker(options)
  }

  // #endregion

  // #region grid

  getGridSize() {
    return this.grid.getGridSize()
  }

  setGridSize(gridSize: number) {
    this.grid.setGridSize(gridSize)
    return this
  }

  showGrid() {
      throw new Error("STUB");
  }

  hideGrid() {
      throw new Error("STUB");
  }

  clearGrid() {
      throw new Error("STUB");
  }

  drawGrid(options?: GridDrawOptions) {
    this.grid.draw(options)
    return this
  }

  // #endregion

  // #region background

  updateBackground() {
      throw new Error("STUB");
  }

  drawBackground(options?: BackgroundOptions, onGraph?: boolean) {
    const scroller = this.getPlugin<any>('scroller')
    if (scroller != null && (this.options.background == null || !onGraph)) {
      scroller.drawBackground(options, onGraph)
    } else {
      this.background.draw(options)
    }
    return this
  }

  clearBackground(onGraph?: boolean) {
      throw new Error("STUB");
  }

  // #endregion

  // #region virtual-render

  enableVirtualRender() {
      throw new Error("STUB");
  }

  disableVirtualRender() {
      throw new Error("STUB");
  }

  // #endregion

  // #region mousewheel

  isMouseWheelEnabled() {
      throw new Error("STUB");
  }

  enableMouseWheel() {
      throw new Error("STUB");
  }

  disableMouseWheel() {
      throw new Error("STUB");
  }

  toggleMouseWheel(enabled?: boolean) {
      throw new Error("STUB");
  }

  // #endregion

  // #region panning

  isPannable() {
      throw new Error("STUB");
  }

  enablePanning() {
      throw new Error("STUB");
  }

  disablePanning() {
    const scroller = this.getPlugin<any>('scroller')
    if (scroller) {
      scroller.disablePanning()
    } else {
      this.panning.disablePanning()
    }
    return this
  }

  togglePanning(pannable?: boolean) {
      throw new Error("STUB");
  }

  // #endregion

  // #region plugin

  handleScrollerPluginStateChange(
    plugin: GraphPlugin,
    isBeingEnabled: boolean,
  ) {
    if (plugin.name === 'scroller') {
      if (isBeingEnabled) {
        this.virtualRender.onScrollerReady(plugin)
      } else {
        this.virtualRender.unbindScroller()
      }
    }
  }

  use(plugin: GraphPlugin, ...options: any[]) {
    if (!this.installedPlugins.has(plugin)) {
      this.installedPlugins.add(plugin)
      plugin.init(this, ...options)
      this.handleScrollerPluginStateChange(plugin, true)
    }
    return this
  }

  getPlugin<T extends GraphPlugin>(pluginName: string): T | undefined {
    return Array.from(this.installedPlugins).find(
      (plugin) => { throw new Error("STUB"); },
    ) as T
  }

  getPlugins<T extends GraphPlugin[]>(pluginName: string[]): T | undefined {
    return Array.from(this.installedPlugins).filter((plugin) =>
      { throw new Error("STUB"); },
    ) as T
  }

  enablePlugins(plugins: string[] | string) {
    let postPlugins = plugins
    if (!Array.isArray(postPlugins)) {
      postPlugins = [postPlugins]
    }
    const aboutToChangePlugins = this.getPlugins(postPlugins)
    aboutToChangePlugins?.forEach((plugin) => {
        throw new Error("STUB");
    })
    return this
  }

  disablePlugins(plugins: string[] | string) {
    let postPlugins = plugins
    if (!Array.isArray(postPlugins)) {
      postPlugins = [postPlugins]
    }
    const aboutToChangePlugins = this.getPlugins(postPlugins)
    aboutToChangePlugins?.forEach((plugin) => {
        throw new Error("STUB");
    })
    return this
  }

  isPluginEnabled(pluginName: string) {
      throw new Error("STUB");
  }

  disposePlugins(plugins: string[] | string) {
      throw new Error("STUB");
  }

  // #endregion

  // #region dispose

  @disposable()
  dispose(clean = true) {
    if (clean) {
      this.model.dispose()
    }

    this.css.dispose()
    this.defs.dispose()
    this.grid.dispose()
    this.coord.dispose()
    this.transform.dispose()
    this.highlight.dispose()
    this.background.dispose()
    this.mousewheel.dispose()
    this.panning.dispose()
    this.view.dispose()
    this.renderer.dispose()

    this.installedPlugins.forEach((plugin) => {
        throw new Error("STUB");
    })
  }

  // #endregion
}
