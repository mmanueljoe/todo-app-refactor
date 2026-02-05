import { useState, useCallback, useMemo, type ReactNode } from 'react'
import type { Todo, Priority, SortBy } from '@/types'
import { TodoContext } from './TodoContextType'

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

export function TodoProvider({ children }: { children: ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>(generateInitialTodos)
  const [nextId, setNextId] = useState(51)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortBy>('date')
  const [filterTag, setFilterTag] = useState<string | null>(null)

  const addTodo = useCallback(
    (text: string, priority: Priority) => {
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
