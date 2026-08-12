import { CssLoader, Dom, disposable, FunctionExt } from '../../common'
import {
  type EventArgs,
  Graph,
  type Options as GraphOptions,
  type GraphPlugin,
} from '../../graph'
import { type Cell, Model, Node, type NodeMetadata } from '../../model'
import { View } from '../../view'
import { Dnd, DndDefaults } from '../dnd'
import type { Scroller } from '../scroller'
import { grid } from './grid'
import { content } from './style/raw'
import type {
  StencilFilter,
  StencilFilters,
  StencilGroup,
  StencilOptions,
} from './type'

export const ClassNames = {
  base: 'widget-stencil',
  title: `widget-stencil-title`,
  search: `widget-stencil-search`,
  searchText: `widget-stencil-search-text`,
  content: `widget-stencil-content`,
  group: `widget-stencil-group`,
  groupTitle: `widget-stencil-group-title`,
  groupContent: `widget-stencil-group-content`,
}

export const DefaultGroupName = '__default__'

export const DefaultOptions: Partial<StencilOptions> = {
  stencilGraphWidth: 200,
  stencilGraphHeight: 800,
  title: 'Stencil',
  collapsable: false,
  placeholder: 'Search',
  notFoundText: 'No matches found',

  layout(model, group) {
    const options = {
      columnWidth: (this.options.stencilGraphWidth as number) / 2 - 10,
      columns: 2,
      rowHeight: 80,
      resizeToFit: false,
      dx: 10,
      dy: 10,
    }

    grid(model, {
      ...options,
      ...this.options.layoutOptions,
      ...(group ? group.layoutOptions : {}),
    })
  },
  ...DndDefaults,
}

export class Stencil extends View implements GraphPlugin {
  public name = 'stencil'
  public options: StencilOptions
  public dnd: Dnd
  protected graphs: { [groupName: string]: Graph }
  protected groups: { [groupName: string]: HTMLElement }
  protected content: HTMLDivElement

  protected get targetScroller() {
      throw new Error("STUB");
  }

  protected get targetGraph() {
      throw new Error("STUB");
  }

  protected get targetModel() {
      throw new Error("STUB");
  }

  constructor(options: Partial<StencilOptions> = {}) {
      throw new Error("STUB");
  }

  init() {
    this.dnd = new Dnd(this.options)
    this.onSearch = FunctionExt.debounce(this.onSearch, 200)

    this.initContainer()
    this.initSearch()
    this.initContent()
    this.initGroups()
    this.setTitle()
    this.startListening()
  }

  // #region api

  load(groups: { [groupName: string]: (Node | NodeMetadata)[] }): this
  load(nodes: (Node | NodeMetadata)[], groupName?: string): this
  load(
    data:
      | { [groupName: string]: (Node | NodeMetadata)[] }
      | (Node | NodeMetadata)[],
    groupName?: string,
  ) {
    if (Array.isArray(data)) {
      this.loadGroup(data, groupName)
    } else if (this.options.groups) {
      Object.keys(this.options.groups).forEach((groupName) => {
          throw new Error("STUB");
      })
    }
    return this
  }

  unload(groups: { [groupName: string]: (Node | NodeMetadata)[] }): this
  unload(nodes: (Node | NodeMetadata)[], groupName?: string): this
  unload(
    data:
      | { [groupName: string]: (Node | NodeMetadata)[] }
      | (Node | NodeMetadata)[],
    groupName?: string,
  ) {
      throw new Error("STUB");
  }

  toggleGroup(groupName: string) {
      throw new Error("STUB");
  }

  collapseGroup(groupName: string) {
      throw new Error("STUB");
  }

  expandGroup(groupName: string) {
      throw new Error("STUB");
  }

  isGroupCollapsable(groupName: string) {
      throw new Error("STUB");
  }

  isGroupCollapsed(groupName: string) {
      throw new Error("STUB");
  }

  collapseGroups() {
      throw new Error("STUB");
  }

  expandGroups() {
      throw new Error("STUB");
  }

  resizeGroup(groupName: string, size: { width: number; height: number }) {
      throw new Error("STUB");
  }

  addGroup(group: StencilGroup | StencilGroup[]) {
      throw new Error("STUB");
  }

  removeGroup(groupName: string | string[]) {
      throw new Error("STUB");
  }

  // #endregion

  protected initContainer() {
    this.container = document.createElement('div')
    Dom.addClass(this.container, this.prefixClassName(ClassNames.base))
    Dom.attr(
      this.container,
      'data-not-found-text',
      this.options.notFoundText || 'No matches found',
    )
  }

  protected initContent() {
    this.content = document.createElement('div')
    Dom.addClass(this.content, this.prefixClassName(ClassNames.content))
    Dom.appendTo(this.content, this.container)
  }

  protected buildGraphConfig(group?: StencilGroup) {
    const globalGraphOptions = this.options.stencilGraphOptions || {}
    const graphOptionsInGroup = group?.graphOptions
    const mergedGraphOptions = {
      ...globalGraphOptions,
      ...graphOptionsInGroup,
    }
    if (mergedGraphOptions.panning == null) {
      mergedGraphOptions.panning = false
    }
    const width = (group && group.graphWidth) || this.options.stencilGraphWidth
    const height =
      (group && group.graphHeight) || this.options.stencilGraphHeight
    const model = mergedGraphOptions.model || new Model()
    return { mergedGraphOptions, width, height, model }
  }

  protected createStencilGraph(
    mergedGraphOptions: Partial<GraphOptions>,
    width: number,
    height: number,
    model: Model,
  ) {
    const graph = new Graph({
      ...mergedGraphOptions,
      container: document.createElement('div'),
      model,
      width,
      height,
      interacting: false,
      preventDefaultBlankAction: false,
    })
    this.registerGraphEvents(graph)
    return graph
  }

  protected initSearch() {
    if (this.options.search) {
      Dom.addClass(this.container, 'searchable')
      Dom.append(this.container, this.renderSearch())
    }
  }

  protected initGroup(group: StencilGroup) {
    const groupElem = document.createElement('div')
    Dom.addClass(groupElem, this.prefixClassName(ClassNames.group))
    Dom.attr(groupElem, 'data-name', group.name)

    if (
      (group.collapsable == null && this.options.collapsable) ||
      group.collapsable !== false
    ) {
      Dom.addClass(groupElem, 'collapsable')
    }

    Dom.toggleClass(groupElem, 'collapsed', group.collapsed === true)

    const title = document.createElement('h3')
    Dom.addClass(title, this.prefixClassName(ClassNames.groupTitle))
    title.innerHTML = group.title || group.name

    const content = document.createElement('div')
    Dom.addClass(content, this.prefixClassName(ClassNames.groupContent))

    const { mergedGraphOptions, width, height, model } =
      this.buildGraphConfig(group)
    const graph = this.createStencilGraph(
      mergedGraphOptions,
      width as number,
      height as number,
      model,
    )

    Dom.append(content, graph.container)
    Dom.append(groupElem, [title, content])
    Dom.appendTo(groupElem, this.content)

    this.groups[group.name] = groupElem
    this.graphs[group.name] = graph
  }

  protected initGroups() {
    this.clearGroups()
    this.setCollapsableState()

    if (this.options.groups && this.options.groups.length) {
      this.options.groups.forEach((group) => {
          throw new Error("STUB");
      })
    } else {
      const { mergedGraphOptions, width, height, model } =
        this.buildGraphConfig()
      const graph = this.createStencilGraph(
        mergedGraphOptions,
        width as number,
        height as number,
        model,
      )
      Dom.append(this.content, graph.container)
      this.graphs[DefaultGroupName] = graph
    }
  }

  protected setCollapsableState() {
    this.options.collapsable =
      this.options.collapsable &&
      this.options.groups &&
      this.options.groups.some((group) => { throw new Error("STUB"); })

    if (this.options.collapsable) {
      Dom.addClass(this.container, 'collapsable')
      const collapsed =
        this.options.groups &&
        this.options.groups.every(
          (group) => { throw new Error("STUB"); },
        )
      if (collapsed) {
        Dom.addClass(this.container, 'collapsed')
      } else {
        Dom.removeClass(this.container, 'collapsed')
      }
    } else {
      Dom.removeClass(this.container, 'collapsable')
    }
  }

  protected setTitle() {
    const title = document.createElement('div')
    Dom.addClass(title, this.prefixClassName(ClassNames.title))
    title.innerHTML = this.options.title
    Dom.appendTo(title, this.container)
  }

  protected renderSearch() {
    const elem = document.createElement('div')
    Dom.addClass(elem, this.prefixClassName(ClassNames.search))
    const input = document.createElement('input')
    Dom.attr(input, {
      type: 'search',
      placeholder: this.options.placeholder || 'Search',
    })
    Dom.addClass(input, this.prefixClassName(ClassNames.searchText))
    Dom.append(elem, input)

    return elem
  }

  protected startListening() {
    const title = this.prefixClassName(ClassNames.title)
    const searchText = this.prefixClassName(ClassNames.searchText)
    const groupTitle = this.prefixClassName(ClassNames.groupTitle)

    this.delegateEvents({
      [`click .${title}`]: 'onTitleClick',
      [`touchstart .${title}`]: 'onTitleClick',
      [`click .${groupTitle}`]: 'onGroupTitleClick',
      [`touchstart .${groupTitle}`]: 'onGroupTitleClick',
      [`input .${searchText}`]: 'onSearch',
      [`focusin .${searchText}`]: 'onSearchFocusIn',
      [`focusout .${searchText}`]: 'onSearchFocusOut',
    })
  }

  protected stopListening() {
    this.undelegateEvents()
  }

  protected registerGraphEvents(graph: Graph) {
    graph.on('cell:mousedown', this.onDragStart, this)
  }

  protected unregisterGraphEvents(graph: Graph) {
    graph.off('cell:mousedown', this.onDragStart, this)
  }

  protected getGraphHeight(groupName?: string) {
    const group = this.getGroup(groupName)
    if (group && group.graphHeight != null) {
      return group.graphHeight
    }
    return this.options.stencilGraphHeight
  }

  protected loadGroup(
    cells: (Node | NodeMetadata)[],
    groupName?: string,
    reverse?: boolean,
  ) {
    const model = this.getModel(groupName)
    if (model) {
      const nodes = cells.map((cell) =>
        { throw new Error("STUB"); },
      )
      if (reverse === true) {
        model.removeCells(nodes)
      } else {
        model.resetCells(nodes)
      }
    }

    const group = this.getGroup(groupName)
    const height = this.getGraphHeight(groupName)

    const layout = (group && group.layout) || this.options.layout
    if (layout && model) {
      FunctionExt.call(layout, this, model, group)
    }

    if (!height) {
      const graph = this.getGraph(groupName)
      graph.fitToContent({
        minWidth: graph.options.width,
        gridHeight: 1,
        padding:
          (group && group.graphPadding) ||
          this.options.stencilGraphPadding ||
          10,
      })
    }

    return this
  }

  protected onDragStart(args: EventArgs['node:mousedown']) {
      throw new Error("STUB");
  }

  protected filter(keyword: string, filter?: StencilFilter) {
    const found = Object.keys(this.graphs).reduce((memo, groupName) => {
        throw new Error("STUB");
    }, false)

    Dom.toggleClass(this.container, 'not-found', !found)
  }

  protected isCellMatched(
    cell: Cell,
    keyword: string,
    filters: StencilFilters | undefined,
    ignoreCase: boolean,
  ) {
    if (keyword && filters) {
      return Object.keys(filters).some((shape) => {
          throw new Error("STUB");
      })
    }

    return true
  }

  protected onSearch(evt: Dom.EventObject) {
      throw new Error("STUB");
  }

  protected onSearchFocusIn() {
      throw new Error("STUB");
  }

  protected onSearchFocusOut() {
      throw new Error("STUB");
  }

  protected onTitleClick() {
      throw new Error("STUB");
  }

  protected onGroupTitleClick(evt: Dom.EventObject) {
      throw new Error("STUB");
  }

  protected getModel(groupName?: string) {
    const graph = this.getGraph(groupName)
    return graph ? graph.model : null
  }

  protected getGraph(groupName?: string) {
    return this.graphs[groupName || DefaultGroupName]
  }

  protected getGroup(groupName?: string) {
    const groups = this.options.groups
    if (groupName != null && groups && groups.length) {
      return groups.find((group) => { throw new Error("STUB"); })
    }
    return null
  }

  protected getGroupByNode(node: Node) {
      throw new Error("STUB");
  }

  protected clearGroups() {
    Object.keys(this.graphs).forEach((groupName) => {
        throw new Error("STUB");
    })
    Object.keys(this.groups).forEach((groupName) => {
        throw new Error("STUB");
    })
    this.graphs = {}
    this.groups = {}
  }

  protected onRemove() {
    this.clearGroups()
    this.dnd.remove()
    this.stopListening()
    this.undelegateDocumentEvents()
  }

  @disposable()
  dispose() {
    this.remove()
    CssLoader.clean(this.name)
  }
}
