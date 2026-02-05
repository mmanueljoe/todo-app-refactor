import { memo, useMemo } from 'react'
import { useTodos } from '@/context/useTodos'

const Stats = memo(function Stats() {
  const { filteredTodos } = useTodos()

  const stats = useMemo(() => {
    const total = filteredTodos.length
    const completed = filteredTodos.filter((todo) => todo.completed).length
    const pending = total - completed
    const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0

    const highPriority = filteredTodos.filter((todo) => todo.priority === 'high').length
    const mediumPriority = filteredTodos.filter((todo) => todo.priority === 'medium').length
    const lowPriority = filteredTodos.filter((todo) => todo.priority === 'low').length

    return {
      total,
      completed,
      pending,
      completionPercentage,
      highPriority,
      mediumPriority,
      lowPriority,
    }
  }, [filteredTodos])

  return (
    <div className="space-y-4 p-4 bg-card rounded-lg border border-border">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-primary">{stats.total}</div>
          <div className="text-sm text-muted-foreground">Total</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-green-600">{stats.completed}</div>
          <div className="text-sm text-muted-foreground">Completed</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-orange-600">{stats.pending}</div>
          <div className="text-sm text-muted-foreground">Pending</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-primary">{stats.completionPercentage}%</div>
          <div className="text-sm text-muted-foreground">Progress</div>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-semibold text-foreground">Overall Progress</span>
            <span className="text-sm text-muted-foreground">{stats.completionPercentage}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-3">
            <div
              className="bg-primary h-3 rounded-full transition-all"
              style={{ width: `${stats.completionPercentage}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-2">
          <div className="text-center">
            <div className="text-sm font-semibold text-destructive">{stats.highPriority}</div>
            <div className="text-xs text-muted-foreground">High</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-semibold text-orange-600">{stats.mediumPriority}</div>
            <div className="text-xs text-muted-foreground">Medium</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-semibold text-blue-600">{stats.lowPriority}</div>
            <div className="text-xs text-muted-foreground">Low</div>
          </div>
        </div>
      </div>
    </div>
  )
})

export default Stats
