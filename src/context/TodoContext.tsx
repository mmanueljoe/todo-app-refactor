import { useState, useCallback, useMemo, useRef, type ReactNode } from 'react'
import type { Todo, Priority, SortBy } from '@/types'
import { TodoContext } from './TodoContextType'

function generateInitialTodos(): Todo[] {
  return Array.from({ length: 50 }, (_, i) => {
    // Generate two random tags and deduplicate to prevent duplicate keys
    const tag1 = `tag${Math.floor(Math.random() * 5)}`
    const tag2 = `tag${Math.floor(Math.random() * 5)}`
    const uniqueTags = tag1 === tag2 ? [tag1] : [tag1, tag2]

    return {
      id: i + 1,
      text: `Todo item ${i + 1}`,
      completed: Math.random() > 0.7,
      createdAt: Date.now() - Math.random() * 1000000,
      priority: (['low', 'medium', 'high'] as const)[Math.floor(Math.random() * 3)],
      tags: uniqueTags,
    }
  })
}

export function TodoProvider({ children }: { children: ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>(generateInitialTodos)
  // Use ref for nextId since we don't need it to trigger re-renders
  // This keeps addTodo stable without dependencies
  const nextIdRef = useRef(51)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortBy>('date')
  const [filterTag, setFilterTag] = useState<string | null>(null)

  const addTodo = useCallback(
    (text: string, priority: Priority) => {
      // Use ref to get and increment ID without causing re-renders
      // This keeps addTodo stable and prevents unnecessary re-renders
      const newId = nextIdRef.current
      nextIdRef.current += 1
      setTodos((currentTodos) => [
        ...currentTodos,
        {
          id: newId,
          text,
          completed: false,
          priority,
          createdAt: Date.now(),
          tags: [],
        },
      ])
    },
    [], // Empty dependencies - function is now stable
  )

  const toggleTodo = useCallback((id: number) => {
    setTodos((currentTodos) =>
      currentTodos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)),
    )
  }, [])

  const deleteTodo = useCallback((id: number) => {
    setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== id))
  }, [])

  const filteredTodos = useMemo(() => {
    let result = todos.filter((todo) => {
      const matchesSearch = todo.text.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesTag = !filterTag || todo.tags.includes(filterTag)
      return matchesSearch && matchesTag
    })

    if (sortBy === 'priority') {
      const priorityOrder = { high: 0, medium: 1, low: 2 }
      result = [...result].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
    } else {
      result = [...result].sort((a, b) => b.createdAt - a.createdAt)
    }

    return result
  }, [todos, searchQuery, sortBy, filterTag])

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
