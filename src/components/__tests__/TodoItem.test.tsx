import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TodoItem from '@/components/TodoItem'
import type { Todo } from '@/types'

describe('TodoItem', () => {
  const mockTodo: Todo = {
    id: 1,
    text: 'Test todo',
    completed: false,
    priority: 'medium',
    createdAt: Date.now(),
    tags: ['test'],
  }

  const mockHandlers = {
    onToggle: vi.fn(),
    onDelete: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render todo text', () => {
    render(
      <TodoItem
        todo={mockTodo}
        onToggle={mockHandlers.onToggle}
        onDelete={mockHandlers.onDelete}
      />,
    )

    expect(screen.getByText('Test todo')).toBeInTheDocument()
  })

  it('should show completed state with line-through', () => {
    const completedTodo = { ...mockTodo, completed: true }
    render(
      <TodoItem
        todo={completedTodo}
        onToggle={mockHandlers.onToggle}
        onDelete={mockHandlers.onDelete}
      />,
    )

    const text = screen.getByText('Test todo')
    expect(text).toHaveClass('line-through')
  })

  it('should call onToggle when checkbox is clicked', async () => {
    const user = userEvent.setup()
    render(
      <TodoItem
        todo={mockTodo}
        onToggle={mockHandlers.onToggle}
        onDelete={mockHandlers.onDelete}
      />,
    )

    const checkbox = screen.getByRole('checkbox')
    await user.click(checkbox)

    expect(mockHandlers.onToggle).toHaveBeenCalledWith(mockTodo.id)
  })

  it('should call onDelete when delete button is clicked', async () => {
    const user = userEvent.setup()
    render(
      <TodoItem
        todo={mockTodo}
        onToggle={mockHandlers.onToggle}
        onDelete={mockHandlers.onDelete}
      />,
    )

    const deleteButton = screen.getByRole('button', { name: /delete/i })
    await user.click(deleteButton)

    expect(mockHandlers.onDelete).toHaveBeenCalledWith(mockTodo.id)
  })

  it('should display priority with correct color', () => {
    const highPriorityTodo = { ...mockTodo, priority: 'high' as const }
    render(
      <TodoItem
        todo={highPriorityTodo}
        onToggle={mockHandlers.onToggle}
        onDelete={mockHandlers.onDelete}
      />,
    )

    const priorityBadge = screen.getByText(/high/i)
    expect(priorityBadge).toHaveClass('text-destructive')
  })

  it('should display tags', () => {
    const todoWithTags = { ...mockTodo, tags: ['urgent', 'work'] }
    render(
      <TodoItem
        todo={todoWithTags}
        onToggle={mockHandlers.onToggle}
        onDelete={mockHandlers.onDelete}
      />,
    )

    expect(screen.getByText('urgent')).toBeInTheDocument()
    expect(screen.getByText('work')).toBeInTheDocument()
  })

  it('should not call handlers on render', () => {
    render(
      <TodoItem
        todo={mockTodo}
        onToggle={mockHandlers.onToggle}
        onDelete={mockHandlers.onDelete}
      />,
    )

    expect(mockHandlers.onToggle).not.toHaveBeenCalled()
    expect(mockHandlers.onDelete).not.toHaveBeenCalled()
  })
})
