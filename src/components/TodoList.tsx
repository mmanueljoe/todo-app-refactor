/**
 * TodoList - Displays the list of todos
 * 
 * OPTIMIZATIONS APPLIED:
 * 1. React.memo - Prevents re-render if props haven't changed
 * 2. useMemo - Caches the split between incomplete/completed todos
 * 3. Uses pre-filtered todos from context (filtering is memoized there)
 * 
 * WHAT CHANGED:
 * Before: Received raw todos and did filtering/sorting here on every render
 * After: Receives already filtered todos from context (filtered once, used everywhere)
 */

import { memo, useMemo } from 'react'
import TodoItem from './TodoItem'
import { useTodos } from '@/context/useTodos'

const TodoList = memo(function TodoList() {
  // Get what we need from context
  // filteredTodos is already memoized in the context
  const { filteredTodos, toggleTodo, deleteTodo } = useTodos()

  // Memoize the split between incomplete and completed
  // Only recalculates when filteredTodos changes
  const { incompleteTodos, completedTodos } = useMemo(() => ({
    incompleteTodos: filteredTodos.filter(todo => !todo.completed),
    completedTodos: filteredTodos.filter(todo => todo.completed),
  }), [filteredTodos])

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-3">
          Active ({incompleteTodos.length})
        </h2>
        <div className="space-y-2">
          {incompleteTodos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
            />
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
            {completedTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
              />
            ))}
          </div>
        </div>
      )}

      {filteredTodos.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No todos found. Try a different search or add a new todo!</p>
        </div>
      )}
    </div>
  )
})

export default TodoList
