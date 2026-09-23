import type { Where } from 'payload'

/**
 * Returns the Where query for actively published school notices.
 * Only notices with status 'faol' whose start date is past/now and expiry date is future/now.
 */
export function getActiveNoticesWhere(nowIso = new Date().toISOString()): Where {
  return {
    and: [
      { status: { equals: 'faol' } },
      { startDate: { less_than_equal: nowIso } },
      { expiryDate: { greater_than_equal: nowIso } },
    ],
  }
}

/**
 * Returns the Where query for past or archived notices.
 * CRITICAL: Never exposes drafts ('qoralama'). Only notices that were active and expired,
 * or explicitly archived by editors.
 */
export function getPastNoticesWhere(nowIso = new Date().toISOString()): Where {
  return {
    and: [
      { status: { not_equals: 'qoralama' } },
      {
        or: [
          { expiryDate: { less_than: nowIso } },
          { status: { equals: 'arxivlangan' } },
        ],
      },
    ],
  }
}

/**
 * In-memory validator to determine whether a notice document is currently active.
 * Used during search filtering or synchronous checks.
 */
export function isNoticeActive(
  notice: {
    status?: string | null
    startDate?: string | null
    expiryDate?: string | null
  },
  referenceDate = new Date(),
): boolean {
  if (notice.status !== 'faol') return false

  const now = referenceDate.getTime()
  if (notice.startDate) {
    const start = new Date(notice.startDate).getTime()
    if (isNaN(start) || start > now) return false
  }

  if (notice.expiryDate) {
    const expiry = new Date(notice.expiryDate).getTime()
    if (isNaN(expiry) || expiry < now) return false
  }

  return true
}

/**
 * In-memory check for whether a notice is public (either currently active or past archive, never draft).
 */
export function isNoticePublic(
  notice: {
    status?: string | null
  },
): boolean {
  return notice.status === 'faol' || notice.status === 'arxivlangan'
}
