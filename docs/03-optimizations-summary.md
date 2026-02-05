# Optimizations Summary

This document summarizes all the optimizations applied to the Todo app.

---

## Task 2: Rendering Optimization and State Refactor

### 1. React.memo on Components

**What we did:** Wrapped all presentational components with `React.memo()`

**Files changed:**

- `TodoItem.tsx`
- `TodoList.tsx`
- `TodoForm.tsx`
- `SearchBox.tsx`
- `Stats.tsx`
- `TodoAnalytics.tsx`
- `TodoApp.tsx`

**How it helps:**
Before: Typing in search box → ALL components re-render
After: Typing in search box → Only SearchBox and filtered list re-render

### 2. useCallback for Event Handlers

**What we did:** Wrapped event handlers in `useCallback()`

**Where:**

- `TodoContext.tsx`: `addTodo`, `toggleTodo`, `deleteTodo`
- `TodoForm.tsx`: `handleSubmit`, `handleInputChange`, `handlePriorityChange`
- `SearchBox.tsx`: `handleChange`
- `TodoAnalytics.tsx`: `handleSortByDate`, `handleSortByPriority`, etc.

**How it helps:**

- Functions maintain the same reference between renders
- Components using `React.memo` won't re-render just because a handler was "recreated"

### 3. useMemo for Derived State

**What we did:** Wrapped expensive calculations in `useMemo()`

**Where:**

- `TodoContext.tsx`: `filteredTodos`, `allTags`
- `Stats.tsx`: All statistics calculations
- `TodoAnalytics.tsx`: `priorityDistribution`, `completionByTag`
- `TodoList.tsx`: `incompleteTodos`, `completedTodos`
- `TodoItem.tsx`: `priorityColor`

**How it helps:**

- Calculations only run when their dependencies change
- Typing in search doesn't recalculate things that don't depend on search

### 4. State Refactor with Context

**What we did:** Created `TodoContext` to hold all shared state

**Files created:**

- `src/context/TodoContext.tsx`

**How it helps:**

- No more prop drilling through multiple component levels
- Components only subscribe to the data they actually need
- State logic is centralized and easier to maintain

### 5. Debouncing on Search

**What we did:** Created `useDebounce` hook and applied it to search

**Files created:**

- `src/hooks/useDebounce.ts`

**How it helps:**

- Typing "hello" triggers 1 search instead of 5
- Reduces unnecessary filtering/rendering while typing

---

## Task 3: Code-Splitting and Security

### 1. Code Splitting with React.lazy

**What we did:** Lazy load the main TodoApp component

**Files changed:**

- `src/App.tsx`

**How it helps:**

- Initial page load is faster
- JavaScript loads on-demand
- Good for larger apps with multiple routes/features

### 2. List Virtualization

**What we did:** Created `VirtualizedTodoList` using react-window

**Files created:**

- `src/components/VirtualizedTodoList.tsx`

**How it helps:**

- Only visible items are rendered (not all 50+)
- Scrolling stays smooth even with 1000+ items
- Less memory usage

### 3. Input Sanitization

**What we did:** Created sanitization utilities using DOMPurify

**Files created:**

- `src/utils/sanitize.ts`

**Files changed:**

- `TodoForm.tsx` (uses sanitization on submit)

**How it helps:**

- Prevents XSS attacks from malicious user input
- Strips dangerous HTML/script tags before storing

---

## Task 4: Modularity and Reusability

### 1. Component Refactoring

**What we did:**

- Converted class components to function components
- Split button components in TodoAnalytics into reusable pieces

**Files changed:**

- `TodoForm.tsx` (was class, now function)
- `TodoApp.tsx` (was class, now function)

### 2. Shared Types

**What we did:** Created single source of truth for TypeScript types

**Files created:**

- `src/types/index.ts`

**How it helps:**

- One place to update types
- No risk of definitions getting out of sync

### 3. Folder Structure

**What we did:** Organized code into logical folders

```
src/
├── components/
├── context/
├── hooks/
├── types/
├── utils/
└── styles/
```

---

## Performance Comparison

### Before (What the Profiler Would Show)

When typing ONE letter in search:

- TodoApp: re-renders
- TodoForm: re-renders (unnecessary)
- SearchBox: re-renders
- Stats: re-renders + recalculates all stats
- TodoAnalytics: re-renders + recalculates all analytics
- TodoList: re-renders + re-filters + re-sorts
- All 50 TodoItems: re-render

**Total: 55+ component renders for 1 keystroke**

### After (What the Profiler Should Show)

When typing ONE letter in search:

- SearchBox: re-renders (local state)
- (300ms debounce delay)
- TodoContext: updates filteredTodos (memoized)
- Stats: re-renders (filteredTodos changed) - stats memoized
- TodoList: re-renders - split memoized
- Only changed TodoItems: re-render

**Total: ~5-10 component renders, calculations cached**

---

## Key Takeaways

1. **React.memo** = "Don't re-render if props didn't change"
2. **useCallback** = "Keep the same function reference"
3. **useMemo** = "Keep the same calculated value"
4. **Context** = "Share data without passing through every component"
5. **Debouncing** = "Wait until user stops typing"
6. **Virtualization** = "Only render what's visible"
7. **Code Splitting** = "Load JavaScript on demand"
8. **Sanitization** = "Clean user input before using it"
