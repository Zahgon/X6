import { ObjectExt } from '../common'
import { Node, NodeProperties, NodeSetOptions } from '../model'

export const BaseBodyAttr = {
  fill: '#ffffff',
  stroke: '#333333',
  strokeWidth: 2,
}

export const BaseLabelAttr = {
  fontSize: 14,
  fill: '#000000',
  refX: 0.5,
  refY: 0.5,
  textAnchor: 'middle',
  textVerticalAnchor: 'middle',
  fontFamily: 'Arial, helvetica, sans-serif',
}

export class Base<
  Properties extends NodeProperties = NodeProperties,
> extends Node<Properties> {
  get label() {
      throw new Error("STUB");
  }

  set label(val: string | undefined | null) {
      throw new Error("STUB");
  }

  getLabel() {
    return this.getAttrByPath<string>('text/text')
  }

  setLabel(label?: string | null, options?: NodeSetOptions) {
      throw new Error("STUB");
  }

  removeLabel() {
      throw new Error("STUB");
  }
}

Base.config({
  attrs: { text: { ...BaseLabelAttr } },
  propHooks(metadata) {
      throw new Error("STUB");
  },
  visible: true,
})
