import { useContext } from 'react'
import { TodoContext } from './TodoContextType'

export function useTodos() {
  const context = useContext(TodoContext)
  if (context === undefined) {
    throw new Error('useTodos must be used within a TodoProvider')
  }
  return context
}
