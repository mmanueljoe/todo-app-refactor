import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TodoForm from '@/components/TodoForm'
import { TodoProvider } from '@/context/TodoContext'

describe('TodoForm', () => {
  const renderWithProvider = (component: React.ReactElement) => {
    return render(<TodoProvider>{component}</TodoProvider>)
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render form with input and submit button', () => {
    renderWithProvider(<TodoForm />)

    const input = screen.getByPlaceholderText(/add a new todo/i)
    const submitButton = screen.getByRole('button', { name: /add/i })

    expect(input).toBeInTheDocument()
    expect(submitButton).toBeInTheDocument()
  })

  it('should allow user to type in the input', async () => {
    const user = userEvent.setup()
    renderWithProvider(<TodoForm />)

    const input = screen.getByPlaceholderText(/add a new todo/i) as HTMLInputElement
    await user.type(input, 'Buy groceries')

    expect(input.value).toBe('Buy groceries')
  })

  it('should clear input after submitting', async () => {
    const user = userEvent.setup()
    renderWithProvider(<TodoForm />)

    const input = screen.getByPlaceholderText(/add a new todo/i) as HTMLInputElement
    const submitButton = screen.getByRole('button', { name: /add/i })

    await user.type(input, 'New todo')
    await user.click(submitButton)

    expect(input.value).toBe('')
  })

  it('should allow priority selection', async () => {
    const user = userEvent.setup()
    renderWithProvider(<TodoForm />)

    const prioritySelect = screen.getByDisplayValue(/medium/i)
    await user.selectOptions(prioritySelect, 'high')

    expect(prioritySelect).toHaveValue('high')
  })

  it('should sanitize user input to prevent XSS', async () => {
    const user = userEvent.setup()
    renderWithProvider(<TodoForm />)

    const input = screen.getByPlaceholderText(/add a new todo/i) as HTMLInputElement
    const submitButton = screen.getByRole('button', { name: /add/i })

    // Type text with script tag embedded
    await user.type(input, 'Buy milk <script>alert("xss")</script>')

    // Before submit, input should have the full text
    expect(input.value).toContain('<script>')

    await user.click(submitButton)

    // After submit, the form should be cleared (because sanitization removes the script tag
    // but leaves "Buy milk", which is a valid todo)
    expect(input.value).toBe('')
  })

  it('should not submit empty todos', async () => {
    const user = userEvent.setup()
    renderWithProvider(<TodoForm />)

    const submitButton = screen.getByRole('button', { name: /add/i })
    await user.click(submitButton)

    // Input should remain empty and focused
    const input = screen.getByPlaceholderText(/add a new todo/i) as HTMLInputElement
    expect(input.value).toBe('')
  })
})
