/**
 * App - Root component with Code Splitting
 *
 * CODE SPLITTING EXPLANATION:
 *
 * Without code splitting:
 * - ALL JavaScript loads before the app shows anything
 * - User waits for everything, even parts they might not use
 *
 * With code splitting (React.lazy):
 * - Components load only when needed
 * - Initial page load is faster
 * - Less JavaScript to download upfront
 *
 * HOW IT WORKS:
 * 1. React.lazy(() => import('./Component')) - tells React to load this later
 * 2. Suspense fallback={<Loading />} - shows something while loading
 * 3. When the component is needed, React loads it and swaps in the real content
 *
 * WHEN TO USE CODE SPLITTING:
 * - Large components that aren't immediately visible
 * - Routes/pages the user might not visit
 * - Heavy components with lots of dependencies
 * - Modals, dialogs, settings panels
 */

import { Suspense, lazy } from 'react'
import { TodoProvider } from '@/context/TodoContext'

// Lazy load components
// These won't be loaded until they're actually rendered
const TodoApp = lazy(() => import('@/components/TodoApp'))

// Loading fallback component
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
    <TodoProvider>
      {/* 
        Suspense catches the "loading" state from lazy components
        and shows the fallback until they're ready
      */}
      <Suspense fallback={<LoadingFallback />}>
        <main className="min-h-screen bg-background">
          <TodoApp />
        </main>
      </Suspense>
    </TodoProvider>
  )
}

export default App
