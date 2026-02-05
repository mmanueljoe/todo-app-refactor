/**
 * useDebounce - Delays updating a value until typing pauses
 *
 * WHY THIS EXISTS:
 * When typing in a search box, we don't want to trigger a search on every keystroke.
 * Typing "hello" would cause 5 searches: "h", "he", "hel", "hell", "hello"
 *
 * With debouncing, we wait until the user stops typing (e.g., 300ms pause)
 * before actually using the value. This means typing "hello" triggers only 1 search.
 *
 * HOW IT WORKS:
 * 1. User types a letter → we start a 300ms timer
 * 2. User types another letter → we cancel the old timer, start a new 300ms timer
 * 3. User stops typing → 300ms passes → we update the debounced value
 */

import { useState, useEffect } from 'react'

export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    // Set up a timer to update the debounced value after the delay
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Cleanup: if value changes before delay completes, cancel the timer
    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}
