import { Dom, disposable, Vector } from '../common'
import { Grid, gridPresets, gridRegistry } from '../registry'
import type {
  GridDefinition,
  GridManualItem,
  GridNativeItem,
  GridOptions as GridOptionsFromRegistry,
  GridOptionsMap,
} from '../registry'
import { Base } from './base'

export class GridManager extends Base {
  protected instance: Grid | null
  protected patterns: GridDefinition[]

  protected get elem() {
      throw new Error("STUB");
  }

  protected get grid() {
    return this.options.grid
  }

  protected init() {
    this.startListening()
    this.draw(this.grid)
  }

  protected startListening() {
    this.graph.on('scale', this.update, this)
    this.graph.on('translate', this.update, this)
  }

  protected stopListening() {
    this.graph.off('scale', this.update, this)
    this.graph.off('translate', this.update, this)
  }

  protected setVisible(visible: boolean) {
    if (this.grid.visible !== visible) {
      this.grid.visible = visible
      this.update()
    }
  }

  getGridSize() {
    return this.grid.size
  }

  setGridSize(size: number) {
    this.grid.size = Math.max(size, 1)
    this.update()
  }

  show() {
    this.setVisible(true)
    this.update()
  }

  hide() {
    this.setVisible(false)
    this.update()
  }

  clear() {
    this.elem.style.backgroundImage = ''
  }

  draw(options?: GridDrawOptions) {
    this.clear()
    this.instance = null
    Object.assign(this.grid, options)
    this.patterns = this.resolveGrid(options)
    this.update()
  }

  update(
    options:
      | Partial<GridOptionsFromRegistry>
      | Partial<GridOptionsFromRegistry>[] = {},
  ) {
    const gridSize = this.grid.size
    if (gridSize <= 1 || !this.grid.visible) {
      return this.clear()
    }

    const ctm = this.graph.matrix()
    const grid = this.getInstance()
    const items = Array.isArray(options) ? options : [options]

    this.patterns.forEach((settings, index) => {
        throw new Error("STUB");
    })

    const base64 = new XMLSerializer().serializeToString(grid.root)
    const url = `url(data:image/svg+xml;base64,${btoa(base64)})`
    this.elem.style.backgroundImage = url
  }

  protected getInstance() {
    if (!this.instance) {
      this.instance = new Grid()
    }

    return this.instance
  }

  protected resolveGrid(options?: GridDrawOptions): GridDefinition[] | never {
    if (!options) {
      return []
    }

    const type = (options as GridNativeItem).type
    if (type == null) {
      return [
        {
          ...gridPresets.dot,
          ...options.args,
        },
      ]
    }

    const items = gridRegistry.get(type)
    if (items) {
      let args = options.args || []
      if (!Array.isArray(args)) {
        args = [args]
      }

      return Array.isArray(items)
        ? items.map((item, index) => { throw new Error("STUB"); })
        : [{ ...items, ...args[0] }]
    }

    return gridRegistry.onNotFound(type)
  }

  @disposable()
  dispose() {
    this.stopListening()
    this.clear()
  }
}

export type GridDrawOptions =
  | GridNativeItem
  | GridManualItem
  | {
      args?: GridOptionsMap['dot']
    }

export interface GridCommonOptions {
  size: number
  visible: boolean
}

export type GridOptions = GridCommonOptions & GridDrawOptions
