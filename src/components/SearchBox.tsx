import { memo, useState, useEffect, useCallback, type ChangeEvent } from 'react'
import { useTodos } from '@/context/useTodos'
import { useDebounce } from '@/hooks/useDebounce'

const SearchBox = memo(function SearchBox() {
  const { searchQuery, setSearchQuery } = useTodos()

  const [localQuery, setLocalQuery] = useState(searchQuery)

  const debouncedQuery = useDebounce(localQuery, 300)

  useEffect(() => {
    setSearchQuery(debouncedQuery)
  }, [debouncedQuery, setSearchQuery])

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
