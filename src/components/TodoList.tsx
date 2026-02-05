import { memo, useMemo } from 'react'
import TodoItem from './TodoItem'
import { useTodos } from '@/context/useTodos'

const TodoList = memo(function TodoList() {
  const { filteredTodos, toggleTodo, deleteTodo } = useTodos()

  const { incompleteTodos, completedTodos } = useMemo(
    () => ({
      incompleteTodos: filteredTodos.filter((todo) => !todo.completed),
      completedTodos: filteredTodos.filter((todo) => todo.completed),
    }),
    [filteredTodos],
  )

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-3">
          Active ({incompleteTodos.length})
        </h2>
        <div className="space-y-2">
          {incompleteTodos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} onToggle={toggleTodo} onDelete={deleteTodo} />
          ))}
        </div>
        {incompleteTodos.length === 0 && (
          <div className="text-center py-4">
            <p className="text-muted-foreground">No active todos</p>
          </div>
        )}
      </div>

      {completedTodos.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-3">
            Completed ({completedTodos.length})
          </h2>
          <div className="space-y-2">
            {completedTodos.map((todo) => (
              <TodoItem key={todo.id} todo={todo} onToggle={toggleTodo} onDelete={deleteTodo} />
            ))}
          </div>
        </div>
      )}

      {filteredTodos.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            No todos found. Try a different search or add a new todo!
          </p>
        </div>
      )}
    </div>
  )
})

export default TodoList
