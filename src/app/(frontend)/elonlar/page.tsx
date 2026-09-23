import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getCachedNoticesArchive } from '@/lib/data/cached'
import { formatUzbekDate } from '@/lib/utils'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { AlertCircle, Calendar, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Rasmiy e’lonlar va bildirishnomalar',
  description: '142-sonli maktab ma’muriyatining rasmiy e’lonlari va muhim xabarnomalari.',
}

export default async function NoticesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const resolvedParams = await searchParams
  const viewPast = resolvedParams.view === 'past'
  const noticesRes = await getCachedNoticesArchive(viewPast)

  return (
    <div className="section">
      <div className="container">
        <Breadcrumbs items={[{ label: 'Rasmiy e’lonlar' }]} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1>Rasmiy e’lonlar</h1>
            <p style={{ color: 'var(--color-muted)', fontSize: '1.1rem' }}>
              Ota-onalar, o‘quvchilar va pedagogik jamoa uchun rasmiy xabarnomalar.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link
              href="/elonlar"
              className={!viewPast ? 'btn btn-primary' : 'btn btn-outline'}
              style={{ padding: '0.45rem 1rem', fontSize: '0.9rem' }}
            >
              Faol e’lonlar
            </Link>
            <Link
              href="/elonlar?view=past"
              className={viewPast ? 'btn btn-primary' : 'btn btn-outline'}
              style={{ padding: '0.45rem 1rem', fontSize: '0.9rem' }}
            >
              Arxivdagi e’lonlar
            </Link>
          </div>
        </div>

        {noticesRes.docs.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '52rem' }}>
            {noticesRes.docs.map((notice: any) => {
              const isUrgent = notice.priority === 'shoshilinch'
              const isImportant = notice.priority === 'muhim'
              const badgeClass = isUrgent ? 'badge badge-urgent' : isImportant ? 'badge badge-important' : 'badge badge-primary'
              const badgeLabel = isUrgent ? 'Shoshilinch' : isImportant ? 'Muhim' : 'Oddiy'

              return (
                <div key={notice.id} className="card" style={{ borderLeft: isUrgent ? '4px solid #dc2626' : isImportant ? '4px solid #d97706' : '4px solid var(--color-primary)' }}>
                  <div className="card-body">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                      <span className={badgeClass}>{badgeLabel}</span>
                      <span style={{ fontSize: '0.85rem', color: 'var(--color-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Calendar size={14} />
                        Amal qilish muddati: {formatUzbekDate(notice.expiryDate)}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>{notice.title}</h3>
                    <p style={{ color: 'var(--color-text)', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-line' }}>
                      {notice.content}
                    </p>

                    {notice.link && (
                      <div style={{ marginTop: '1rem' }}>
                        <Link href={notice.link} className="btn btn-outline" style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}>
                          Batafsil ma’lumot
                          <ArrowRight size={14} />
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-muted)', maxWidth: '52rem' }}>
            <AlertCircle size={36} style={{ margin: '0 auto 1rem auto', color: 'var(--color-muted)' }} />
            <p style={{ margin: 0, fontSize: '1.05rem' }}>
              {viewPast ? 'Arxivda e’lonlar mavjud emas.' : 'Ayni vaqtda faol shoshilinch e’lonlar yo‘q.'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
