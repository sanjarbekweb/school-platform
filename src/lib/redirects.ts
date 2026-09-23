/**
 * Validates and sanitizes a redirect target to prevent open redirect vulnerabilities
 * and infinite redirect loops.
 */
export function sanitizeRedirectTarget(currentPath: string, target?: string | null): string | null {
  if (!target) return null
  const trimmed = target.trim()

  // Disallow external URLs, javascript:, protocol-relative '//attacker.com'
  if (/^(https?:|javascript:|data:|vbscript:|\/\/)/i.test(trimmed)) {
    return null
  }

  // Must be an internal path starting with a single '/'
  if (!trimmed.startsWith('/') || trimmed.startsWith('//')) {
    return null
  }

  // Prevent direct redirect loops
  const normalize = (p: string) => p.replace(/\/+$/, '').toLowerCase()
  if (normalize(currentPath) === normalize(trimmed)) {
    return null
  }

  return trimmed
}
