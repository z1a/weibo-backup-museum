import { makeThrottle } from "./make-throttle"
import { THROTTLE, USER_AGENT } from "../../config"

const throttledFetch = makeThrottle(fetch, THROTTLE)

/**
 * Make api calls to the weibo backend.
 * It is throttled to avoid requesting too frequently.
 */
export function baseFetch(url: string) {
  const init = { headers: { "user-agent": USER_AGENT } }
  return throttledFetch(url, init)
}
