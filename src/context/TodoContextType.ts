import { createContext } from 'react'
import type { Todo, Priority, SortBy } from '@/types'

// Define what data and functions will be available in the context
export interface TodoContextType {
  // State
  todos: Todo[]
  searchQuery: string
  sortBy: SortBy
  filterTag: string | null
  
  // Actions (functions to modify state)
  addTodo: (text: string, priority: Priority) => void
  toggleTodo: (id: number) => void
  deleteTodo: (id: number) => void
  setSearchQuery: (query: string) => void
  setSortBy: (sortBy: SortBy) => void
  setFilterTag: (tag: string | null) => void
  
  // Computed values (derived from state)
  filteredTodos: Todo[]
  allTags: Record<string, number>
}

// Create the context with undefined as default
// (we'll always use it inside a provider, so this is fine)
export const TodoContext = createContext<TodoContextType | undefined>(undefined)
