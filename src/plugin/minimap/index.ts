import { CssLoader, Dom, disposable, FunctionExt } from '../../common'
import { type EventArgs, Graph, Options, GraphPlugin } from '../../graph'
import { View } from '../../view'
import { content } from './style/raw'
import type {
  MiniMapEventData,
  MiniMapOptions,
  MiniMapViewGeometry,
} from './type'

const DefaultOptions: Partial<MiniMapOptions> = {
  width: 300,
  height: 200,
  padding: 10,
  scalable: true,
  minScale: 0.01,
  maxScale: 16,
  graphOptions: {},
  createGraph: (options) => { throw new Error("STUB"); },
}

const DocumentEvents = {
  mousemove: 'doAction',
  touchmove: 'doAction',
  mouseup: 'stopAction',
  touchend: 'stopAction',
}

const RootClassName = 'widget-minimap'
const ViewportClassName = `${RootClassName}-viewport`
const ZoomClassName = `${ViewportClassName}-zoom`

export class MiniMap extends View implements GraphPlugin {
  public name = 'minimap'
  private graph: Graph
  public readonly options: MiniMapOptions
  public declare container: HTMLDivElement
  protected zoomHandle: HTMLDivElement
  protected viewport: HTMLElement
  protected sourceGraph: Graph
  protected targetGraph: Graph
  protected geometry: MiniMapViewGeometry
  protected ratio: number
  // Marks whether targetGraph is being transformed or scaled
  // If yes we update updateViewport only
  private targetGraphTransforming: boolean

  protected get scroller() {
      throw new Error("STUB");
  }

  protected get graphContainer() {
      throw new Error("STUB");
  }

  constructor(options: Partial<MiniMapOptions>) {
      throw new Error("STUB");
  }

  public init(graph: Graph) {
    this.graph = graph

    this.updateViewport = FunctionExt.debounce(
      this.updateViewport.bind(this),
      0,
    )

    this.container = document.createElement('div')
    Dom.addClass(this.container, this.prefixClassName(RootClassName))

    const graphContainer = document.createElement('div')
    this.container.appendChild(graphContainer)

    this.viewport = document.createElement('div')
    Dom.addClass(this.viewport, this.prefixClassName(ViewportClassName))

    if (this.options.scalable) {
      this.zoomHandle = document.createElement('div')
      Dom.addClass(this.zoomHandle, this.prefixClassName(ZoomClassName))
      Dom.appendTo(this.zoomHandle, this.viewport)
    }

    Dom.append(this.container, this.viewport)
    Dom.css(this.container, {
      width: this.options.width,
      height: this.options.height,
      padding: this.options.padding,
    })

    if (this.options.container) {
      this.options.container.appendChild(this.container)
    }

    this.sourceGraph = this.graph
    const targetGraphOptions: Options = {
      ...this.options.graphOptions,
      container: graphContainer,
      model: this.sourceGraph.model,
      interacting: false,
      grid: false,
      background: false,
      embedding: false,
      panning: false,
    }

    this.targetGraph = this.options.createGraph
      ? this.options.createGraph(targetGraphOptions)
      : new Graph(targetGraphOptions)

    this.updatePaper(
      this.sourceGraph.options.width,
      this.sourceGraph.options.height,
    )

    this.startListening()
  }

  protected startListening() {
    if (this.scroller) {
      Dom.Event.on(
        this.graphContainer,
        `scroll${this.getEventNamespace()}`,
        this.updateViewport,
      )
    } else {
      this.sourceGraph.on('translate', this.onTransform, this)
      this.sourceGraph.on('scale', this.onTransform, this)
      this.sourceGraph.on('model:updated', this.onModelUpdated, this)
    }
    this.sourceGraph.on('resize', this.updatePaper, this)
    this.delegateEvents({
      mousedown: 'startAction',
      touchstart: 'startAction',
      [`mousedown .${this.prefixClassName('graph')}`]: 'scrollTo',
      [`touchstart .${this.prefixClassName('graph')}`]: 'scrollTo',
    })
  }

  protected stopListening() {
    if (this.scroller) {
      Dom.Event.off(this.graphContainer, this.getEventNamespace())
    } else {
      this.sourceGraph.off('translate', this.onTransform, this)
      this.sourceGraph.off('scale', this.onTransform, this)
      this.sourceGraph.off('model:updated', this.onModelUpdated, this)
    }
    this.sourceGraph.off('resize', this.updatePaper, this)
    this.undelegateEvents()
  }

  protected onRemove() {
    this.stopListening()
    this.targetGraph.dispose(false)
  }

  protected onTransform(options: { ui: boolean }) {
      throw new Error("STUB");
  }

  protected onModelUpdated() {
      throw new Error("STUB");
  }

  protected updatePaper(width: number, height: number): this
  protected updatePaper({ width, height }: EventArgs['resize']): this
  protected updatePaper(w: number | EventArgs['resize'], h?: number) {
    let width: number
    let height: number
    if (typeof w === 'object') {
      width = w.width
      height = w.height
    } else {
      width = w
      height = h as number
    }

    const origin = this.sourceGraph.options
    const scale = this.sourceGraph.transform.getScale()
    const maxWidth = this.options.width - 2 * this.options.padding
    const maxHeight = this.options.height - 2 * this.options.padding

    width /= scale.sx // eslint-disable-line
    height /= scale.sy // eslint-disable-line

    this.ratio = Math.min(maxWidth / width, maxHeight / height)

    const ratio = this.ratio
    const x = (origin.x * ratio) / scale.sx
    const y = (origin.y * ratio) / scale.sy

    width *= ratio // eslint-disable-line
    height *= ratio // eslint-disable-line
    this.targetGraph.resize(width, height)
    this.targetGraph.translate(x, y)

    if (this.scroller) {
      this.targetGraph.scale(ratio, ratio)
    } else {
      this.targetGraph.zoomToFit()
    }

    this.updateViewport()
    return this
  }

  protected updateViewport() {
    const sourceGraphScale = this.sourceGraph.transform.getScale()
    const targetGraphScale = this.targetGraph.transform.getScale()

    const origin = this.scroller
      ? this.scroller.clientToLocalPoint(0, 0)
      : this.graph.graphToLocal(0, 0)

    const position = Dom.position(this.targetGraph.container)
    const translation = this.targetGraph.translate()
    translation.ty = translation.ty || 0

    this.geometry = {
      top: position.top + origin.y * targetGraphScale.sy + translation.ty,
      left: position.left + origin.x * targetGraphScale.sx + translation.tx,
      width:
        (this.graphContainer.clientWidth! * targetGraphScale.sx) /
        sourceGraphScale.sx,
      height:
        (this.graphContainer.clientHeight! * targetGraphScale.sy) /
        sourceGraphScale.sy,
    }
    Dom.css(this.viewport, this.geometry)
  }

  protected startAction(evt: Dom.MouseDownEvent) {
      throw new Error("STUB");
  }

  protected doAction(evt: Dom.MouseMoveEvent) {
      throw new Error("STUB");
  }

  protected stopAction() {
    this.undelegateDocumentEvents()
    this.targetGraphTransforming = false
  }

  protected scrollTo(evt: Dom.MouseDownEvent) {
      throw new Error("STUB");
  }

  @disposable()
  dispose() {
    this.remove()
    CssLoader.clean(this.name)
  }
}
