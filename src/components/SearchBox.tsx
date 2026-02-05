/**
 * SearchBox - Search input with debouncing
 *
 * OPTIMIZATIONS APPLIED:
 * 1. React.memo - Prevents unnecessary re-renders
 * 2. Debouncing - Waits for typing to pause before updating search
 * 3. Local state for immediate input feedback
 *
 * HOW DEBOUNCING WORKS HERE:
 * 1. User types → local state updates immediately (so input feels responsive)
 * 2. Debounce hook waits 300ms after last keystroke
 * 3. After 300ms pause → context search query updates → filtered results change
 *
 * WHY THIS MATTERS:
 * Typing "hello" without debouncing: 5 filter operations (h, he, hel, hell, hello)
 * Typing "hello" with debouncing: 1 filter operation (hello)
 */

import { memo, useState, useEffect, useCallback, type ChangeEvent } from 'react'
import { useTodos } from '@/context/useTodos'
import { useDebounce } from '@/hooks/useDebounce'

const SearchBox = memo(function SearchBox() {
  const { searchQuery, setSearchQuery } = useTodos()

  // Local state for immediate input feedback
  const [localQuery, setLocalQuery] = useState(searchQuery)

  // Debounced value - only updates 300ms after typing stops
  const debouncedQuery = useDebounce(localQuery, 300)

  // When debounced value changes, update the context
  useEffect(() => {
    setSearchQuery(debouncedQuery)
  }, [debouncedQuery, setSearchQuery])

  // Sync local state if context changes from elsewhere
  useEffect(() => {
    setLocalQuery(searchQuery)
  }, [searchQuery])

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setLocalQuery(e.target.value)
  }, [])

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={localQuery}
        onChange={handleChange}
        placeholder="Search todos..."
        className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  )
})

export default SearchBox
