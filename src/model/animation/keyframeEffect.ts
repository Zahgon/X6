import {
  ArrayExt,
  Interp,
  NumberExt,
  ObjectExt,
  StringExt,
  Timing,
} from '../../common'
import { unitReg } from '../../common/animation/util'
import type { CamelToKebabCase } from '../../types'
import type { Cell } from '../cell'
import { isNotReservedWord } from './utils'

/**
 * Web Animation API 的 KeyframeEffect 实现，功能完善实现中
 * 参考: https://developer.mozilla.org/en-US/docs/Web/API/KeyframeEffect
 */
export class KeyframeEffect {
  private _target: Cell
  private _keyframes: Keyframe[] | PropertyIndexedKeyframes | null
  private _computedKeyframes: ComputedKeyframe[]
  private _options: KeyframeAnimationOptions
  // biome-ignore lint/suspicious/noExplicitAny: <属性类型存在多种可能>
  private _originProps?: Record<string, any> = {}

  constructor(
    target: Cell,
    keyframes: Keyframe[] | PropertyIndexedKeyframes | null,
    options?: number | KeyframeAnimationOptions,
  ) {
      throw new Error("STUB");
  }

  get target(): Cell | null {
      throw new Error("STUB");
  }

  getKeyframes(): ComputedKeyframe[] {
      throw new Error("STUB");
  }

  setKeyframes(keyframes: Keyframe[] | PropertyIndexedKeyframes | null): void {
      throw new Error("STUB");
  }

  getTiming(): EffectTiming {
    return ObjectExt.defaults(this._options, defaultTiming)
  }

  getComputedTiming(): ComputedEffectTiming {
    const timing = this.getTiming()
    const activeDuration = timing.duration * timing.iterations

    return {
      ...timing,
      activeDuration,
      endTime: activeDuration + timing.delay,
    }
  }

  apply(iterationTime: number | null): void {
    if (!this._target || !this._computedKeyframes.length) return

    // 参数为null则回到初始状态
    if (iterationTime == null) {
      Object.entries(this._originProps).forEach(([prop, value]) => {
          throw new Error("STUB");
      })
      return
    }

    const timing = this.getComputedTiming()
    const duration = timing.duration
    if (duration < 0) return

    // 计算进度 (0-1)
    const progress = Math.min(iterationTime / duration, 1)

    // 找到当前进度对应的关键帧
    const frames = this._computedKeyframes
    if (frames.length === 0) return

    let startFrame = { computedOffset: 0 } as ComputedKeyframe
    let endFrame = { computedOffset: 1 } as ComputedKeyframe

    for (const frame of frames) {
      if (progress === 0 && frame.computedOffset === 0) {
        startFrame = frame
      }
      if (progress === 1 && frame.computedOffset === 1) {
        endFrame = frame
      }
      if (frame.computedOffset < progress) {
        startFrame = frame
      }
      if (frame.computedOffset > progress) {
        endFrame = frame
        break
      }
    }

    // 计算两个关键帧之间的插值
    const startOffset = startFrame.computedOffset
    const endOffset = endFrame.computedOffset
    const frameProgress = (progress - startOffset) / (endOffset - startOffset)
    const kebabEasingName = startFrame.easing ?? endFrame.easing
    const easingName = StringExt.camelCase(kebabEasingName)
    const easingFn = Timing[easingName] ?? Timing.linear

    // 应用插值后的样式
    for (const prop in { ...startFrame, ...endFrame }) {
      if (
        isNotReservedWord(prop) &&
        (startFrame[prop] != null || endFrame[prop] != null)
      ) {
        const startValue = startFrame[prop] ?? this._originProps[prop]
        const endValue = endFrame[prop] ?? this._originProps[prop]
        let interpolation: Interp.Definition<number | string>

        // TODO: rgb color
        if (String(startValue).startsWith('#')) {
          interpolation = Interp.color
        } else if (
          prop.endsWith('transform') &&
          !NumberExt.isNumber(startValue)
        ) {
          interpolation = Interp.transform
        } else if (
          unitReg.test(String(startValue)) ||
          unitReg.test(String(endValue))
        ) {
          interpolation = Interp.unit
        } else {
          interpolation = Interp.number
        }

        const interpolationFn = interpolation(startValue, endValue)

        const value = interpolationFn(easingFn(frameProgress))

        this.target.setPropByPath(prop, value)
      }
    }
  }
}

export interface EffectTiming {
  delay?: number
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse'
  duration?: number
  easing?: CamelToKebabCase<Timing.Names>
  // TODO: backwards 和 both 的初始应用效果待实现
  fill?: 'none' | 'forwards' | 'backwards' | 'both'
  iterations?: number
}

interface ComputedEffectTiming extends EffectTiming {
  activeDuration?: number
  endTime?: number
}

export interface KeyframeEffectOptions extends EffectTiming {
  /** TODO: 待实现 */
  composite?: CompositeOperation
  /** TODO: 待实现 */
  iterationComposite?: IterationCompositeOperation
}

const defaultTiming: EffectTiming = {
  delay: 0,
  direction: 'normal',
  duration: 0,
  easing: 'linear',
  fill: 'none',
  iterations: 1,
}
