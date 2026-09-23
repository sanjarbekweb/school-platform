import React from 'react'
import Link from 'next/link'
import { getPayloadClient } from '@/lib/payload'
import { AlertCircle, ArrowRight, Bell } from 'lucide-react'
import { getActiveNoticesWhere } from '@/lib/notices'

export async function AnnouncementBanner() {
  try {
    const payload = await getPayloadClient()
    const nowIso = new Date().toISOString()

    const notices = await payload.find({
      collection: 'notices',
      where: getActiveNoticesWhere(nowIso),
      limit: 1,
      sort: '-priority',
    })

    if (!notices.docs || notices.docs.length === 0) {
      return null
    }

    const activeNotice = notices.docs[0]
    const isUrgent = activeNotice.priority === 'shoshilinch'
    const isImportant = activeNotice.priority === 'muhim'

    const bgGradient = isUrgent 
      ? 'linear-gradient(90deg, #991b1b 0%, #dc2626 100%)' 
      : isImportant 
      ? 'linear-gradient(90deg, #b45309 0%, #d97706 100%)' 
      : 'linear-gradient(90deg, #1e3a8a 0%, #2563eb 100%)'

    return (
      <aside
        className="announcement-banner no-print"
        aria-label="Rasmiy maktab e’loni"
        style={{
          background: bgGradient,
          color: '#ffffff',
          padding: '0.6rem 1rem',
          fontSize: '0.875rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            flexWrap: 'wrap',
            textAlign: 'center',
          }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}>
            {isUrgent ? <AlertCircle size={16} /> : <Bell size={16} />}
            <span>{isUrgent ? 'DIQQAT!' : isImportant ? 'MUHIM E’LON:' : 'RASMIY XABAR:'}</span>
          </div>

          <span style={{ color: 'rgba(255, 255, 255, 0.95)' }}>
            <strong>{activeNotice.title}:</strong> {activeNotice.content.slice(0, 110)}
            {activeNotice.content.length > 110 ? '...' : ''}
          </span>

          <Link
            href={activeNotice.link || '/elonlar'}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
              color: '#ffffff',
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '0.2rem 0.65rem',
              borderRadius: '9999px',
              fontSize: '0.8rem',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'background 0.2s ease',
            }}
          >
            <span>Batafsil</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </aside>
    )
  } catch {
    return null
  }
}
