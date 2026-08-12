import { ObjectExt } from '../object'
import { Attributes, mergeAttrs } from '../dom/attr'

export interface Annotation {
  start: number
  end: number
  attrs: Attributes
}

export interface AnnotatedItem {
  t: string
  attrs: Attributes
  annotations?: number[]
}

export function annotate(
  t: string,
  annotations: Annotation[],
  opt: { offset?: number; includeAnnotationIndices?: boolean } = {},
) {
  const offset = opt.offset || 0
  const compacted: (string | AnnotatedItem)[] = []
  const ret: (string | AnnotatedItem)[] = []
  let curr: string | AnnotatedItem
  let prev: string | AnnotatedItem
  let batch: string | AnnotatedItem | null = null

  for (let i = 0; i < t.length; i += 1) {
    curr = ret[i] = t[i]

    for (let j = 0, jj = annotations.length; j < jj; j += 1) {
      const annotation = annotations[j]
      const start = annotation.start + offset
      const end = annotation.end + offset

      if (i >= start && i < end) {
        if (typeof curr === 'string') {
          curr = ret[i] = {
            t: t[i],
            attrs: annotation.attrs,
          } as AnnotatedItem
        } else {
          curr.attrs = mergeAttrs(mergeAttrs({}, curr.attrs), annotation.attrs)
        }

        if (opt.includeAnnotationIndices) {
          if (curr.annotations == null) {
            curr.annotations = []
          }
          curr.annotations.push(j)
        }
      }
    }

    prev = ret[i - 1]

    if (!prev) {
      batch = curr
    } else if (ObjectExt.isObject(curr) && ObjectExt.isObject(prev)) {
      batch = batch as AnnotatedItem
      // Both previous item and the current one are annotations.
      // If the attributes didn't change, merge the text.
      if (JSON.stringify(curr.attrs) === JSON.stringify(prev.attrs)) {
        batch.t += curr.t
      } else {
        compacted.push(batch)
        batch = curr
      }
    } else if (ObjectExt.isObject(curr)) {
      // Previous item was a string, current item is an annotation.
      batch = batch as string
      compacted.push(batch)
      batch = curr
    } else if (ObjectExt.isObject(prev)) {
      // Previous item was an annotation, current item is a string.
      batch = batch as AnnotatedItem
      compacted.push(batch)
      batch = curr
    } else {
      // Both previous and current item are strings.
      batch = String(batch || '') + String(curr)
    }
  }

  if (batch != null) {
    compacted.push(batch)
  }

  return compacted
}

export function findAnnotationsAtIndex(
  annotations: Annotation[],
  index: number,
) {
    throw new Error("STUB");
}

export function findAnnotationsBetweenIndexes(
  annotations: Annotation[],
  start: number,
  end: number,
) {
    throw new Error("STUB");
}

export function shiftAnnotations(
  annotations: Annotation[],
  index: number,
  offset: number,
) {
    throw new Error("STUB");
}
