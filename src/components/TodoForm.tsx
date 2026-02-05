import { memo, useState, useCallback, type FormEvent, type ChangeEvent } from 'react'
import { Button } from '@/components/ui/button'
import { useTodos } from '@/context/useTodos'
import { sanitizeUserInput } from '@/utils/sanitize'
import type { Priority } from '@/types'

const TodoForm = memo(function TodoForm() {
  const [inputValue, setInputValue] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')

  const { addTodo } = useTodos()

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }, [])

  const handlePriorityChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    setPriority(e.target.value as Priority)
  }, [])

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()

      const sanitizedText = sanitizeUserInput(inputValue)
      if (sanitizedText) {
        addTodo(sanitizedText, priority)
        setInputValue('')
        setPriority('medium')
      }
    },
    [inputValue, priority, addTodo],
  )

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <select
        value={priority}
        onChange={handlePriorityChange}
        className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Add a new todo..."
        className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
      />
      <Button type="submit" className="bg-primary text-primary-foreground">
        Add
      </Button>
    </form>
  )
})

export default TodoForm
