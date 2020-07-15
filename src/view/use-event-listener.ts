import { useRef, useEffect } from "react"

/**
 * https://usehooks.com/useEventListener/
 */
export function useEventListener<K extends keyof HTMLElementEventMap>(
  eventName: K,
  handler: (ev: HTMLElementEventMap[K]) => any,
  element?: HTMLElement | null
) {
  const savedHandler = useRef(handler)
  savedHandler.current = handler

  useEffect(() => {
    if (element) {
      const eventListener = (event: HTMLElementEventMap[K]) =>
        savedHandler.current(event)
      element.addEventListener(eventName, eventListener)
      return () => {
        element.removeEventListener(eventName, eventListener)
      }
    }
  }, [eventName, element])
}
