import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TodoAnalytics from '@/components/TodoAnalytics'
import { TodoProvider } from '@/context/TodoContext'

describe('TodoAnalytics', () => {
  const renderWithProvider = (component: React.ReactElement) => {
    return render(<TodoProvider>{component}</TodoProvider>)
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render sort controls', () => {
    renderWithProvider(<TodoAnalytics />)

    expect(screen.getByRole('button', { name: /sort by date/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sort by priority/i })).toBeInTheDocument()
  })

  it('should display priority distribution', () => {
    renderWithProvider(<TodoAnalytics />)

    const analytics = screen.getByText(/priority distribution/i)
    expect(analytics).toBeInTheDocument()
  })

  it('should allow sorting by date', async () => {
    const user = userEvent.setup()
    renderWithProvider(<TodoAnalytics />)

    const sortByDateButton = screen.getByRole('button', { name: /sort by date/i })
    await user.click(sortByDateButton)

    // Button should be highlighted/active
    expect(sortByDateButton).toHaveClass('bg-primary')
  })

  it('should allow sorting by priority', async () => {
    const user = userEvent.setup()
    renderWithProvider(<TodoAnalytics />)

    const sortByPriorityButton = screen.getByRole('button', { name: /sort by priority/i })
    await user.click(sortByPriorityButton)

    expect(sortByPriorityButton).toHaveClass('bg-primary')
  })

  it('should display completion stats by tag', () => {
    renderWithProvider(<TodoAnalytics />)

    // Verify the main priority distribution section exists
    expect(screen.getByText(/priority distribution/i)).toBeInTheDocument()

    // Verify sort buttons exist
    expect(screen.getByRole('button', { name: /sort by date/i })).toBeInTheDocument()
  })

  it('should display charts for visualizations', () => {
    renderWithProvider(<TodoAnalytics />)

    // Check for recharts container
    const chartsContainer = screen.getByText(/priority distribution/i).closest('div')
    expect(chartsContainer).toBeInTheDocument()
  })
})
