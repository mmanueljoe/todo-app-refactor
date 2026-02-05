import { Suspense, lazy } from 'react'
import { TodoProvider } from '@/context/TodoContext'
import { ErrorBoundary } from '@/components/ErrorBoundary'

const TodoApp = lazy(() => import('@/components/TodoApp'))

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <TodoProvider>
        <Suspense fallback={<LoadingFallback />}>
          <main className="min-h-screen bg-background">
            <TodoApp />
          </main>
        </Suspense>
      </TodoProvider>
    </ErrorBoundary>
  )
}

export default App
