/**
 * TodoApp - Main container component
 *
 * WHAT CHANGED:
 * Before: Class component that held ALL state and passed it to every child
 * After: Simple layout component - state lives in TodoContext
 *
 * WHY THIS IS BETTER:
 * 1. This component is now just responsible for layout
 * 2. State management is centralized in TodoContext
 * 3. Child components get what they need directly from context
 * 4. No more prop drilling through this component
 *
 * The actual "work" (state, filtering, memoization) happens in:
 * - TodoContext: Global state and memoized computations
 * - Individual components: Their own local state and rendering
 */

import { memo, useState } from 'react'
import TodoForm from './TodoForm'
import TodoList from './TodoList'
import VirtualizedTodoList from './VirtualizedTodoList'
import Stats from './Stats'
import TodoAnalytics from './TodoAnalytics'
import SearchBox from './SearchBox'

const TodoApp = memo(function TodoApp() {
  // Toggle between regular and virtualized list
  // In a real app, you might always use virtualization for large lists
  const [useVirtualization, setUseVirtualization] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">My Todo App</h1>
          <p className="text-muted-foreground">Optimized with React best practices</p>
        </header>

        {/* 
          Notice: No props being passed!
          Each component gets what it needs from TodoContext.
          This eliminates prop drilling entirely.
        */}
        <div className="space-y-6">
          <TodoForm />
          <SearchBox />
          <Stats />
          <TodoAnalytics />

          {/* Toggle for virtualization demo */}
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <input
              type="checkbox"
              id="virtualization"
              checked={useVirtualization}
              onChange={(e) => setUseVirtualization(e.target.checked)}
              className="w-4 h-4 accent-primary"
            />
            <label htmlFor="virtualization" className="text-sm text-foreground">
              Enable list virtualization (better for 100+ items)
            </label>
          </div>

          {/* Render either regular or virtualized list */}
          {useVirtualization ? <VirtualizedTodoList /> : <TodoList />}
        </div>
      </div>
    </div>
  )
})

export default TodoApp
