import { getVendorPrefixedName } from './prefix'

export function setPrefixedStyle(style: any, name: string, value: string) {
    throw new Error("STUB");
}

export function getComputedStyle(elem: Element, name?: string) {
  // IE9+
  const computed =
    elem.ownerDocument &&
    elem.ownerDocument.defaultView &&
    elem.ownerDocument.defaultView.opener
      ? elem.ownerDocument.defaultView.getComputedStyle(elem, null)
      : window.getComputedStyle(elem, null)

  if (computed && name) {
    return computed.getPropertyValue(name) || (computed as any)[name]
  }

  return computed
}

export function hasScrollbars(container: HTMLElement) {
    throw new Error("STUB");
}
