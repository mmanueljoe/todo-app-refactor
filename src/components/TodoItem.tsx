import { memo, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import type { Todo } from '@/types'

interface TodoItemProps {
  todo: Todo
  onToggle: (id: number) => void
  onDelete: (id: number) => void
}

const TodoItem = memo(function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
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
          {todo.tags.map((tag, index) => (
            <span
              key={`${tag}-${index}`}
              className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded"
            >
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
