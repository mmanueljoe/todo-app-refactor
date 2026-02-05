/**
 * VirtualizedTodoList - Efficiently renders large lists
 * 
 * VIRTUALIZATION EXPLANATION:
 * 
 * Without virtualization (current TodoList):
 * - 1000 todos = 1000 DOM elements rendered
 * - Even if only 10 are visible, all 1000 exist in memory
 * - Scrolling can become laggy
 * - Initial render is slow
 * 
 * With virtualization (this component):
 * - Only renders items that are visible on screen (+ a few buffer items)
 * - 1000 todos might only render ~15 DOM elements at once
 * - Scrolling stays smooth
 * - Initial render is fast
 * 
 * HOW IT WORKS:
 * 1. react-window calculates which items are visible based on scroll position
 * 2. Only those items get rendered
 * 3. As you scroll, items entering view are rendered, items leaving are removed
 * 4. It's like a window sliding over your data
 * 
 * WHEN TO USE VIRTUALIZATION:
 * - Lists with 100+ items
 * - Items with complex rendering
 * - When scrolling feels sluggish
 * - Mobile devices with limited resources
 */

import { memo, useMemo, type ReactElement } from 'react'
import { List, type RowComponentProps } from 'react-window'
import TodoItem from './TodoItem'
import { useTodos } from '@/context/useTodos'
import type { Todo } from '@/types'

// Height of each todo item in pixels
const ITEM_HEIGHT = 80

// Max height of the list before scrolling kicks in
const MAX_LIST_HEIGHT = 500

interface TodoRowProps {
  todos: Todo[]
  toggleTodo: (id: number) => void
  deleteTodo: (id: number) => void
}

// Row component - renders a single todo at a specific index
function Row({ 
  index, 
  style, 
  todos, 
  toggleTodo, 
  deleteTodo 
}: RowComponentProps<TodoRowProps>): ReactElement {
  const todo = todos[index]

  return (
    <div style={style}>
      <TodoItem
        todo={todo}
        onToggle={toggleTodo}
        onDelete={deleteTodo}
      />
    </div>
  )
}

// Section header component
const SectionHeader = memo(function SectionHeader({ 
  title, 
  count 
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

  // Split into incomplete and completed
  const { incompleteTodos, completedTodos } = useMemo(() => ({
    incompleteTodos: filteredTodos.filter(todo => !todo.completed),
    completedTodos: filteredTodos.filter(todo => todo.completed),
  }), [filteredTodos])

  // Row props passed to the virtualized lists
  const incompleteRowProps = useMemo(() => ({
    todos: incompleteTodos,
    toggleTodo,
    deleteTodo,
  }), [incompleteTodos, toggleTodo, deleteTodo])

  const completedRowProps = useMemo(() => ({
    todos: completedTodos,
    toggleTodo,
    deleteTodo,
  }), [completedTodos, toggleTodo, deleteTodo])

  // Calculate list heights (capped at MAX_LIST_HEIGHT)
  const incompleteListHeight = Math.min(
    incompleteTodos.length * ITEM_HEIGHT,
    MAX_LIST_HEIGHT
  )
  const completedListHeight = Math.min(
    completedTodos.length * ITEM_HEIGHT,
    MAX_LIST_HEIGHT
  )

  return (
    <div className="space-y-4">
      {/* Active todos section */}
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

      {/* Completed todos section */}
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

      {/* Empty state */}
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
