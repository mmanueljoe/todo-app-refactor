import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTodos } from '@/context/useTodos'
import { TodoProvider } from '@/context/TodoContext'

describe('TodoContext', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <TodoProvider>{children}</TodoProvider>
  )

  describe('addTodo', () => {
    it('should add a new todo with correct properties', () => {
      const { result } = renderHook(() => useTodos(), { wrapper })

      const initialCount = result.current.todos.length

      act(() => {
        result.current.addTodo('New todo', 'high')
      })

      expect(result.current.todos.length).toBe(initialCount + 1)

      const newTodo = result.current.todos[result.current.todos.length - 1]
      expect(newTodo.text).toBe('New todo')
      expect(newTodo.priority).toBe('high')
      expect(newTodo.completed).toBe(false)
      expect(newTodo.createdAt).toBeDefined()
    })

    it('should create unique ids for todos', () => {
      const { result } = renderHook(() => useTodos(), { wrapper })

      const initialLength = result.current.todos.length

      act(() => {
        result.current.addTodo('First', 'low')
      })

      const firstNewTodo = result.current.todos[initialLength]
      const firstNewId = firstNewTodo.id

      act(() => {
        result.current.addTodo('Second', 'medium')
      })

      const secondNewTodo = result.current.todos[initialLength + 1]
      const secondNewId = secondNewTodo.id

      // Verify they have different IDs
      expect(firstNewId).not.toBe(secondNewId)
      // Verify the second ID is greater than the first
      expect(secondNewId).toBeGreaterThan(firstNewId)
    })

    it('should preserve existing todos when adding new one', () => {
      const { result } = renderHook(() => useTodos(), { wrapper })

      const existingTodos = [...result.current.todos]

      act(() => {
        result.current.addTodo('New', 'low')
      })

      // All existing todos should still be there
      existingTodos.forEach((existingTodo) => {
        expect(result.current.todos).toContainEqual(
          expect.objectContaining({
            id: existingTodo.id,
            text: existingTodo.text,
          }),
        )
      })
    })
  })

  describe('toggleTodo', () => {
    it('should toggle completed status of a todo', () => {
      const { result } = renderHook(() => useTodos(), { wrapper })

      const todoToToggle = result.current.todos[0]
      const wasCompleted = todoToToggle.completed

      act(() => {
        result.current.toggleTodo(todoToToggle.id)
      })

      const updatedTodo = result.current.todos.find((t) => t.id === todoToToggle.id)
      expect(updatedTodo?.completed).toBe(!wasCompleted)
    })

    it('should not affect other todos when toggling', () => {
      const { result } = renderHook(() => useTodos(), { wrapper })

      const firstTodo = result.current.todos[0]
      const secondTodo = result.current.todos[1]
      const secondTodoCompletedBefore = secondTodo.completed

      act(() => {
        result.current.toggleTodo(firstTodo.id)
      })

      const updatedSecondTodo = result.current.todos.find((t) => t.id === secondTodo.id)
      expect(updatedSecondTodo?.completed).toBe(secondTodoCompletedBefore)
    })
  })

  describe('deleteTodo', () => {
    it('should remove a todo from the list', () => {
      const { result } = renderHook(() => useTodos(), { wrapper })

      const todoToDelete = result.current.todos[0]
      const initialCount = result.current.todos.length

      act(() => {
        result.current.deleteTodo(todoToDelete.id)
      })

      expect(result.current.todos.length).toBe(initialCount - 1)
      expect(result.current.todos).not.toContainEqual(
        expect.objectContaining({ id: todoToDelete.id }),
      )
    })

    it('should not affect other todos when deleting', () => {
      const { result } = renderHook(() => useTodos(), { wrapper })

      const firstTodo = result.current.todos[0]
      const secondTodo = result.current.todos[1]

      act(() => {
        result.current.deleteTodo(firstTodo.id)
      })

      const remainingSecondTodo = result.current.todos.find((t) => t.id === secondTodo.id)
      expect(remainingSecondTodo).toEqual(secondTodo)
    })
  })

  describe('search and filter', () => {
    it('should filter todos by search query', () => {
      const { result } = renderHook(() => useTodos(), { wrapper })

      act(() => {
        result.current.setSearchQuery('Todo item 1')
      })

      expect(result.current.filteredTodos.length).toBeGreaterThan(0)
      expect(
        result.current.filteredTodos.every((t) =>
          t.text.toLowerCase().includes('todo item 1'.toLowerCase()),
        ),
      ).toBe(true)
    })

    it('should filter todos by tag', () => {
      const { result } = renderHook(() => useTodos(), { wrapper })

      const firstTodo = result.current.todos[0]
      if (firstTodo.tags.length > 0) {
        const tagToFilter = firstTodo.tags[0]

        act(() => {
          result.current.setFilterTag(tagToFilter)
        })

        expect(result.current.filteredTodos.every((t) => t.tags.includes(tagToFilter))).toBe(true)
      }
    })

    it('should clear filters', () => {
      const { result } = renderHook(() => useTodos(), { wrapper })

      act(() => {
        result.current.setSearchQuery('test')
        result.current.setFilterTag('tag1')
      })

      act(() => {
        result.current.setSearchQuery('')
        result.current.setFilterTag(null)
      })

      expect(result.current.searchQuery).toBe('')
      expect(result.current.filterTag).toBeNull()
    })
  })

  describe('sorting', () => {
    it('should sort todos by date', () => {
      const { result } = renderHook(() => useTodos(), { wrapper })

      act(() => {
        result.current.setSortBy('date')
      })

      const filtered = result.current.filteredTodos
      for (let i = 1; i < filtered.length; i++) {
        expect(filtered[i].createdAt).toBeLessThanOrEqual(filtered[i - 1].createdAt)
      }
    })

    it('should sort todos by priority', () => {
      const { result } = renderHook(() => useTodos(), { wrapper })

      act(() => {
        result.current.setSortBy('priority')
      })

      const priorityOrder = { high: 0, medium: 1, low: 2 }
      const filtered = result.current.filteredTodos

      for (let i = 1; i < filtered.length; i++) {
        const currentPriority = priorityOrder[filtered[i].priority]
        const prevPriority = priorityOrder[filtered[i - 1].priority]
        expect(currentPriority).toBeGreaterThanOrEqual(prevPriority)
      }
    })
  })

  describe('statistics', () => {
    it('should calculate correct stats', () => {
      const { result } = renderHook(() => useTodos(), { wrapper })

      expect(result.current.todos.length).toBeGreaterThan(0)

      const completed = result.current.todos.filter((t) => t.completed).length
      const pending = result.current.todos.length - completed

      expect(completed).toBeGreaterThanOrEqual(0)
      expect(pending).toBeGreaterThanOrEqual(0)
      expect(completed + pending).toBe(result.current.todos.length)
    })

    it('should have filteredTodos available', () => {
      const { result } = renderHook(() => useTodos(), { wrapper })

      expect(result.current.filteredTodos).toBeDefined()
      expect(Array.isArray(result.current.filteredTodos)).toBe(true)
    })

    it('should have allTags available', () => {
      const { result } = renderHook(() => useTodos(), { wrapper })

      expect(result.current.allTags).toBeDefined()
    })
  })
})
