import React from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export interface BreadcrumbItem {
  label: string
  href?: string
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Non ushoqlari (Breadcrumbs)" className="no-print" style={{ marginBottom: '1.5rem' }}>
      <ol style={{
        listStyle: 'none',
        padding: 0,
        margin: 0,
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
        fontSize: '0.85rem',
        color: 'var(--color-muted)',
        flexWrap: 'wrap',
      }}>
        <li>
          <Link href="/" style={{ color: 'var(--color-muted)' }}>Bosh sahifa</Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <React.Fragment key={index}>
              <li aria-hidden="true" style={{ display: 'flex', alignItems: 'center' }}>
                <ChevronRight size={14} />
              </li>
              <li aria-current={isLast ? 'page' : undefined}>
                {item.href && !isLast ? (
                  <Link href={item.href} style={{ color: 'var(--color-muted)' }}>{item.label}</Link>
                ) : (
                  <span style={{ color: 'var(--color-navy)', fontWeight: 600 }}>{item.label}</span>
                )}
              </li>
            </React.Fragment>
          )
        })}
      </ol>
    </nav>
  )
}
