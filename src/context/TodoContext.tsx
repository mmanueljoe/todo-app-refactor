/**
 * TodoContext - Eliminates Prop Drilling
 *
 * WHY THIS EXISTS:
 * Before: TodoApp held all state and passed it down through every component,
 * even to components that just passed it along without using it.
 *
 * After: Any component can access the todos and actions directly,
 * without needing to receive them as props from parent components.
 *
 * HOW IT WORKS:
 * 1. We create a "context" - think of it as a shared storage space
 * 2. We wrap the app in a "provider" that fills that storage
 * 3. Any component can use "useContext" to grab what it needs
 */

import { useState, useCallback, useMemo, type ReactNode } from 'react'
import type { Todo, Priority, SortBy } from '@/types'
import { TodoContext } from './TodoContextType'

// Generate initial todos for demo purposes
function generateInitialTodos(): Todo[] {
  return Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    text: `Todo item ${i + 1}`,
    completed: Math.random() > 0.7,
    createdAt: Date.now() - Math.random() * 1000000,
    priority: (['low', 'medium', 'high'] as const)[Math.floor(Math.random() * 3)],
    tags: [`tag${Math.floor(Math.random() * 5)}`, `tag${Math.floor(Math.random() * 5)}`],
  }))
}

// The Provider component that wraps the app
export function TodoProvider({ children }: { children: ReactNode }) {
  // State
  const [todos, setTodos] = useState<Todo[]>(generateInitialTodos)
  const [nextId, setNextId] = useState(51)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortBy>('date')
  const [filterTag, setFilterTag] = useState<string | null>(null)

  /**
   * useCallback: Remember this function
   *
   * WHY: Without useCallback, this function would be recreated on every render.
   * Components using React.memo that receive this function would think
   * "the prop changed!" and re-render unnecessarily.
   *
   * The [todos, nextId] array tells React: "only recreate this function
   * if todos or nextId changes"
   */
  const addTodo = useCallback(
    (text: string, priority: Priority) => {
      // CORRECT: Create a NEW array instead of modifying the existing one
      setTodos((currentTodos) => [
        ...currentTodos,
        {
          id: nextId,
          text,
          completed: false,
          priority,
          createdAt: Date.now(),
          tags: [],
        },
      ])
      setNextId((id) => id + 1)
    },
    [nextId],
  )

  const toggleTodo = useCallback((id: number) => {
    setTodos((currentTodos) =>
      currentTodos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)),
    )
  }, [])

  const deleteTodo = useCallback((id: number) => {
    setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== id))
  }, [])

  /**
   * useMemo: Remember this calculated value
   *
   * WHY: Filtering and sorting 50+ items is expensive.
   * Without useMemo, this calculation runs on EVERY render,
   * even if todos, searchQuery, sortBy, and filterTag haven't changed.
   *
   * The dependency array tells React: "only recalculate if any of these change"
   */
  const filteredTodos = useMemo(() => {
    let result = todos.filter((todo) => {
      const matchesSearch = todo.text.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesTag = !filterTag || todo.tags.includes(filterTag)
      return matchesSearch && matchesTag
    })

    // Sort the filtered results
    if (sortBy === 'priority') {
      const priorityOrder = { high: 0, medium: 1, low: 2 }
      result = [...result].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
    } else {
      result = [...result].sort((a, b) => b.createdAt - a.createdAt)
    }

    return result
  }, [todos, searchQuery, sortBy, filterTag])

  // Memoize the tag counts calculation
  const allTags = useMemo(() => {
    return todos.reduce(
      (acc, todo) => {
        todo.tags.forEach((tag) => {
          acc[tag] = (acc[tag] || 0) + 1
        })
        return acc
      },
      {} as Record<string, number>,
    )
  }, [todos])

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      todos,
      searchQuery,
      sortBy,
      filterTag,
      addTodo,
      toggleTodo,
      deleteTodo,
      setSearchQuery,
      setSortBy,
      setFilterTag,
      filteredTodos,
      allTags,
    }),
    [
      todos,
      searchQuery,
      sortBy,
      filterTag,
      addTodo,
      toggleTodo,
      deleteTodo,
      filteredTodos,
      allTags,
    ],
  )

  return <TodoContext.Provider value={contextValue}>{children}</TodoContext.Provider>
}
