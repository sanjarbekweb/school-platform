import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getPayloadClient } from '@/lib/payload'
import { getMediaUrl, getMediaAlt } from '@/lib/utils'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { Pagination } from '@/components/Pagination'
import { Trophy, Award, Medal, Calendar, User, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Yutuqlar va mukofotlar — 142-maktab',
  description: '142-sonli maktab o‘quvchilari va pedagoglarining xalqaro, respublika va shahar miqyosidagi yutuqlari.',
}

export default async function AwardsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams
  const rawLevel = Array.isArray(resolvedParams.daraja) ? resolvedParams.daraja[0] : resolvedParams.daraja
  const levelFilter = rawLevel || ''

  const rawPage = Array.isArray(resolvedParams.page) ? resolvedParams.page[0] : resolvedParams.page
  const currentPage = rawPage ? Math.max(1, parseInt(rawPage, 10) || 1) : 1

  const payload = await getPayloadClient()

  const whereClause: any = {
    status: { equals: 'nashr_qilingan' },
  }

  if (levelFilter) {
    whereClause.level = { equals: levelFilter }
  }

  const awardsRes = await payload.find({
    collection: 'awards',
    where: whereClause,
    sort: '-year',
    limit: 9,
    page: currentPage,
  }).catch(() => ({ docs: [], totalPages: 1, page: 1 }))

  const levels = [
    { label: 'Barchasi', value: '' },
    { label: 'Xalqaro bosqich', value: 'xalqaro' },
    { label: 'Respublika bosqichi', value: 'respublika' },
    { label: 'Toshkent shahri', value: 'shahar' },
    { label: 'Tuman bosqichi', value: 'tuman' },
  ]

  const levelLabels: Record<string, string> = {
    xalqaro: 'Xalqaro daraja',
    respublika: 'Respublika bosqichi',
    shahar: 'Toshkent shahar',
    tuman: 'Tuman bosqichi',
  }

  return (
    <div className="section">
      <div className="container">
        <Breadcrumbs items={[{ label: 'Yutuqlar' }]} />

        <div style={{ maxWidth: '840px', marginBottom: '2.5rem' }}>
          <span className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>
            Maktab faxri
          </span>
          <h1 style={{ color: 'var(--color-navy-950)', marginBottom: '0.75rem' }}>
            Maktabimiz yutuqlari va e’tiroflari
          </h1>
          <p style={{ color: 'var(--color-muted)', fontSize: '1.1rem', maxWidth: '44rem' }}>
            Fan olimpiadalari, intellektual tanlovlar, sport bellashuvlari va ilmiy anjumanlarda yuqori o‘rinlarni qo‘lga kiritgan iqtidorli o‘quvchi va ustozlarimiz.
          </p>
        </div>

        {/* Level Filters */}
        <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
          {levels.map((lvl) => {
            const isActive = levelFilter === lvl.value
            const href = lvl.value ? `/yutuqlar?daraja=${lvl.value}` : '/yutuqlar'
            return (
              <Link
                key={lvl.value}
                href={href}
                className={isActive ? 'btn btn-primary' : 'btn btn-outline'}
                style={{ 
                  padding: '0.5rem 1.15rem', 
                  fontSize: '0.875rem',
                  borderRadius: '9999px',
                  fontWeight: 600,
                }}
              >
                {lvl.label}
              </Link>
            )
          })}
        </div>

        {/* Awards Grid */}
        {awardsRes.docs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 grid-cols-2-sm grid-cols-3-lg" style={{ gap: '1.75rem' }}>
              {awardsRes.docs.map((award: any) => (
                <div key={award.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                  {award.photo ? (
                    <div style={{ height: '210px', overflow: 'hidden', background: '#f1f5f9', position: 'relative' }}>
                      <Image
                        src={getMediaUrl(award.photo)}
                        alt={getMediaAlt(award.photo, award.title)}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                  ) : (
                    <div style={{ height: '130px', background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1d4ed8' }}>
                      <Trophy size={48} />
                    </div>
                  )}

                  <div className="card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <span className="badge badge-primary">
                        {levelLabels[award.level] || award.level}
                      </span>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Calendar size={13} /> {award.year}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.15rem', color: 'var(--color-navy-950)', marginBottom: '0.5rem', lineHeight: 1.35 }}>
                      {award.title}
                    </h3>

                    <div style={{ marginBottom: '0.75rem', color: '#059669', fontWeight: 700, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Medal size={17} />
                      <span>{award.result}</span>
                    </div>

                    <p style={{ fontSize: '0.9rem', color: 'var(--color-muted)', marginBottom: '1rem', lineHeight: 1.5 }}>
                      <strong>Tanlov:</strong> {award.competition}
                    </p>

                    <div style={{ marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-navy-950)', fontWeight: 600 }}>
                        <User size={14} color="#1d4ed8" />
                        {award.recipient}
                      </span>

                      {award.relatedNews && typeof award.relatedNews === 'object' && (
                        <Link
                          href={`/yangiliklar/${award.relatedNews.slug}`}
                          style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.8rem' }}
                        >
                          Batafsil <ArrowRight size={12} />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Pagination
              currentPage={awardsRes.page || 1}
              totalPages={awardsRes.totalPages || 1}
              baseUrl="/yutuqlar"
              searchParams={{ daraja: levelFilter }}
            />
          </>
        ) : (
          <div className="card" style={{ padding: '3.5rem 2rem', textAlign: 'center', color: 'var(--color-muted)' }}>
            <Trophy size={48} style={{ color: '#cbd5e1', margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.2rem', color: 'var(--color-navy-950)', marginBottom: '0.5rem' }}>
              Yutuqlar ro‘yxati yangilanmoqda
            </h3>
            <p style={{ margin: 0, fontSize: '0.95rem' }}>
              Ushbu toifa bo‘yicha yangi ma’lumotlar kiritilishi kutilmoqda.
            </p>
          </div>
        )}

      </div>
    </div>
  )
}
