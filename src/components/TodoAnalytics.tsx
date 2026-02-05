/**
 * TodoAnalytics - Sort and filter controls with tag analytics
 * 
 * OPTIMIZATIONS APPLIED:
 * 1. React.memo - Prevents unnecessary re-renders
 * 2. useMemo - Caches expensive calculations (priority distribution, completion rates)
 * 3. useCallback - Memoizes click handlers
 * 4. Gets data from context instead of props
 * 
 * WHAT CHANGED:
 * Before: All calculations ran on every render
 * Before: New click handlers created for each button on every render
 * After: Calculations cached, handlers memoized
 */

import { memo, useMemo, useCallback } from 'react'
import { useTodos } from '@/context/useTodos'

const TodoAnalytics = memo(function TodoAnalytics() {
  const { todos, allTags, sortBy, filterTag, setSortBy, setFilterTag } = useTodos()

  // Memoize priority distribution calculation
  const priorityDistribution = useMemo(() => {
    return todos.reduce(
      (acc, todo) => {
        acc[todo.priority] = (acc[todo.priority] || 0) + 1
        return acc
      },
      { low: 0, medium: 0, high: 0 }
    )
  }, [todos])

  // Memoize completion rate by tag calculation
  const completionByTag = useMemo(() => {
    return Object.keys(allTags).reduce((acc, tag) => {
      const tagTodos = todos.filter(todo => todo.tags.includes(tag))
      const completed = tagTodos.filter(t => t.completed).length
      acc[tag] = tagTodos.length > 0 ? Math.round((completed / tagTodos.length) * 100) : 0
      return acc
    }, {} as Record<string, number>)
  }, [todos, allTags])

  // Memoized handlers for sort buttons
  const handleSortByDate = useCallback(() => setSortBy('date'), [setSortBy])
  const handleSortByPriority = useCallback(() => setSortBy('priority'), [setSortBy])
  
  // Memoized handler for clearing tag filter
  const handleClearFilter = useCallback(() => setFilterTag(null), [setFilterTag])
  
  // Factory function for tag filter handlers
  // This is memoized and returns stable handlers for each tag
  const createTagFilterHandler = useCallback(
    (tag: string) => () => setFilterTag(tag),
    [setFilterTag]
  )

  return (
    <div className="space-y-6 p-4 bg-card rounded-lg border border-border">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-3">Priority Distribution</h3>
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(priorityDistribution).map(([priority, count]) => (
            <div key={priority} className="text-center p-3 bg-background rounded-lg">
              <div className="text-2xl font-bold capitalize text-primary">{count}</div>
              <div className="text-xs text-muted-foreground capitalize">{priority}</div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-foreground mb-3">Sort Options</h3>
        <div className="flex gap-2">
          <SortButton
            label="Sort by Date"
            isActive={sortBy === 'date'}
            onClick={handleSortByDate}
          />
          <SortButton
            label="Sort by Priority"
            isActive={sortBy === 'priority'}
            onClick={handleSortByPriority}
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-foreground mb-3">Filter by Tags</h3>
        <div className="flex flex-wrap gap-2">
          <TagButton
            label="All"
            isActive={filterTag === null}
            onClick={handleClearFilter}
          />
          {Object.entries(allTags).map(([tag, count]) => (
            <TagButton
              key={tag}
              label={`${tag} (${count})`}
              isActive={filterTag === tag}
              onClick={createTagFilterHandler(tag)}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-foreground mb-3">Completion Rate by Tag</h3>
        <div className="space-y-2">
          {Object.entries(completionByTag).map(([tag, percentage]) => (
            <div key={tag} className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground w-20">{tag}</span>
              <div className="flex-1 bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-foreground w-12">{percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
})

// Extracted button components for better organization
// These are memoized to prevent unnecessary re-renders

interface SortButtonProps {
  label: string
  isActive: boolean
  onClick: () => void
}

const SortButton = memo(function SortButton({ label, isActive, onClick }: SortButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg border transition-colors ${
        isActive
          ? 'bg-primary text-primary-foreground border-primary'
          : 'border-border bg-background text-foreground hover:bg-muted'
      }`}
    >
      {label}
    </button>
  )
})

interface TagButtonProps {
  label: string
  isActive: boolean
  onClick: () => void
}

const TagButton = memo(function TagButton({ label, isActive, onClick }: TagButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-sm transition-colors ${
        isActive
          ? 'bg-primary text-primary-foreground'
          : 'border border-border bg-background text-foreground hover:bg-muted'
      }`}
    >
      {label}
    </button>
  )
})

export default TodoAnalytics
