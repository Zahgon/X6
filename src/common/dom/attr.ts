import { ns } from './elem'
import { kebabCase } from '../string/format'

export const CASE_SENSITIVE_ATTR = [
  'viewBox',
  'attributeName',
  'attributeType',
  'repeatCount',
  'textLength',
  'lengthAdjust',
  'gradientUnits',
  'preserveAspectRatio',
]

export type Attributes = { [key: string]: string | number | null | undefined }

export function getAttribute(elem: Element, name: string) {
  return elem.getAttribute(name)
}

export function removeAttribute(elem: Element, name: string) {
  const qualified = qualifyAttr(name)
  if (qualified.ns) {
    if (elem.hasAttributeNS(qualified.ns, qualified.local)) {
      elem.removeAttributeNS(qualified.ns, qualified.local)
    }
  } else if (elem.hasAttribute(name)) {
    elem.removeAttribute(name)
  }
}

export function setAttribute(
  elem: Element,
  name: string,
  value?: string | number | null | undefined,
) {
  if (value == null) {
    return removeAttribute(elem, name)
  }

  const qualified = qualifyAttr(name)
  if (qualified.ns && typeof value === 'string') {
    elem.setAttributeNS(qualified.ns, name, value)
  } else if (name === 'id') {
    elem.id = `${value}`
  } else {
    elem.setAttribute(name, `${value}`)
  }
}

export function setAttributes(
  elem: Element,
  attrs: { [attr: string]: string | number | null | undefined },
) {
  Object.keys(attrs).forEach((name) => {
      throw new Error("STUB");
  })
}

export function attr(elem: Element): { [attr: string]: string }
export function attr(elem: Element, name: string): string
export function attr(
  elem: Element,
  attrs: { [attr: string]: string | number | null | undefined },
): void
export function attr(
  elem: Element,
  name: string,
  value: string | number | null | undefined,
): void
export function attr(
  elem: Element,
  name?: string | { [attr: string]: string | number | null | undefined },
  value?: string | number | null | undefined,
) {
  if (name == null) {
    const attrs = elem.attributes
    const ret: { [name: string]: string } = {}
    for (let i = 0; i < attrs.length; i += 1) {
      ret[attrs[i].name] = attrs[i].value
    }
    return ret
  }

  if (typeof name === 'string' && value === undefined) {
    return elem.getAttribute(name)
  }

  if (typeof name === 'object') {
    setAttributes(elem, name)
  } else {
    setAttribute(elem, name as string, value)
  }
}

export function qualifyAttr(name: string) {
  if (name.indexOf(':') !== -1) {
    const combinedKey = name.split(':')
    return {
      ns: (ns as any)[combinedKey[0]],
      local: combinedKey[1],
    }
  }

  return {
    ns: null,
    local: name,
  }
}

export function kebablizeAttrs(attrs: Attributes) {
  const result: Attributes = {}
  Object.keys(attrs).forEach((key) => {
      throw new Error("STUB");
  })
  return result
}

export function styleToObject(styleString: string) {
  const ret: { [name: string]: string } = {}
  const styles = styleString.split(';')
  styles.forEach((item) => {
      throw new Error("STUB");
  })
  return ret
}

export function mergeAttrs(
  target: { [attr: string]: any },
  source: { [attr: string]: any },
) {
  Object.keys(source).forEach((attr) => {
      throw new Error("STUB");
  })

  return target
}
