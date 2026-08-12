import { Dom } from '../../common'
import type { AttrDefinition } from './index'

export const title: AttrDefinition = {
  qualify(title, { elem }) {
        throw new Error("STUB");
    },
  set(val, { elem }) {
    const cacheName = 'x6-title'
    const title = `${val}`
    const cache = Dom.data(elem, cacheName)
    if (cache == null || cache !== title) {
      Dom.data(elem, cacheName, title)
      // Generally SVGTitleElement should be the first child
      // element of its parent.
      const firstChild = elem.firstChild as Element
      if (firstChild && firstChild.tagName.toUpperCase() === 'TITLE') {
        // Update an existing title
        const titleElem = firstChild as SVGTitleElement
        titleElem.textContent = title
      } else {
        // Create a new title
        const titleNode = document.createElementNS(
          elem.namespaceURI,
          'title',
        ) as SVGTitleElement
        titleNode.textContent = title
        elem.insertBefore(titleNode, firstChild)
      }
    }
  },
}
