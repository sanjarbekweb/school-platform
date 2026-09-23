/**
 * Uzbek Latin search text normalizer
 * Unifies various apostrophe / modifier representations:
 * - standard single quote (')
 * - left single curly quote (‘ / \u2018)
 * - right single curly quote (’ / \u2019)
 * - backtick (`)
 * - modifier letter turned comma (ʻ / \u02BB)
 * - modifier letter apostrophe (ʼ / \u02BC)
 */
export function normalizeUzbek(text: string): string {
  if (!text) return ''
  return text
    .toLowerCase()
    .replace(/[\u2018\u2019\u02BB\u02BC`´']/g, "'")
    .trim()
}

/**
 * Strips all apostrophes entirely for fuzzy matching (e.g. "o'qituvchi" -> "oqituvchi")
 */
export function stripUzbekApostrophes(text: string): string {
  if (!text) return ''
  return text
    .toLowerCase()
    .replace(/[\u2018\u2019\u02BB\u02BC`´']/g, '')
    .trim()
}

/**
 * Checks if target string matches query considering Uzbek character variants
 */
export function matchesUzbekQuery(target: string, query: string): boolean {
  if (!target || !query) return false
  const normTarget = normalizeUzbek(target)
  const normQuery = normalizeUzbek(query)

  if (normTarget.includes(normQuery)) {
    return true
  }

  // Fallback: check without any apostrophes
  const strippedTarget = stripUzbekApostrophes(target)
  const strippedQuery = stripUzbekApostrophes(query)

  return strippedTarget.includes(strippedQuery)
}
