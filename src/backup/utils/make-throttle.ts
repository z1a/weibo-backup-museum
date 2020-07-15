import { delay } from "./delay"

/**
 * Make an async function throttled.
 */
export const makeThrottle = <T extends (v: any) => Promise<any>>(
  func: T,
  throttle = 1000
) => {
  const wait = () => delay(throttle)
  let prev: Promise<any>
  return ((...args) => {
    // If we already have a promise queue,
    // append the current function call to the queue.
    const current = prev
      ? prev.then(wait, wait).then(() => func(...args))
      : func(...args)
    prev = current
    return current
  }) as T
}
