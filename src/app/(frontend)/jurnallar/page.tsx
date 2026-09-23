import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getPayloadClient } from '@/lib/payload'
import { getMediaUrl, formatUzbekDate, isImageMedia } from '@/lib/utils'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { Pagination } from '@/components/Pagination'
import { BookMarked, Download, Calendar } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Maktab jurnallari — 142-maktab',
  description: '142-sonli maktabning rasmiy ilmiy-ommabop va ma’rifiy jurnallari to‘plami. PDF shaklida yuklab oling.',
}

export default async function MagazinesIndexPage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = searchParams ? await searchParams : {}
  const rawPage = Array.isArray(resolvedParams.page) ? resolvedParams.page[0] : resolvedParams.page
  const currentPage = rawPage ? Math.max(1, parseInt(rawPage, 10) || 1) : 1

  const payload = await getPayloadClient()

  const magazinesRes = await payload.find({
    collection: 'magazines',
    where: {
      status: { equals: 'nashr_qilingan' },
    },
    sort: '-publishDate',
    limit: 9,
    page: currentPage,
  }).catch(() => ({ docs: [], totalPages: 1, page: 1 }))

  return (
    <div className="section">
      <div className="container">
        <Breadcrumbs items={[{ label: 'Maktab jurnallari' }]} />

        <div style={{ maxWidth: '840px', marginBottom: '2.5rem' }}>
          <span className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>
            Nashrlarimiz
          </span>
          <h1 style={{ fontSize: '2.5rem', lineHeight: 1.2, color: 'var(--color-navy)', marginBottom: '1rem' }}>
            Maktab ilmiy-ijodiy jurnallari
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--color-muted)', lineHeight: 1.6 }}>
            O‘quvchilarimiz va ustozlarimizning ilmiy maqolalari, adabiy ijod namunalari, maktab laboratoriyasidagi kashfiyotlar va yangiliklar aks etgan davriy nashrlar.
          </p>
        </div>

        {magazinesRes.docs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 grid-cols-2-sm grid-cols-3-lg" style={{ gap: '2rem' }}>
              {magazinesRes.docs.map((mag: any) => {
                const pdfUrl = getMediaUrl(mag.pdfFile)
                return (
                  <div key={mag.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                    <Link href={`/jurnallar/${mag.slug}`} style={{ display: 'block', height: '280px', overflow: 'hidden', background: '#f8fafc', position: 'relative' }}>
                      <Image
                        src={isImageMedia(mag.coverImage) ? getMediaUrl(mag.coverImage) : '/images/magazine-cover-2026.svg'}
                        alt={mag.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        style={{ objectFit: 'contain', padding: '1rem', transition: 'transform 0.3s ease' }}
                      />
                      <span className="badge badge-primary" style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                        {mag.issueNumber}
                      </span>
                    </Link>

                    <div className="card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                      {mag.publishDate && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                          <Calendar size={14} />
                          <time dateTime={mag.publishDate}>{formatUzbekDate(mag.publishDate)}</time>
                        </div>
                      )}

                      <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', lineHeight: 1.4 }}>
                        <Link href={`/jurnallar/${mag.slug}`} style={{ color: 'var(--color-navy)' }}>
                          {mag.title}
                        </Link>
                      </h3>

                      {mag.summary && (
                        <p style={{ fontSize: '0.9rem', color: 'var(--color-muted)', lineHeight: 1.6, marginBottom: '1.25rem', flex: 1 }}>
                          {mag.summary.length > 120 ? mag.summary.slice(0, 120) + '...' : mag.summary}
                        </p>
                      )}

                      <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--color-border)', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <Link href={`/jurnallar/${mag.slug}`} className="btn btn-outline" style={{ flex: 1, textAlign: 'center', fontSize: '0.85rem', padding: '0.5rem' }}>
                          Mundarija
                        </Link>
                        {pdfUrl && (
                          <a
                            href={pdfUrl}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary"
                            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', padding: '0.5rem 0.85rem' }}
                            title="PDF formatida yuklab olish"
                          >
                            <Download size={15} /> PDF
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <Pagination
              currentPage={magazinesRes.page || 1}
              totalPages={magazinesRes.totalPages || 1}
              baseUrl="/jurnallar"
            />
          </>
        ) : (
          <div className="card" style={{ padding: '3.5rem', textAlign: 'center', color: 'var(--color-muted)' }}>
            <BookMarked size={48} style={{ color: '#cbd5e1', margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.2rem', color: 'var(--color-navy)', marginBottom: '0.5rem' }}>
              Jurnal nashrlari tayyorlanmoqda
            </h3>
            <p style={{ margin: 0, fontSize: '0.95rem' }}>
              Yangi sonlar tez orada yuklanadi.
            </p>
          </div>
        )}

      </div>
    </div>
  )
}
