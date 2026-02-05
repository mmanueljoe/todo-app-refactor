/**
 * Input Sanitization Utilities
 * 
 * XSS (Cross-Site Scripting) EXPLANATION:
 * 
 * THE PROBLEM:
 * If a user types this as a todo: <script>alert('hacked!')</script>
 * And we render it directly with dangerouslySetInnerHTML...
 * The script could execute and steal user data, cookies, etc.
 * 
 * EXAMPLE OF DANGEROUS CODE:
 * ```tsx
 * // DON'T DO THIS - vulnerable to XSS
 * <div dangerouslySetInnerHTML={{ __html: userInput }} />
 * ```
 * 
 * THE SOLUTION:
 * DOMPurify removes dangerous content while keeping safe HTML
 * - <script> tags are removed
 * - onclick="..." attributes are removed
 * - Safe tags like <b>, <i>, <a> can be kept if configured
 * 
 * WHEN TO USE:
 * - When rendering user input as HTML
 * - When displaying content from external APIs
 * - When using dangerouslySetInnerHTML (try to avoid this!)
 * 
 * NOTE FOR THIS APP:
 * Our todo app uses React's default rendering which automatically
 * escapes HTML. So {todo.text} is safe because React converts
 * <script> to the literal text "&lt;script&gt;".
 * 
 * This utility is provided for cases where you NEED to render HTML,
 * like if you wanted to support bold/italic in todo text.
 */

import DOMPurify from 'dompurify'

/**
 * Sanitize HTML string to prevent XSS attacks
 * 
 * @param dirty - The untrusted HTML string
 * @returns Safe HTML string with dangerous content removed
 * 
 * @example
 * const userInput = '<b>Hello</b><script>alert("xss")</script>'
 * const safe = sanitizeHtml(userInput)
 * // Returns: '<b>Hello</b>' (script tag removed)
 */
export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty)
}

/**
 * Sanitize HTML with custom allowed tags
 * 
 * @param dirty - The untrusted HTML string  
 * @param allowedTags - Array of tag names to allow (e.g., ['b', 'i', 'a'])
 * @returns Safe HTML string
 * 
 * @example
 * const userInput = '<b>Bold</b> <custom>Custom</custom>'
 * const safe = sanitizeHtmlWithTags(userInput, ['b'])
 * // Returns: '<b>Bold</b> Custom' (custom tag removed, text kept)
 */
export function sanitizeHtmlWithTags(dirty: string, allowedTags: string[]): string {
  return DOMPurify.sanitize(dirty, { ALLOWED_TAGS: allowedTags })
}

/**
 * Strip ALL HTML tags, keeping only text content
 * 
 * @param dirty - The untrusted HTML string
 * @returns Plain text with no HTML
 * 
 * @example
 * const userInput = '<b>Hello</b> <script>bad</script> World'
 * const safe = stripHtml(userInput)
 * // Returns: 'Hello  World' (all tags removed)
 */
export function stripHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, { ALLOWED_TAGS: [] })
}

/**
 * Sanitize user input for safe display
 * This is a convenience wrapper that strips all HTML
 * 
 * Use this when you want to display user text but ensure
 * no HTML is interpreted
 * 
 * @param input - User-provided text
 * @returns Sanitized text safe for display
 */
export function sanitizeUserInput(input: string): string {
  // Trim whitespace and strip any HTML
  return stripHtml(input.trim())
}
