import { useContext } from 'react'
import { TodoContext } from './TodoContextType'

/**
 * Custom hook to use the TodoContext
 * 
 * WHY A CUSTOM HOOK:
 * 1. It's cleaner than writing useContext(TodoContext) everywhere
 * 2. It includes an error check - if someone forgets the Provider, they get a helpful error
 */
export function useTodos() {
  const context = useContext(TodoContext)
  if (context === undefined) {
    throw new Error('useTodos must be used within a TodoProvider')
  }
  return context
}
