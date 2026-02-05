import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from 'next-themes'

// If the 'next-themes' package is not installed, you need to install it with:
// npm install next-themes
// and for TypeScript types (optional):
// npm install --save-dev @types/next-themes

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
