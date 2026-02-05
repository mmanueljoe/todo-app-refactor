/**
 * Shared type definitions for the Todo app
 * 
 * WHY THIS FILE EXISTS:
 * Previously, the Todo interface was copy-pasted in 5 different files.
 * If we needed to add a new field, we'd have to update all 5 files.
 * Now there's one source of truth - change it here, and it updates everywhere.
 */

export interface Todo {
  id: number
  text: string
  completed: boolean
  createdAt: number
  priority: "low" | "medium" | "high"
  tags: string[]
}

export type Priority = "low" | "medium" | "high"

export type SortBy = "date" | "priority"
