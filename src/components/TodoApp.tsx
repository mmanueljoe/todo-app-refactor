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
 *
 * CODE SPLITTING:
 * TodoAnalytics is lazy-loaded because it's heavier (includes charts).
 * It only loads when the user scrolls to that section.
 */

import { memo, useState, lazy, Suspense } from 'react'
import TodoForm from './TodoForm'
import TodoList from './TodoList'
import VirtualizedTodoList from './VirtualizedTodoList'
import Stats from './Stats'
import SearchBox from './SearchBox'
import { ErrorBoundary } from './ErrorBoundary'

// Lazy load TodoAnalytics since it includes charts and is heavier
const TodoAnalytics = lazy(() => import('./TodoAnalytics'))

// Fallback UI for lazy-loaded analytics
function AnalyticsSkeleton() {
  return (
    <div className="space-y-4 p-4 bg-muted rounded-lg">
      <div className="h-6 bg-muted-foreground/20 rounded w-1/3 animate-pulse" />
      <div className="h-32 bg-muted-foreground/10 rounded animate-pulse" />
    </div>
  )
}

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

          {/* Lazy load analytics - it has charts which are expensive */}
          <ErrorBoundary>
            <Suspense fallback={<AnalyticsSkeleton />}>
              <TodoAnalytics />
            </Suspense>
          </ErrorBoundary>

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
