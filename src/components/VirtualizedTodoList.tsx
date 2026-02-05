import { memo, useMemo, type ReactElement } from 'react'
import { List, type RowComponentProps } from 'react-window'
import TodoItem from './TodoItem'
import { useTodos } from '@/context/useTodos'
import type { Todo } from '@/types'

const ITEM_HEIGHT = 80

const MAX_LIST_HEIGHT = 500

interface TodoRowProps {
  todos: Todo[]
  toggleTodo: (id: number) => void
  deleteTodo: (id: number) => void
}

function Row({
  index,
  style,
  todos,
  toggleTodo,
  deleteTodo,
}: RowComponentProps<TodoRowProps>): ReactElement {
  const todo = todos[index]

  return (
    <div style={style}>
      <TodoItem todo={todo} onToggle={toggleTodo} onDelete={deleteTodo} />
    </div>
  )
}

const SectionHeader = memo(function SectionHeader({
  title,
  count,
}: {
  title: string
  count: number
}) {
  return (
    <h2 className="text-xl font-semibold text-foreground mb-3">
      {title} ({count})
    </h2>
  )
})

const VirtualizedTodoList = memo(function VirtualizedTodoList() {
  const { filteredTodos, toggleTodo, deleteTodo } = useTodos()

  const { incompleteTodos, completedTodos } = useMemo(
    () => ({
      incompleteTodos: filteredTodos.filter((todo) => !todo.completed),
      completedTodos: filteredTodos.filter((todo) => todo.completed),
    }),
    [filteredTodos],
  )

  const incompleteRowProps = useMemo(
    () => ({
      todos: incompleteTodos,
      toggleTodo,
      deleteTodo,
    }),
    [incompleteTodos, toggleTodo, deleteTodo],
  )

  const completedRowProps = useMemo(
    () => ({
      todos: completedTodos,
      toggleTodo,
      deleteTodo,
    }),
    [completedTodos, toggleTodo, deleteTodo],
  )

  const incompleteListHeight = Math.min(incompleteTodos.length * ITEM_HEIGHT, MAX_LIST_HEIGHT)
  const completedListHeight = Math.min(completedTodos.length * ITEM_HEIGHT, MAX_LIST_HEIGHT)

  return (
    <div className="space-y-4">
      <div>
        <SectionHeader title="Active" count={incompleteTodos.length} />
        {incompleteTodos.length > 0 ? (
          <List
            style={{ height: incompleteListHeight }}
            rowCount={incompleteTodos.length}
            rowHeight={ITEM_HEIGHT}
            rowComponent={Row}
            rowProps={incompleteRowProps}
          />
        ) : (
          <div className="text-center py-4">
            <p className="text-muted-foreground">No active todos</p>
          </div>
        )}
      </div>

      {completedTodos.length > 0 && (
        <div>
          <SectionHeader title="Completed" count={completedTodos.length} />
          <List
            style={{ height: completedListHeight }}
            rowCount={completedTodos.length}
            rowHeight={ITEM_HEIGHT}
            rowComponent={Row}
            rowProps={completedRowProps}
          />
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

export default VirtualizedTodoList
