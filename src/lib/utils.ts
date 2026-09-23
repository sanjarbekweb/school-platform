const UZBEK_MONTHS = [
  'yanvar',
  'fevral',
  'mart',
  'aprel',
  'may',
  'iyun',
  'iyul',
  'avgust',
  'sentyabr',
  'oktyabr',
  'noyabr',
  'dekabr',
]

/**
 * Formats a Date object or ISO string into authentic Uzbek Latin representation
 * e.g., "12-sentyabr, 2026-yil"
 */
export function formatUzbekDate(inputDate?: string | Date | null): string {
  if (!inputDate) return ''
  const date = typeof inputDate === 'string' ? new Date(inputDate) : inputDate
  if (isNaN(date.getTime())) return ''

  const day = date.getDate()
  const month = UZBEK_MONTHS[date.getMonth()]
  const year = date.getFullYear()

  return `${day}-${month}, ${year}-yil`
}

export const formatDate = formatUzbekDate

/**
 * Extracts a safe URL string from a Media relationship object or string
 */
export function getMediaUrl(media: any): string {
  if (!media) return ''
  if (typeof media === 'string') return media
  if (typeof media === 'object' && media.url) return media.url
  return ''
}

/**
 * Checks if a Media object or URL string is a displayable image (not a PDF)
 */
export function isImageMedia(media: any): boolean {
  if (!media) return false
  if (typeof media === 'string') {
    const lower = media.toLowerCase()
    return !lower.endsWith('.pdf') && (lower.endsWith('.jpg') || lower.endsWith('.jpeg') || lower.endsWith('.png') || lower.endsWith('.webp') || lower.endsWith('.svg') || lower.startsWith('/'))
  }
  if (typeof media === 'object') {
    if (media.mimeType && !media.mimeType.startsWith('image/')) return false
    if (media.url && media.url.toLowerCase().endsWith('.pdf')) return false
    return !!media.url
  }
  return false
}

/**
 * Extracts a safe alt text from a Media relationship object
 */
export function getMediaAlt(media: any, fallback = ''): string {
  if (!media || typeof media !== 'object') return fallback
  return media.alt || fallback
}
