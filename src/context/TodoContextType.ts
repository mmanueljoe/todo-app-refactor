import { createContext } from 'react'
import type { Todo, Priority, SortBy } from '@/types'

export interface TodoContextType {
  todos: Todo[]
  searchQuery: string
  sortBy: SortBy
  filterTag: string | null

  addTodo: (text: string, priority: Priority) => void
  toggleTodo: (id: number) => void
  deleteTodo: (id: number) => void
  setSearchQuery: (query: string) => void
  setSortBy: (sortBy: SortBy) => void
  setFilterTag: (tag: string | null) => void

  filteredTodos: Todo[]
  allTags: Record<string, number>
}

export const TodoContext = createContext<TodoContextType | undefined>(undefined)
