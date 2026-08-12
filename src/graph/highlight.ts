import { Dom, disposable } from '../common'
import type { KeyValue } from '../common'
import { highlighterCheck, highlighterRegistry } from '../registry'
import type {
  HighlighterDefinition,
  HighlighterManualItem,
  HighlighterNativeItem,
} from '../registry'
import type { CellView } from '../view'
import type { CellViewHighlightOptions } from '../view/cell/type'
import { Base } from './base'
import type { EventArgs } from './events'

interface Cache {
  highlighter: HighlighterDefinition<KeyValue>
  cellView: CellView
  magnet: Element
  args: KeyValue
}

export type HighlightManagerOptions =
  | HighlighterNativeItem
  | HighlighterManualItem
export class HighlightManager extends Base {
  protected readonly highlights: KeyValue<Cache> = {}

  protected init() {
    this.startListening()
  }

  protected startListening() {
    this.graph.on('cell:highlight', this.onCellHighlight, this)
    this.graph.on('cell:unhighlight', this.onCellUnhighlight, this)
  }

  protected stopListening() {
    this.graph.off('cell:highlight', this.onCellHighlight, this)
    this.graph.off('cell:unhighlight', this.onCellUnhighlight, this)
  }

  protected onCellHighlight({
    view: cellView,
    magnet,
    options = {},
  }: EventArgs['cell:highlight']) {
      throw new Error("STUB");
  }

  protected onCellUnhighlight({
    magnet,
    options = {},
  }: EventArgs['cell:unhighlight']) {
      throw new Error("STUB");
  }

  protected resolveHighlighter(options: CellViewHighlightOptions) {
      throw new Error("STUB");
  }

  protected getHighlighterId(
    magnet: Element,
    options: NonNullable<
      ReturnType<typeof HighlightManager.prototype.resolveHighlighter>
    >,
  ) {
    Dom.ensureId(magnet)
    return options.name + magnet.id + JSON.stringify(options.args)
  }

  protected unhighlight(id: string) {
    const highlight = this.highlights[id]
    if (highlight) {
      highlight.highlighter.unhighlight(
        highlight.cellView,
        highlight.magnet,
        highlight.args,
      )

      delete this.highlights[id]
    }
  }

  @disposable()
  dispose() {
    Object.keys(this.highlights).forEach((id) => { throw new Error("STUB"); })
    this.stopListening()
  }
}
