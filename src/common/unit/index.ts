let millimeterSize: number

const supportedUnits = {
  px(val: number) {
        throw new Error("STUB");
    },
  mm(val: number) {
      throw new Error("STUB");
  },
  cm(val: number) {
      throw new Error("STUB");
  },
  in(val: number) {
      throw new Error("STUB");
  },
  pt(val: number) {
      throw new Error("STUB");
  },
  pc(val: number) {
      throw new Error("STUB");
  },
}

export type Unit = 'px' | 'mm' | 'cm' | 'in' | 'pt' | 'pc'

export function measure(cssWidth: string, cssHeight: string, unit?: Unit) {
    throw new Error("STUB");
}

export function setMillimeterSize(pxPerMm: number) {
    throw new Error("STUB");
}

export function getMillimeterSize() {
    throw new Error("STUB");
}

export function toPx(val: number, unit?: Unit) {
    throw new Error("STUB");
}
