/**
 * TodoItem - A single todo item
 *
 * OPTIMIZATIONS APPLIED:
 * 1. React.memo - Only re-renders if props actually change
 * 2. useCallback isn't needed here because we receive stable callbacks from context
 * 3. useMemo for priorityColor - though this is a micro-optimization
 *
 * WHY React.memo MATTERS HERE:
 * Without it: Toggling todo #1 would re-render ALL 50 todo items
 * With it: Only todo #1 re-renders (its 'completed' prop changed)
 */

import { memo, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import type { Todo } from '@/types'

interface TodoItemProps {
  todo: Todo
  onToggle: (id: number) => void
  onDelete: (id: number) => void
}

// React.memo wraps the component to prevent unnecessary re-renders
// It does a shallow comparison of props - if they're the same, skip re-rendering
const TodoItem = memo(function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  // Memoize the priority color calculation
  // This is a small optimization - the real win is from React.memo
  const priorityColor = useMemo(() => {
    switch (todo.priority) {
      case 'high':
        return 'text-destructive'
      case 'medium':
        return 'text-orange-600'
      case 'low':
        return 'text-blue-600'
    }
  }, [todo.priority])

  // These handlers are simple wrappers that call the memoized callbacks from context
  // They're stable because onToggle and onDelete are memoized with useCallback
  const handleToggle = () => onToggle(todo.id)
  const handleDelete = () => onDelete(todo.id)

  return (
    <div className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border hover:bg-muted transition-colors">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={handleToggle}
        className="w-5 h-5 accent-primary rounded"
      />
      <div className="flex-1">
        <span
          className={`block ${todo.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}
        >
          {todo.text}
        </span>
        <div className="flex gap-2 mt-1 flex-wrap">
          <span className={`text-xs font-semibold ${priorityColor}`}>
            {todo.priority.toUpperCase()}
          </span>
          {todo.tags.map((tag) => (
            <span key={tag} className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded">
              {tag}
            </span>
          ))}
        </div>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={handleDelete}
        className="text-destructive hover:bg-destructive/10"
      >
        Delete
      </Button>
    </div>
  )
})

export default TodoItem
