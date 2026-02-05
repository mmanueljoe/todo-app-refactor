export interface Todo {
  id: number
  text: string
  completed: boolean
  createdAt: number
  priority: 'low' | 'medium' | 'high'
  tags: string[]
}

export type Priority = 'low' | 'medium' | 'high'

export type SortBy = 'date' | 'priority'
