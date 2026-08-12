/* eslint-disable @typescript-eslint/no-unused-vars */

import {
  ArrayExt,
  Dom,
  disposable,
  FunctionExt,
  type Nilable,
  ObjectExt,
  Util,
} from '../../common'
import { Rectangle } from '../../geometry'
import type { Graph } from '../../graph'
import type {
  Cell,
  CellBaseEventArgs,
  CellMutateOptions,
} from '../../model/cell'
import type {
  Edge,
  TerminalCellData,
  TerminalData,
  TerminalType,
} from '../../model/edge'
import type { Model } from '../../model/model'
import type { CellAttrs, SimpleAttrs } from '../../registry/attr'
import { Registry } from '../../registry/registry'
import { AttrManager, type AttrManagerUpdateOptions } from '../attr'
import { Cache } from '../cache'
import type { EdgeView } from '../edge'
import {
  FlagManager,
  type FlagManagerAction,
  type FlagManagerActions,
} from '../flag'
import { Markup, type MarkupJSONMarkup, type MarkupSelectors } from '../markup'
import type { NodeView } from '../node'
import { ToolsView, type ToolsViewOptions } from '../tool'
import type { ToolsViewUpdateOptions } from '../tool/tool-view'
import { View } from '../view'
import { createViewElement } from '../view/util'
import type {
  CellViewDefinition,
  CellViewEventArgs,
  CellViewHighlightOptions,
  CellViewInteractionNames,
  CellViewMouseEventArgs,
  CellViewMousePositionEventArgs,
  CellViewOptions,
} from './type'

export * from './type'

export class CellView<
  Entity extends Cell = Cell,
  Options extends CellViewOptions = CellViewOptions,
> extends View<CellViewEventArgs> {
  protected static defaults: Partial<CellViewOptions> = {
    isSvgElement: true,
    rootSelector: 'root',
    priority: 0,
    bootstrap: [],
    actions: {},
  }

  public static registry = Registry.create<CellViewDefinition>({
    type: 'view',
  })

  public static getDefaults() {
    return CellView.defaults
  }

  public static isCellView(instance: any): instance is CellView {
    if (instance == null) {
      return false
    }

    if (instance instanceof CellView) {
      return true
    }

    const tag = instance[Symbol.toStringTag]
    const view = instance as CellView

    if (
      (tag == null || tag === CellViewToStringTag) &&
      typeof view.isNodeView === 'function' &&
      typeof view.isEdgeView === 'function' &&
      typeof view.confirmUpdate === 'function'
    ) {
      return true
    }

    return false
  }

  public static config<T extends CellViewOptions = CellViewOptions>(
    options: Partial<T>,
  ) {
    CellView.defaults = CellView.getOptions(options)
  }

  public static getOptions<T extends CellViewOptions = CellViewOptions>(
    options: Partial<T>,
  ): T {
    const mergeActions = <T>(arr1: T | T[], arr2?: T | T[]) => {
      if (arr2 != null) {
        return ArrayExt.uniq([
          ...(Array.isArray(arr1) ? arr1 : [arr1]),
          ...(Array.isArray(arr2) ? arr2 : [arr2]),
        ])
      }
      return Array.isArray(arr1) ? [...arr1] : [arr1]
    }

    const ret = ObjectExt.cloneDeep(CellView.getDefaults()) as T
    const { bootstrap, actions, events, documentEvents, ...others } = options

    if (bootstrap) {
      ret.bootstrap = mergeActions(ret.bootstrap, bootstrap)
    }

    if (actions) {
      Object.entries(actions).forEach(([key, val]) => {
          throw new Error("STUB");
      })
    }

    if (events) {
      ret.events = { ...ret.events, ...events }
    }

    if (options.documentEvents) {
      ret.documentEvents = { ...ret.documentEvents, ...documentEvents }
    }

    return ObjectExt.merge(ret, others) as T
  }

  public graph: Graph
  public cell: Entity
  protected selectors: MarkupSelectors
  protected readonly options: Options
  protected readonly flag: FlagManager
  protected readonly attr: AttrManager
  protected readonly cache: Cache

  protected get [Symbol.toStringTag]() {
    return CellViewToStringTag
  }

  constructor(cell: Entity, options: Partial<Options> = {}) {
      throw new Error("STUB");
  }

  protected init() {}

  protected onRemove() {
    this.removeTools()
  }

  public get priority() {
      throw new Error("STUB");
  }

  protected get rootSelector() {
      throw new Error("STUB");
  }

  protected getConstructor<T extends CellViewDefinition>() {
      throw new Error("STUB");
  }

  protected ensureOptions(options: Partial<Options>) {
      throw new Error("STUB");
  }

  protected getContainerTagName(): string {
      throw new Error("STUB");
  }

  protected getContainerStyle():
    | Nilable<Record<string, string | number>>
    | undefined {
      throw new Error("STUB");
  }

  protected getContainerAttrs(): Nilable<SimpleAttrs> {
      throw new Error("STUB");
  }

  protected getContainerClassName(): Nilable<string | string[]> {
      throw new Error("STUB");
  }

  protected ensureContainer() {
      throw new Error("STUB");
  }

  protected setContainer(container: Element) {
      throw new Error("STUB");
  }

  isNodeView(): this is NodeView {
    return false
  }

  isEdgeView(): this is EdgeView {
    return false
  }

  render() {
    return this
  }

  confirmUpdate(flag: number, options: object = {}) {
    return 0
  }

  getBootstrapFlag() {
    return this.flag.getBootstrapFlag()
  }

  getFlag(actions: FlagManagerActions) {
    return this.flag.getFlag(actions)
  }

  hasAction(flag: number, actions: FlagManagerActions) {
    return this.flag.hasAction(flag, actions)
  }

  removeAction(flag: number, actions: FlagManagerActions) {
    return this.flag.removeAction(flag, actions)
  }

  handleAction(
    flag: number,
    action: FlagManagerAction,
    handle: () => void,
    additionalRemovedActions?: FlagManagerActions | null,
  ) {
    if (this.hasAction(flag, action)) {
      handle()
      const removedFlags = [action]
      if (additionalRemovedActions) {
        if (typeof additionalRemovedActions === 'string') {
          removedFlags.push(additionalRemovedActions)
        } else {
          removedFlags.push(...additionalRemovedActions)
        }
      }
      return this.removeAction(flag, removedFlags)
    }
    return flag
  }

  protected setup() {
    this.cell.on('changed', this.onCellChanged, this)
  }

  protected onCellChanged({ options }: CellBaseEventArgs['changed']) {
      throw new Error("STUB");
  }

  protected onAttrsChange(options: CellMutateOptions) {
      throw new Error("STUB");
  }

  parseJSONMarkup(
    markup: MarkupJSONMarkup | MarkupJSONMarkup[],
    rootElem?: Element,
  ) {
    const result = Markup.parseJSONMarkup(markup)
    const selectors = result.selectors
    const rootSelector = this.rootSelector
    if (rootElem && rootSelector) {
      if (selectors[rootSelector]) {
        throw new Error('Invalid root selector')
      }
      selectors[rootSelector] = rootElem
    }
    return result
  }

  can(feature: CellViewInteractionNames): boolean {
    let interacting = this.graph.options.interacting

    if (typeof interacting === 'function') {
      interacting = FunctionExt.call(interacting, this.graph, this)
    }

    if (typeof interacting === 'object') {
      let val = interacting[feature]
      if (typeof val === 'function') {
        val = FunctionExt.call(val, this.graph, this)
      }
      return val !== false
    }

    if (typeof interacting === 'boolean') {
      return interacting
    }

    return false
  }

  cleanCache() {
    this.cache.clean()
    return this
  }

  getCache(elem: Element) {
      throw new Error("STUB");
  }

  getDataOfElement(elem: Element) {
    return this.cache.getData(elem)
  }

  getMatrixOfElement(elem: Element) {
    return this.cache.getMatrix(elem)
  }

  getShapeOfElement(elem: SVGElement) {
    return this.cache.getShape(elem)
  }

  getBoundingRectOfElement(elem: Element) {
    return this.cache.getBoundingRect(elem)
  }

  getBBoxOfElement(elem: Element) {
    const rect = this.getBoundingRectOfElement(elem)
    const matrix = this.getMatrixOfElement(elem)
    const rm = this.getRootRotatedMatrix()
    const tm = this.getRootTranslatedMatrix()
    return Util.transformRectangle(rect, tm.multiply(rm).multiply(matrix))
  }

  getUnrotatedBBoxOfElement(elem: SVGElement) {
    const rect = this.getBoundingRectOfElement(elem)
    const matrix = this.getMatrixOfElement(elem)
    const tm = this.getRootTranslatedMatrix()
    return Util.transformRectangle(rect, tm.multiply(matrix))
  }

  getBBox(options: { useCellGeometry?: boolean } = {}) {
    let bbox: Rectangle
    if (options.useCellGeometry) {
      const cell = this.cell
      const angle = cell.isNode() ? cell.getAngle() : 0
      bbox = cell.getBBox().bbox(angle)
    } else {
      bbox = this.getBBoxOfElement(this.container)
    }

    return this.graph.coord.localToGraphRect(bbox)
  }

  getRootTranslatedMatrix() {
    const cell = this.cell
    const pos = cell.isNode() ? cell.getPosition() : { x: 0, y: 0 }
    return Dom.createSVGMatrix().translate(pos.x, pos.y)
  }

  getRootRotatedMatrix() {
    let matrix = Dom.createSVGMatrix()
    const cell = this.cell
    const angle = cell.isNode() ? cell.getAngle() : 0
    if (angle) {
      const bbox = cell.getBBox()
      const cx = bbox.width / 2
      const cy = bbox.height / 2
      matrix = matrix.translate(cx, cy).rotate(angle).translate(-cx, -cy)
    }
    return matrix
  }

  findMagnet(elem: Element = this.container) {
    return this.findByAttr('magnet', elem)
  }

  updateAttrs(
    rootNode: Element,
    attrs: CellAttrs,
    options: Partial<AttrManagerUpdateOptions> = {},
  ) {
    if (options.rootBBox == null) {
      options.rootBBox = new Rectangle()
    }

    if (options.selectors == null) {
      options.selectors = this.selectors
    }

    this.attr.update(rootNode, attrs, options as AttrManagerUpdateOptions)
  }

  isEdgeElement(magnet?: Element | null) {
    return this.cell.isEdge() && (magnet == null || magnet === this.container)
  }

  // #region highlight

  protected prepareHighlight(
    elem?: Element | null,
    options: CellViewHighlightOptions = {},
  ) {
    const magnet = elem || this.container
    options.partial = magnet === this.container
    return magnet
  }

  highlight(elem?: Element | null, options: CellViewHighlightOptions = {}) {
    const magnet = this.prepareHighlight(elem, options)
    this.notify('cell:highlight', {
      magnet,
      options,
      view: this,
      cell: this.cell,
    })
    if (this.isEdgeView()) {
      this.notify('edge:highlight', {
        magnet,
        options,
        view: this,
        edge: this.cell,
        cell: this.cell,
      })
    } else if (this.isNodeView()) {
      this.notify('node:highlight', {
        magnet,
        options,
        view: this,
        node: this.cell,
        cell: this.cell,
      })
    }
    return this
  }

  unhighlight(elem?: Element | null, options: CellViewHighlightOptions = {}) {
    const magnet = this.prepareHighlight(elem, options)
    this.notify('cell:unhighlight', {
      magnet,
      options,
      view: this,
      cell: this.cell,
    })
    if (this.isNodeView()) {
      this.notify('node:unhighlight', {
        magnet,
        options,
        view: this,
        node: this.cell,
        cell: this.cell,
      })
    } else if (this.isEdgeView()) {
      this.notify('edge:unhighlight', {
        magnet,
        options,
        view: this,
        edge: this.cell,
        cell: this.cell,
      })
    }
    return this
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  notifyUnhighlight(magnet: Element, options: CellViewHighlightOptions) {
      throw new Error("STUB");
  }

  // #endregion

  getEdgeTerminal(
    magnet: Element,
    x: number,
    y: number,
    edge: Edge,
    type: TerminalType,
  ) {
    const cell = this.cell
    const portId = this.findAttr('port', magnet)
    const selector = magnet.getAttribute('data-selector')
    const terminal: TerminalCellData = { cell: cell.id }

    if (selector != null) {
      terminal.magnet = selector
    }

    if (portId != null) {
      terminal.port = portId
      if (cell.isNode()) {
        if (!cell.hasPort(portId) && selector == null) {
          // port created via the `port` attribute (not API)
          terminal.selector = this.getSelector(magnet)
        }
      }
    } else if (selector == null && this.container !== magnet) {
      terminal.selector = this.getSelector(magnet)
    }

    return terminal
  }

  getMagnetFromEdgeTerminal(terminal: TerminalData) {
    const cell = this.cell
    const root = this.container
    const portId = (terminal as TerminalCellData).port
    let selector = terminal.magnet
    let magnet: any
    if (portId != null && cell.isNode() && cell.hasPort(portId)) {
      magnet = (this as any).findPortElem(portId, selector) || root
    } else {
      if (!selector) {
        selector = terminal.selector
      }
      if (!selector && portId != null) {
        selector = `[port="${portId}"]`
      }
      magnet = this.findOne(selector, root, this.selectors)
    }

    return magnet
  }

  // #region tools

  protected tools: ToolsView | null

  hasTools(name?: string) {
    const tools = this.tools
    if (tools == null) {
      return false
    }

    if (name == null) {
      return true
    }

    return tools.name === name
  }

  addTools(options: ToolsViewOptions | null): this
  addTools(tools: ToolsView | null): this
  addTools(config: ToolsView | ToolsViewOptions | null) {
    this.removeTools()
    if (config) {
      if (!this.can('toolsAddable')) {
        return this
      }
      const tools = ToolsView.isToolsView(config)
        ? config
        : new ToolsView(config)
      this.tools = tools
      tools.config({ view: this })
      tools.mount()
    }
    return this
  }

  updateTools(options: ToolsViewUpdateOptions = {}) {
    if (this.tools) {
      this.tools.update(options)
    }
    return this
  }

  removeTools() {
    if (this.tools) {
      this.tools.remove()
      this.tools = null
    }
    return this
  }

  hideTools() {
      throw new Error("STUB");
  }

  showTools() {
      throw new Error("STUB");
  }

  protected renderTools() {
    const tools = this.cell.getTools()
    this.addTools(tools as ToolsViewOptions)
    return this
  }

  // #endregion

  // #region events

  notify<Key extends keyof CellViewEventArgs>(
    name: Key,
    args: CellViewEventArgs[Key],
  ): this
  notify(name: Exclude<string, keyof CellViewEventArgs>, args: any): this
  notify<Key extends keyof CellViewEventArgs>(
    name: Key,
    args: CellViewEventArgs[Key],
  ) {
    this.trigger(name, args)
    this.graph.trigger(name, args)
    return this
  }

  protected getEventArgs<E>(e: E): CellViewMouseEventArgs<E>
  protected getEventArgs<E>(
    e: E,
    x: number,
    y: number,
  ): CellViewMousePositionEventArgs<E>
  protected getEventArgs<E>(e: E, x?: number, y?: number) {
    const view = this // eslint-disable-line @typescript-eslint/no-this-alias
    const cell = view.cell
    if (x == null || y == null) {
      return { e, view, cell } as CellViewMouseEventArgs<E>
    }
    return { e, x, y, view, cell } as CellViewMousePositionEventArgs<E>
  }

  onClick(e: Dom.ClickEvent, x: number, y: number) {
    this.notify('cell:click', this.getEventArgs(e, x, y))
  }

  onDblClick(e: Dom.DoubleClickEvent, x: number, y: number) {
      throw new Error("STUB");
  }

  onContextMenu(e: Dom.ContextMenuEvent, x: number, y: number) {
      throw new Error("STUB");
  }

  protected cachedModelForMouseEvent: Model | null

  onMouseDown(e: Dom.MouseDownEvent, x: number, y: number) {
    if (this.cell.model) {
      this.cachedModelForMouseEvent = this.cell.model
      this.cachedModelForMouseEvent.startBatch('mouse')
    }

    this.notify('cell:mousedown', this.getEventArgs(e, x, y))
  }

  onMouseUp(e: Dom.MouseUpEvent, x: number, y: number) {
    this.notify('cell:mouseup', this.getEventArgs(e, x, y))

    if (this.cachedModelForMouseEvent) {
      this.cachedModelForMouseEvent.stopBatch('mouse', { cell: this.cell })
      this.cachedModelForMouseEvent = null
    }
  }

  onMouseMove(e: Dom.MouseMoveEvent, x: number, y: number) {
    this.notify('cell:mousemove', this.getEventArgs(e, x, y))
  }

  onMouseOver(e: Dom.MouseOverEvent) {
      throw new Error("STUB");
  }

  onMouseOut(e: Dom.MouseOutEvent) {
      throw new Error("STUB");
  }

  onMouseEnter(e: Dom.MouseEnterEvent) {
    this.notify('cell:mouseenter', this.getEventArgs(e))
  }

  onMouseLeave(e: Dom.MouseLeaveEvent) {
    this.notify('cell:mouseleave', this.getEventArgs(e))
  }

  onMouseWheel(e: Dom.EventObject, x: number, y: number, delta: number) {
      throw new Error("STUB");
  }

  onCustomEvent(e: Dom.MouseDownEvent, name: string, x: number, y: number) {
      throw new Error("STUB");
  }

  onMagnetMouseDown(
    e: Dom.MouseDownEvent,
    magnet: Element,
    x: number,
    y: number,
  ) {
      throw new Error("STUB");
  }

  onMagnetDblClick(
    e: Dom.DoubleClickEvent,
    magnet: Element,
    x: number,
    y: number,
  ) {
      throw new Error("STUB");
  }

  onMagnetContextMenu(
    e: Dom.ContextMenuEvent,
    magnet: Element,
    x: number,
    y: number,
  ) {
      throw new Error("STUB");
  }

  onLabelMouseDown(e: Dom.MouseDownEvent, x: number, y: number) {
      throw new Error("STUB");
  }

  checkMouseleave(e: Dom.EventObject) {
    const target = this.getEventTarget(e, { fromPoint: true })
    const view = this.graph.findViewByElem(target)
    if (view === this) {
      return
    }

    // Leaving the current view
    this.onMouseLeave(e as Dom.MouseLeaveEvent)
    if (!view) {
      return
    }

    // Entering another view
    view.onMouseEnter(e as Dom.MouseEnterEvent)
  }

  @disposable()
  dispose() {
    this.cell.off('changed', this.onCellChanged, this)
  }

  // #endregion
}

export const CellViewToStringTag = `X6.${CellView.name}`
