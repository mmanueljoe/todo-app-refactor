import { memo, useState, lazy, Suspense } from 'react'
import TodoForm from './TodoForm'
import TodoList from './TodoList'
import VirtualizedTodoList from './VirtualizedTodoList'
import Stats from './Stats'
import SearchBox from './SearchBox'
import { ErrorBoundary } from './ErrorBoundary'

const TodoAnalytics = lazy(() => import('./TodoAnalytics'))

function AnalyticsSkeleton() {
  return (
    <div className="space-y-4 p-4 bg-muted rounded-lg">
      <div className="h-6 bg-muted-foreground/20 rounded w-1/3 animate-pulse" />
      <div className="h-32 bg-muted-foreground/10 rounded animate-pulse" />
    </div>
  )
}

const TodoApp = memo(function TodoApp() {
  const [useVirtualization, setUseVirtualization] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">My Todo App</h1>
          <p className="text-muted-foreground">Optimized with React best practices</p>
        </header>

        <div className="space-y-6">
          <TodoForm />
          <SearchBox />
          <Stats />

          <ErrorBoundary>
            <Suspense fallback={<AnalyticsSkeleton />}>
              <TodoAnalytics />
            </Suspense>
          </ErrorBoundary>

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

          {useVirtualization ? <VirtualizedTodoList /> : <TodoList />}
        </div>
      </div>
    </div>
  )
})

export default TodoApp
