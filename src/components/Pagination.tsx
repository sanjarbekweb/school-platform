import React from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  baseUrl: string
  searchParams?: Record<string, string | undefined>
}

export function Pagination({ currentPage, totalPages, baseUrl, searchParams = {} }: PaginationProps) {
  if (totalPages <= 1) return null

  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams()
    for (const [key, value] of Object.entries(searchParams)) {
      if (value && key !== 'page') {
        params.set(key, value)
      }
    }
    if (pageNumber > 1) {
      params.set('page', String(pageNumber))
    }
    const qs = params.toString()
    return qs ? `${baseUrl}?${qs}` : baseUrl
  }

  // Generate page numbers with ellipses
  const pages: (number | string)[] = []
  const delta = 2

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - delta && i <= currentPage + delta)
    ) {
      pages.push(i)
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...')
    }
  }

  return (
    <nav
      className="pagination-nav"
      aria-label="Sahifalar bo‘ylab harakatlanish"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '0.4rem',
        marginTop: '3rem',
        flexWrap: 'wrap',
      }}
    >
      {/* Previous Page Link */}
      {currentPage > 1 ? (
        <Link
          href={createPageUrl(currentPage - 1)}
          className="btn btn-outline"
          aria-label="Oldingi sahifaga o‘tish"
          style={{ padding: '0.45rem 0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
        >
          <ChevronLeft size={16} />
          <span>Oldingi</span>
        </Link>
      ) : (
        <span
          className="btn btn-outline"
          aria-disabled="true"
          style={{
            padding: '0.45rem 0.75rem',
            opacity: 0.4,
            cursor: 'not-allowed',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25rem',
          }}
        >
          <ChevronLeft size={16} />
          <span>Oldingi</span>
        </span>
      )}

      {/* Numbered Page Links */}
      {pages.map((p, idx) => {
        if (p === '...') {
          return (
            <span
              key={`ellipsis-${idx}`}
              style={{ padding: '0.45rem 0.75rem', color: 'var(--color-muted)' }}
              aria-hidden="true"
            >
              ...
            </span>
          )
        }

        const pageNum = p as number
        const isCurrent = pageNum === currentPage

        return isCurrent ? (
          <span
            key={pageNum}
            aria-current="page"
            style={{
              padding: '0.45rem 0.9rem',
              borderRadius: 'var(--radius-sm, 4px)',
              backgroundColor: 'var(--color-primary)',
              color: '#ffffff',
              fontWeight: 600,
              minWidth: '2.4rem',
              textAlign: 'center',
            }}
          >
            {pageNum}
          </span>
        ) : (
          <Link
            key={pageNum}
            href={createPageUrl(pageNum)}
            aria-label={`${pageNum}-sahifaga o‘tish`}
            style={{
              padding: '0.45rem 0.9rem',
              borderRadius: 'var(--radius-sm, 4px)',
              backgroundColor: 'var(--color-surface, #ffffff)',
              color: 'var(--color-navy)',
              border: '1px solid var(--color-border)',
              textDecoration: 'none',
              fontWeight: 500,
              minWidth: '2.4rem',
              textAlign: 'center',
            }}
          >
            {pageNum}
          </Link>
        )
      })}

      {/* Next Page Link */}
      {currentPage < totalPages ? (
        <Link
          href={createPageUrl(currentPage + 1)}
          className="btn btn-outline"
          aria-label="Keyingi sahifaga o‘tish"
          style={{ padding: '0.45rem 0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
        >
          <span>Keyingi</span>
          <ChevronRight size={16} />
        </Link>
      ) : (
        <span
          className="btn btn-outline"
          aria-disabled="true"
          style={{
            padding: '0.45rem 0.75rem',
            opacity: 0.4,
            cursor: 'not-allowed',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25rem',
          }}
        >
          <span>Keyingi</span>
          <ChevronRight size={16} />
        </span>
      )}
    </nav>
  )
}
