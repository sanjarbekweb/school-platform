import React from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getPayloadClient } from '@/lib/payload'
import { getMediaUrl, formatUzbekDate, isImageMedia } from '@/lib/utils'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { Download, Calendar, FileText, ChevronLeft, BookOpen, Layers } from 'lucide-react'

interface PageProps {
  params: Promise<{ slug: string }>
}

export const dynamic = 'force-static'
export const dynamicParams = true

export async function generateStaticParams() {
  try {
    const payload = await getPayloadClient()
    const res = await payload.find({
      collection: 'magazines',
      where: { status: { equals: 'nashr_qilingan' } },
      limit: 100,
    })
    return res.docs.map((doc: any) => ({ slug: doc.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayloadClient()

  const res = await payload.find({
    collection: 'magazines',
    where: {
      slug: { equals: slug },
      status: { equals: 'nashr_qilingan' },
    },
    limit: 1,
  }).catch(() => ({ docs: [] }))

  const mag = res.docs[0]
  if (!mag) {
    return { title: 'Jurnal topilmadi' }
  }

  return {
    title: `${mag.title} (${mag.issueNumber}) — Maktab jurnali`,
    description: mag.summary || `${mag.title} jurnali. 142-maktab rasmiy nashri.`,
  }
}

export default async function MagazineDetailPage({ params }: PageProps) {
  const { slug } = await params
  const payload = await getPayloadClient()

  const res = await payload.find({
    collection: 'magazines',
    where: {
      slug: { equals: slug },
      status: { equals: 'nashr_qilingan' },
    },
    limit: 1,
  }).catch(() => ({ docs: [] }))

  const mag = res.docs[0]
  if (!mag) {
    notFound()
  }

  const pdfUrl = getMediaUrl(mag.pdfFile)

  return (
    <div className="section">
      <div className="container">
        <Breadcrumbs
          items={[
            { label: 'Maktab jurnallari', href: '/jurnallar' },
            { label: mag.issueNumber },
          ]}
        />

        <div style={{ marginBottom: '1.5rem' }}>
          <Link href="/jurnallar" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-navy)', fontSize: '0.9rem', fontWeight: 500 }}>
            <ChevronLeft size={16} /> Barcha jurnallarga qaytish
          </Link>
        </div>

        <div className="detail-split-grid">
          {/* Left Column: Cover & Download Button */}
          <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ maxHeight: '420px', overflow: 'hidden', borderRadius: 'var(--radius-md)', background: '#f8fafc', marginBottom: '1.5rem', boxShadow: 'var(--shadow-md)' }}>
              <Image
                src={isImageMedia(mag.coverImage) ? getMediaUrl(mag.coverImage) : '/images/magazine-cover-2026.svg'}
                alt={mag.title}
                width={400}
                height={530}
                priority
                style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
              />
            </div>

            {pdfUrl ? (
              <a
                href={pdfUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.85rem' }}
              >
                <Download size={18} /> Jurnalni yuklab olish (PDF)
              </a>
            ) : (
              <div style={{ color: 'var(--color-muted)', fontSize: '0.9rem' }}>
                Fayl kiritilmagan
              </div>
            )}

            <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-around', fontSize: '0.85rem', color: 'var(--color-muted)' }}>
              {mag.fileSize && (
                <div>
                  <span style={{ display: 'block', fontWeight: 600, color: 'var(--color-navy)' }}>{mag.fileSize}</span>
                  Hajmi
                </div>
              )}
              {mag.pageCount && (
                <div>
                  <span style={{ display: 'block', fontWeight: 600, color: 'var(--color-navy)' }}>{mag.pageCount} bet</span>
                  Sahifalar
                </div>
              )}
              <div>
                <span style={{ display: 'block', fontWeight: 600, color: 'var(--color-navy)' }}>PDF</span>
                Format
              </div>
            </div>
          </div>

          {/* Right Column: Title, Metadata, Summary, Table of Contents */}
          <div>
            <span className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>
              {mag.issueNumber}
            </span>

            <h1 style={{ fontSize: '2.2rem', lineHeight: 1.2, color: 'var(--color-navy)', marginBottom: '0.75rem' }}>
              {mag.title}
            </h1>

            {mag.publishDate && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-muted)', fontSize: '0.95rem', marginBottom: '1.75rem' }}>
                <Calendar size={16} />
                <time dateTime={mag.publishDate}>{formatUzbekDate(mag.publishDate)}</time>
              </div>
            )}

            {mag.summary && (
              <div className="card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--color-navy)', marginBottom: '0.75rem' }}>
                  Nashr haqida qisqacha
                </h3>
                <p style={{ margin: 0, lineHeight: 1.7, color: '#334155', fontSize: '1rem', whiteSpace: 'pre-line' }}>
                  {mag.summary}
                </p>
              </div>
            )}

            {mag.contentsList && (
              <div className="card" style={{ padding: '1.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <Layers size={20} style={{ color: 'var(--color-primary)' }} />
                  <h3 style={{ fontSize: '1.2rem', margin: 0, color: 'var(--color-navy)' }}>
                    Jurnal mundarijasi
                  </h3>
                </div>
                <div style={{ lineHeight: 1.8, color: '#334155', whiteSpace: 'pre-line', fontSize: '0.95rem' }}>
                  {mag.contentsList}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
