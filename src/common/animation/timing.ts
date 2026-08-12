/**
 * @file 缓动函数
 * 提供常用的缓动函数。
 */

export type Definition = (t: number) => number
export type Names =
  | 'linear'
  | 'quad'
  | 'cubic'
  | 'inout'
  | 'exponential'
  | 'bounce'
  | 'easeInSine'
  | 'easeOutSine'
  | 'easeInOutSine'
  | 'easeInQuad'
  | 'easeOutQuad'
  | 'easeInOutQuad'
  | 'easeInCubic'
  | 'easeOutCubic'
  | 'easeInOutCubic'
  | 'easeInQuart'
  | 'easeOutQuart'
  | 'easeInOutQuart'
  | 'easeInQuint'
  | 'easeOutQuint'
  | 'easeInOutQuint'
  | 'easeInExpo'
  | 'easeOutExpo'
  | 'easeInOutExpo'
  | 'easeInCirc'
  | 'easeOutCirc'
  | 'easeInOutCirc'
  | 'easeInBack'
  | 'easeOutBack'
  | 'easeInOutBack'
  | 'easeInElastic'
  | 'easeOutElastic'
  | 'easeInOutElastic'
  | 'easeInBounce'
  | 'easeOutBounce'
  | 'easeInOutBounce'

export const linear: Definition = (t) => { throw new Error("STUB"); }
export const quad: Definition = (t) => { throw new Error("STUB"); }
export const cubic: Definition = (t) => { throw new Error("STUB"); }
export const inout: Definition = (t) => {
    throw new Error("STUB");
}

export const exponential: Definition = (t) => {
    throw new Error("STUB");
}

export const bounce = ((t: number) => {
    throw new Error("STUB");
}) as Definition

export const decorators = {
  reverse(f: Definition): Definition {
    return (t) => { throw new Error("STUB"); }
  },
  reflect(f: Definition): Definition {
      throw new Error("STUB");
  },
  clamp(f: Definition, n = 0, x = 1): Definition {
    return (t) => {
        throw new Error("STUB");
    }
  },
  back(s = 1.70158): Definition {
      throw new Error("STUB");
  },
  elastic(x = 1.5): Definition {
      throw new Error("STUB");
  },
}

// Slight acceleration from zero to full speed
export function easeInSine(t: number) {
    throw new Error("STUB");
}

// Slight deceleration at the end
export function easeOutSine(t: number) {
    throw new Error("STUB");
}

// Slight acceleration at beginning and slight deceleration at end
export function easeInOutSine(t: number) {
    throw new Error("STUB");
}

// Accelerating from zero velocity
export function easeInQuad(t: number) {
    throw new Error("STUB");
}

// Decelerating to zero velocity
export function easeOutQuad(t: number) {
    throw new Error("STUB");
}

// Acceleration until halfway, then deceleration
export function easeInOutQuad(t: number) {
    throw new Error("STUB");
}

// Accelerating from zero velocity
export function easeInCubic(t: number) {
    throw new Error("STUB");
}

// Decelerating to zero velocity
export function easeOutCubic(t: number) {
    throw new Error("STUB");
}

// Acceleration until halfway, then deceleration
export function easeInOutCubic(t: number) {
    throw new Error("STUB");
}

// Accelerating from zero velocity
export function easeInQuart(t: number) {
    throw new Error("STUB");
}

// Decelerating to zero velocity
export function easeOutQuart(t: number) {
    throw new Error("STUB");
}

// Acceleration until halfway, then deceleration
export function easeInOutQuart(t: number) {
    throw new Error("STUB");
}

// Accelerating from zero velocity
export function easeInQuint(t: number) {
    throw new Error("STUB");
}

// Decelerating to zero velocity
export function easeOutQuint(t: number) {
    throw new Error("STUB");
}

// Acceleration until halfway, then deceleration
export function easeInOutQuint(t: number) {
    throw new Error("STUB");
}

// Accelerate exponentially until finish
export function easeInExpo(t: number) {
    throw new Error("STUB");
}

// Initial exponential acceleration slowing to stop
export function easeOutExpo(t: number) {
    throw new Error("STUB");
}

// Exponential acceleration and deceleration
export function easeInOutExpo(t: number) {
    throw new Error("STUB");
}

// Increasing velocity until stop
export function easeInCirc(t: number) {
    throw new Error("STUB");
}

// Start fast, decreasing velocity until stop
export function easeOutCirc(t: number) {
    throw new Error("STUB");
}

// Fast increase in velocity, fast decrease in velocity
export function easeInOutCirc(t: number) {
    throw new Error("STUB");
}

// Slow movement backwards then fast snap to finish
export function easeInBack(t: number, magnitude = 1.70158) {
    throw new Error("STUB");
}

// Fast snap to backwards point then slow resolve to finish
export function easeOutBack(t: number, magnitude = 1.70158) {
    throw new Error("STUB");
}

// Slow movement backwards, fast snap to past finish, slow resolve to finish
export function easeInOutBack(t: number, magnitude = 1.70158) {
    throw new Error("STUB");
}

// Bounces slowly then quickly to finish
export function easeInElastic(t: number, magnitude = 0.7) {
    throw new Error("STUB");
}

// Fast acceleration, bounces to zero
export function easeOutElastic(t: number, magnitude = 0.7) {
    throw new Error("STUB");
}

// Slow start and end, two bounces sandwich a fast motion
export function easeInOutElastic(t: number, magnitude = 0.65) {
    throw new Error("STUB");
}

// Bounce to completion
export function easeOutBounce(t: number) {
    throw new Error("STUB");
}

// Bounce increasing in velocity until completion
export function easeInBounce(t: number) {
    throw new Error("STUB");
}

// Bounce in and bounce out
export function easeInOutBounce(t: number) {
    throw new Error("STUB");
}
