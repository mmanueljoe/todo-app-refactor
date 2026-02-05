import DOMPurify from 'dompurify'

export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty)
}

export function sanitizeHtmlWithTags(dirty: string, allowedTags: string[]): string {
  return DOMPurify.sanitize(dirty, { ALLOWED_TAGS: allowedTags })
}

export function stripHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, { ALLOWED_TAGS: [] })
}

export function sanitizeUserInput(input: string): string {
  return stripHtml(input.trim())
}
