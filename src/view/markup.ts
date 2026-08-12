import { Dom, type KeyValue, type Nilable, ObjectExt, Vector } from '../common'
import type { SimpleAttrs } from '../registry'

export type MarkupSelectors = KeyValue<Element | Element[]>

export interface MarkupJSONMarkup {
  /**
   * The namespace URI of the element. It defaults to SVG namespace
   * `"http://www.w3.org/2000/svg"`.
   */
  ns?: string | null

  /**
   * The type of element to be created.
   */
  tagName: string

  /**
   * A unique selector for targeting the element within the `attr`
   * cell attribute.
   */
  selector?: string | null

  /**
   * A selector for targeting multiple elements within the `attr`
   * cell attribute. The group selector name must not be the same
   * as an existing selector name.
   */
  groupSelector?: string | string[] | null

  attrs?: SimpleAttrs

  style?: Record<string, string | number>

  className?: string | string[]

  children?: MarkupJSONMarkup[]

  textContent?: string
}

export interface MarkupParseResult {
  fragment: DocumentFragment
  selectors: MarkupSelectors
  groups: KeyValue<Element[]>
}

export type MarkupType = string | MarkupJSONMarkup | MarkupJSONMarkup[]

function isJSONMarkup(markup?: Nilable<MarkupType>) {
    throw new Error("STUB");
}

function isStringMarkup(markup?: Nilable<MarkupType>): markup is string {
  return markup != null && typeof markup === 'string'
}

function clone(markup?: Nilable<MarkupType>) {
  return markup == null || isStringMarkup(markup)
    ? markup
    : ObjectExt.cloneDeep(markup)
}

/**
 * Removes blank space in markup to prevent create empty text node.
 */
function sanitize(markup: string) {
  return `${markup}`
    .trim()
    .replace(/[\r|\n]/g, ' ')
    .replace(/>\s+</g, '><')
}

function parseJSONMarkup(
  markup: MarkupJSONMarkup | MarkupJSONMarkup[],
  options: { ns?: string } = { ns: Dom.ns.svg },
): MarkupParseResult {
  const fragment = document.createDocumentFragment()
  const groups: KeyValue<Element[]> = {}
  const selectors: MarkupSelectors = {}

  const queue: {
    markup: MarkupJSONMarkup[]
    parent: Element | DocumentFragment
    ns?: string
  }[] = [
    {
      markup: Array.isArray(markup) ? markup : [markup],
      parent: fragment,
      ns: options.ns,
    },
  ]

  while (queue.length > 0) {
    const item = queue.pop()
    let ns = item.ns || Dom.ns.svg
    const defines = item.markup
    const parentNode = item.parent

    defines.forEach((define) => {
        throw new Error("STUB");
    })
  }

  Object.keys(groups).forEach((groupName) => {
      throw new Error("STUB");
  })

  return { fragment, selectors, groups }
}

function createContainer(firstChild: Element) {
  return firstChild instanceof SVGElement
    ? Dom.createSvgElement('g')
    : Dom.createElement('div')
}

function renderMarkup(markup: MarkupType): {
  elem?: Element
  selectors?: MarkupSelectors
} {
  if (isStringMarkup(markup)) {
    const nodes = Vector.createVectors(markup)
    const count = nodes.length

    if (count === 1) {
      return {
        elem: nodes[0].node as Element,
      }
    }

    if (count > 1) {
      const elem = createContainer(nodes[0].node)
      nodes.forEach((node) => {
          throw new Error("STUB");
      })

      return { elem }
    }

    return {}
  }

  const result = parseJSONMarkup(markup)
  const fragment = result.fragment
  let elem: Element | null = null
  if (fragment.childNodes.length > 1) {
    elem = createContainer(fragment.firstChild as Element)
    elem.appendChild(fragment)
  } else {
    elem = fragment.firstChild as Element
  }

  return { elem, selectors: result.selectors }
}

function parseLabelStringMarkup(markup: string) {
  const children = Vector.createVectors(markup)
  const fragment = document.createDocumentFragment()
  for (let i = 0, n = children.length; i < n; i += 1) {
    const currentChild = children[i].node
    fragment.appendChild(currentChild)
  }

  return { fragment, selectors: {} }
}

function getSelector(
  elem: Element,
  stop: Element,
  prev?: string,
): string | undefined {
  if (elem != null) {
    let selector: string
    const tagName = elem.tagName.toLowerCase()

    if (elem === stop) {
      if (typeof prev === 'string') {
        selector = `> ${tagName} > ${prev}`
      } else {
        selector = `> ${tagName}`
      }
      return selector
    }

    const parent = elem.parentNode
    if (parent && parent.childNodes.length > 1) {
      const nth = Dom.index(elem) + 1
      selector = `${tagName}:nth-child(${nth})`
    } else {
      selector = tagName
    }

    if (prev) {
      selector += ` > ${prev}`
    }

    return getSelector(elem.parentNode as Element, stop, selector)
  }

  return prev
}

function getPortContainerMarkup(): MarkupType {
  return 'g'
}

function getPortMarkup(): MarkupType {
  return {
    tagName: 'circle',
    selector: 'circle',
    attrs: {
      r: 10,
      fill: '#FFFFFF',
      stroke: '#000000',
    },
  }
}

function getPortLabelMarkup(): MarkupType {
  return {
    tagName: 'text',
    selector: 'text',
    attrs: {
      fill: '#000000',
    },
  }
}

function getEdgeMarkup(): MarkupType {
  return [
    {
      tagName: 'path',
      selector: 'wrap',
      groupSelector: 'lines',
      attrs: {
        fill: 'none',
        cursor: 'pointer',
        stroke: 'transparent',
        strokeLinecap: 'round',
      },
    },
    {
      tagName: 'path',
      selector: 'line',
      groupSelector: 'lines',
      attrs: {
        fill: 'none',
        pointerEvents: 'none',
      },
    },
  ]
}

function getForeignObjectMarkup(bare = false): MarkupJSONMarkup {
  return {
    tagName: 'foreignObject',
    selector: 'fo',
    children: [
      {
        ns: Dom.ns.xhtml,
        tagName: 'body',
        selector: 'foBody',
        attrs: {
          xmlns: Dom.ns.xhtml,
        },
        style: {
          width: '100%',
          height: '100%',
          background: 'transparent',
        },
        children: bare
          ? []
          : [
              {
                tagName: 'div',
                selector: 'foContent',
                style: {
                  width: '100%',
                  height: '100%',
                },
              },
            ],
      },
    ],
  }
}

/**
 * Markup 所有的方法导出
 */
export const Markup = {
  isJSONMarkup,
  isStringMarkup,
  clone,
  sanitize,
  parseJSONMarkup,
  createContainer,
  renderMarkup,
  parseLabelStringMarkup,
  getSelector,
  getPortContainerMarkup,
  getPortMarkup,
  getPortLabelMarkup,
  getEdgeMarkup,
  getForeignObjectMarkup,
}
