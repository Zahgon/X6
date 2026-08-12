import { Dom, FunctionExt, NumberExt } from '../../common'
import { Path, Point, Polyline, type Rectangle } from '../../geometry'
import type {
  AttrDefinition,
  AttrOptions,
  AttrPositionFunction,
  AttrSetFunction,
  ComplexAttrValue,
  SimpleAttrs,
} from './index'

export const ref: AttrDefinition = {
  // We do not set `ref` attribute directly on an element.
  // The attribute itself does not qualify for relative positioning.
}

// if `refX` is in [0, 1] then `refX` is a fraction of bounding box width
// if `refX` is < 0 then `refX`'s absolute values is the right coordinate of the bounding box
// otherwise, `refX` is the left coordinate of the bounding box

export const refX: AttrDefinition = {
  position: positionWrapper('x', 'width', 'origin'),
}

export const refY: AttrDefinition = {
  position: positionWrapper('y', 'height', 'origin'),
}

// `ref-dx` and `ref-dy` define the offset of the subelement relative to the right and/or bottom
// coordinate of the reference element.

export const refDx: AttrDefinition = {
  position: positionWrapper('x', 'width', 'corner'),
}

export const refDy: AttrDefinition = {
  position: positionWrapper('y', 'height', 'corner'),
}

// 'ref-width'/'ref-height' defines the width/height of the subelement relatively to
// the reference element size
// val in 0..1         ref-width = 0.75 sets the width to 75% of the ref. el. width
// val < 0 || val > 1  ref-height = -20 sets the height to the ref. el. height shorter by 20
export const refWidth: AttrDefinition = {
  set: setWrapper('width', 'width'),
}

export const refHeight: AttrDefinition = {
  set: setWrapper('height', 'height'),
}

export const refRx: AttrDefinition = {
  set: setWrapper('rx', 'width'),
}

export const refRy: AttrDefinition = {
  set: setWrapper('ry', 'height'),
}

export const refRInscribed: AttrDefinition = {
  set: ((attrName): AttrSetFunction => {
        throw new Error("STUB");
    })('r'),
}

export const refRCircumscribed: AttrDefinition = {
  set(val, { refBBox }) {
    let value = parseFloat(val as string)
    const percentage = NumberExt.isPercentage(val)
    if (percentage) {
      value /= 100
    }

    const diagonalLength = Math.sqrt(
      refBBox.height * refBBox.height + refBBox.width * refBBox.width,
    )

    let rValue
    if (Number.isFinite(value)) {
      if (percentage || (value >= 0 && value <= 1)) {
        rValue = value * diagonalLength
      } else {
        rValue = Math.max(value + diagonalLength, 0)
      }
    }

    return { r: rValue } as SimpleAttrs
  },
}

export const refCx: AttrDefinition = {
  set: setWrapper('cx', 'width'),
}

export const refCy: AttrDefinition = {
  set: setWrapper('cy', 'height'),
}

export const refDResetOffset: AttrDefinition = {
  set: dWrapper({ resetOffset: true }),
}

export const refDKeepOffset: AttrDefinition = {
  set: dWrapper({ resetOffset: false }),
}

export const refPointsResetOffset: AttrDefinition = {
  set: pointsWrapper({ resetOffset: true }),
}

export const refPointsKeepOffset: AttrDefinition = {
  set: pointsWrapper({ resetOffset: false }),
}

// aliases
// -------
export const refR = refRInscribed
export const refD = refDResetOffset
export const refPoints = refPointsResetOffset
// Allows to combine both absolute and relative positioning
// refX: 50%, refX2: 20
export const refX2 = refX
export const refY2 = refY
export const refWidth2 = refWidth
export const refHeight2 = refHeight

// utils
// -----

function positionWrapper(
  axis: 'x' | 'y',
  dimension: 'width' | 'height',
  origin: 'origin' | 'corner',
): AttrPositionFunction {
  return (val, { refBBox }) => {
      throw new Error("STUB");
  }
}

function setWrapper(
  attrName: string,
  dimension: 'width' | 'height',
): AttrSetFunction {
  return (val, { refBBox }) => {
      throw new Error("STUB");
  }
}

function shapeWrapper(
  shapeConstructor: (value: ComplexAttrValue) => any,
  options: { resetOffset: boolean },
): <T>(value: ComplexAttrValue, options: AttrOptions) => T {
  const cacheName = 'x6-shape'
  const resetOffset = options && options.resetOffset

  return (value, { elem, refBBox }) => {
      throw new Error("STUB");
  }
}

// `d` attribute for SVGPaths
function dWrapper(options: { resetOffset: boolean }): AttrSetFunction {
  function pathConstructor(value: string) {
      throw new Error("STUB");
  }

  const shape = shapeWrapper(pathConstructor, options)

  return (value, args) => {
      throw new Error("STUB");
  }
}

// `points` attribute for SVGPolylines and SVGPolygons
function pointsWrapper(options: { resetOffset: boolean }): AttrSetFunction {
  const shape = shapeWrapper((points) => { throw new Error("STUB"); }, options)
  return (value, args) => {
      throw new Error("STUB");
  }
}
