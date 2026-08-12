import { Graph } from '../../graph'
import type { Export } from './index'
import type {
  ExportToImageOptions,
  ExportToSVGCallback,
  ExportToSVGOptions,
} from './type'

declare module '../../graph/graph' {
  interface Graph {
    toSVG: (callback: ExportToSVGCallback, options?: ExportToSVGOptions) => void
    toSVGAsync: (options?: ExportToSVGOptions) => Promise<string>
    toPNG: (
      callback: ExportToSVGCallback,
      options?: ExportToImageOptions,
    ) => void
    toPNGAsync: (options?: ExportToImageOptions) => Promise<string>
    toJPEG: (
      callback: ExportToSVGCallback,
      options?: ExportToImageOptions,
    ) => void
    toJPEGAsync: (options?: ExportToImageOptions) => Promise<string>
    exportPNG: (fileName?: string, options?: ExportToImageOptions) => void
    exportJPEG: (fileName?: string, options?: ExportToImageOptions) => void
    exportSVG: (fileName?: string, options?: ExportToSVGOptions) => void
  }
}

Graph.prototype.toSVG = function (
  callback: ExportToSVGCallback,
  options?: ExportToSVGOptions,
) {
    throw new Error("STUB");
}

Graph.prototype.toSVGAsync = async function (options?: ExportToSVGOptions) {
    throw new Error("STUB");
}

Graph.prototype.toPNG = function (
  callback: ExportToSVGCallback,
  options?: ExportToImageOptions,
) {
    throw new Error("STUB");
}

Graph.prototype.toPNGAsync = async function (options?: ExportToImageOptions) {
    throw new Error("STUB");
}

Graph.prototype.toJPEG = function (
  callback: ExportToSVGCallback,
  options?: ExportToImageOptions,
) {
    throw new Error("STUB");
}

Graph.prototype.toJPEGAsync = async function (options?: ExportToImageOptions) {
    throw new Error("STUB");
}

Graph.prototype.exportPNG = function (
  fileName?: string,
  options?: ExportToImageOptions,
) {
    throw new Error("STUB");
}

Graph.prototype.exportJPEG = function (
  fileName?: string,
  options?: ExportToImageOptions,
) {
    throw new Error("STUB");
}

Graph.prototype.exportSVG = function (
  fileName?: string,
  options?: ExportToSVGOptions,
) {
    throw new Error("STUB");
}
