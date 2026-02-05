# Project Folder Structure

This document explains how the refactored project is organized.

```
src/
├── components/           # React components
│   ├── ui/              # Reusable UI components (buttons, inputs, etc.)
│   ├── TodoApp.tsx      # Main app container
│   ├── TodoForm.tsx     # Form for adding todos
│   ├── TodoList.tsx     # Regular list component
│   ├── VirtualizedTodoList.tsx  # Optimized list for large data
│   ├── TodoItem.tsx     # Single todo item
│   ├── SearchBox.tsx    # Search input with debouncing
│   ├── Stats.tsx        # Statistics display
│   └── TodoAnalytics.tsx # Sort/filter controls
│
├── context/             # React Context for state management
│   └── TodoContext.tsx  # Global todo state and actions
│
├── hooks/               # Custom React hooks
│   └── useDebounce.ts   # Delays value updates (for search)
│
├── types/               # TypeScript type definitions
│   └── index.ts         # Shared types (Todo, Priority, etc.)
│
├── utils/               # Utility functions
│   └── sanitize.ts      # Input sanitization (XSS protection)
│
├── styles/              # CSS files
│   └── globals.css      # Global styles and Tailwind config
│
├── App.tsx              # Root component with providers
└── main.tsx             # Entry point
```

## Why This Structure?

### Feature-Based Organization

Instead of grouping by type (all components together, all hooks together), we could also organize by feature:

```
src/
├── features/
│   ├── todos/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── context/
│   └── search/
│       ├── components/
│       └── hooks/
```

For this small app, the current structure works well. For larger apps, feature-based organization can be better.

### What Goes Where

| Folder        | What to Put Here                         |
| ------------- | ---------------------------------------- |
| `components/` | React components that render UI          |
| `context/`    | React Context providers for shared state |
| `hooks/`      | Custom hooks (reusable logic)            |
| `types/`      | TypeScript interfaces and types          |
| `utils/`      | Pure functions that don't use React      |
| `styles/`     | CSS files                                |

### Benefits of This Structure

1. **Easy to Find**: Looking for todo-related logic? Check `context/TodoContext.tsx`
2. **Easy to Test**: Pure utilities in `utils/` can be tested without React
3. **Reusable**: Hooks in `hooks/` can be used in any component
4. **Scalable**: Easy to add new features without cluttering existing folders
