/* eslint-disable @typescript-eslint/no-unused-vars */

import { disposable, Util } from '../common'
import { type PointLike, Rectangle, type RectangleLike } from '../geometry'
import { Base } from '../graph/base'
import { Cell } from '../model'
import type { CellView, EdgeView } from '../view'
import { Scheduler } from './scheduler'

export class Renderer extends Base {
  private readonly schedule: Scheduler = new Scheduler(this.graph)

  requestViewUpdate(view: CellView, flag: number, options: any = {}) {
    this.schedule.requestViewUpdate(view, flag, options)
  }

  isViewMounted(view: CellView) {
    return this.schedule.isViewMounted(view)
  }

  setRenderArea(area?: Rectangle) {
    this.schedule.setRenderArea(area)
  }

  findViewByElem(elem: string | Element | undefined | null) {
    if (elem == null) {
      return null
    }
    const container = this.options.container
    const target =
      typeof elem === 'string'
        ? container.querySelector(elem)
        : elem instanceof Element
        ? elem
        : elem[0]

    if (target) {
      const id = this.graph.view.findAttr('data-cell-id', target)
      if (id) {
        const views = this.schedule.views
        if (views[id]) {
          return views[id].view
        }
      }
    }

    return null
  }

  findViewByCell(cellId: string | number): CellView | null
  findViewByCell(cell: Cell | null): CellView | null
  findViewByCell(
    cell: Cell | string | number | null | undefined,
  ): CellView | null {
    if (cell == null) {
      return null
    }
    const id = Cell.isCell(cell) ? cell.id : cell
    const views = this.schedule.views
    if (views[id]) {
      return views[id].view
    }

    return null
  }

  findViewsFromPoint(p: PointLike) {
      throw new Error("STUB");
  }

  findEdgeViewsFromPoint(p: PointLike, threshold = 5) {
    return this.model
      .getEdges()
      .map((edge) => { throw new Error("STUB"); })
      .filter((view: EdgeView) => {
          throw new Error("STUB");
      }) as EdgeView[]
  }

  findViewsInArea(
    rect: RectangleLike,
    options: { strict?: boolean; nodeOnly?: boolean } = {},
  ) {
    const area = Rectangle.create(rect)
    return this.model
      .getCells()
      .map((cell) => { throw new Error("STUB"); })
      .filter((view) => {
          throw new Error("STUB");
      }) as CellView[]
  }

  @disposable()
  dispose() {
    this.schedule.dispose()
  }
}
