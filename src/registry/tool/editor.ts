import { Dom, FunctionExt, NumberExt, ObjectExt, Util } from '../../common'
import { Point } from '../../geometry'
import type { Cell, Edge } from '../../model'
import type { CellView, EdgeView, NodeView } from '../../view'
import { ToolItem, type ToolItemOptions } from '../../view/tool'
import { createViewElement } from '../../view/view/util'

export class CellEditor extends ToolItem<
  NodeView | EdgeView,
  CellEditorOptions & { event: Dom.EventObject }
> {
  public static defaults: CellEditorOptions = {
    ...ToolItem.getDefaults(),
    tagName: 'div',
    isSVGElement: false,
    events: {
      mousedown: 'onMouseDown',
      touchstart: 'onMouseDown',
    },
    documentEvents: {
      mouseup: 'onDocumentMouseUp',
      touchend: 'onDocumentMouseUp',
      touchcancel: 'onDocumentMouseUp',
    },
  }
  private editor: HTMLDivElement | null
  private labelIndex = -1
  private distance = 0.5
  private event: Dom.DoubleClickEvent
  private dblClick = this.onCellDblClick.bind(this)

  onRender() {
    const cellView = this.cellView as CellView
    if (cellView) {
      cellView.on('cell:dblclick', this.dblClick)
    }
  }

  createElement() {
    const classNames = [
      this.prefixClassName(
        `${this.cell.isEdge() ? 'edge' : 'node'}-tool-editor`,
      ),
      this.prefixClassName('cell-tool-editor'),
    ]
    this.editor = createViewElement('div', false) as HTMLDivElement
    this.addClass(classNames, this.editor)
    this.editor.contentEditable = 'true'
    this.container.appendChild(this.editor)
  }

  removeElement() {
    this.undelegateDocumentEvents()
    if (this.editor) {
      this.container.removeChild(this.editor)
      this.editor = null
    }
  }

  updateEditor() {
      throw new Error("STUB");
  }

  updateNodeEditorTransform() {
      throw new Error("STUB");
  }

  updateEdgeEditorTransform() {
      throw new Error("STUB");
  }

  updateCell() {
      throw new Error("STUB");
  }

  onDocumentMouseUp(e: Dom.MouseDownEvent) {
      throw new Error("STUB");
  }

  onCellDblClick({ e }: { e: Dom.DoubleClickEvent }) {
      throw new Error("STUB");
  }

  onMouseDown(e: Dom.MouseDownEvent) {
    e.stopPropagation()
  }

  autoFocus() {
      throw new Error("STUB");
  }

  selectText() {
      throw new Error("STUB");
  }

  getCellText() {
      throw new Error("STUB");
  }

  setCellText(value: string | null) {
      throw new Error("STUB");
  }

  protected onRemove() {
    const cellView = this.cellView as CellView
    if (cellView) {
      cellView.off('cell:dblclick', this.dblClick)
    }
    this.removeElement()
  }
}

interface CellEditorOptions extends ToolItemOptions {
  x?: number | string
  y?: number | string
  width?: number
  height?: number
  attrs: {
    fontSize: number
    fontFamily: string
    color: string
    backgroundColor: string
  }
  labelAddable?: boolean
  getText:
    | ((
        this: CellView,
        args: {
          cell: Cell
          index?: number
        },
      ) => string)
    | string
  setText:
    | ((
        this: CellView,
        args: {
          cell: Cell
          value: string | null
          index?: number
          distance?: number
        },
      ) => void)
    | string
}

export class NodeEditor extends CellEditor {
  public static defaults: CellEditorOptions = ObjectExt.merge(
    {},
    CellEditor.defaults,
    {
      attrs: {
        fontSize: 14,
        fontFamily: 'Arial, helvetica, sans-serif',
        color: '#000',
        backgroundColor: '#fff',
      },
      getText: 'text/text',
      setText: 'text/text',
    },
  )
}

export class EdgeEditor extends CellEditor {
  public static defaults: CellEditorOptions = ObjectExt.merge(
    {},
    CellEditor.defaults,
    {
      attrs: {
        fontSize: 14,
        fontFamily: 'Arial, helvetica, sans-serif',
        color: '#000',
        backgroundColor: '#fff',
      },
      labelAddable: true,
      getText: 'label/text',
      setText: 'label/text',
    },
  )
}
