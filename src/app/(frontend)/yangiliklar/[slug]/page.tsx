import React from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getPayloadClient } from '@/lib/payload'
import { formatUzbekDate, getMediaUrl, getMediaAlt } from '@/lib/utils'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { RichTextRenderer } from '@/components/RichTextRenderer'
import { Calendar, Tag, ArrowLeft } from 'lucide-react'

export const dynamic = 'force-static'
export const dynamicParams = true

export async function generateStaticParams() {
  try {
    const payload = await getPayloadClient()
    const res = await payload.find({
      collection: 'news',
      where: { status: { equals: 'nashr_qilingan' } },
      limit: 100,
    })
    return res.docs.map((doc: any) => ({ slug: doc.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayloadClient()

  const article = await payload.find({
    collection: 'news',
    where: { slug: { equals: slug } },
    limit: 1,
  }).catch(() => null)

  const doc = article?.docs?.[0]
  if (!doc) return { title: 'Yangilik topilmadi' }

  return {
    title: doc.title,
    description: doc.summary,
  }
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const payload = await getPayloadClient()

  const res = await payload.find({
    collection: 'news',
    where: { slug: { equals: slug } },
    limit: 1,
  }).catch(() => null)

  const article = res?.docs?.[0]

  // Enforce draft privacy: only published articles visible to anonymous visitors
  if (!article || article.status !== 'nashr_qilingan') {
    notFound()
  }

  // Related articles from same category
  const relatedRes = await payload.find({
    collection: 'news',
    where: {
      and: [
        { status: { equals: 'nashr_qilingan' } },
        { id: { not_equals: article.id } },
        { category: { equals: article.category } },
      ],
    },
    limit: 2,
    sort: '-publishedAt',
  }).catch(() => ({ docs: [] }))

  return (
    <div className="section">
      <div className="container">
        <Breadcrumbs items={[{ label: 'Yangiliklar', href: '/yangiliklar' }, { label: article.title }]} />

        <article className="reading-column" style={{ maxWidth: '48rem' }}>
          
          {/* Header Metadata */}
          <header style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.875rem', color: 'var(--color-muted)', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <span className="badge badge-primary" style={{ textTransform: 'capitalize' }}>
                <Tag size={12} />
                {article.category}
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <Calendar size={14} />
                {formatUzbekDate(article.publishedAt)}
              </span>
            </div>

            <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', lineHeight: 1.15, marginBottom: '1.25rem' }}>
              {article.title}
            </h1>

            <p style={{ fontSize: '1.2rem', lineHeight: 1.6, color: 'var(--color-muted)', borderLeft: '3px solid var(--color-primary)', paddingLeft: '1rem' }}>
              {article.summary}
            </p>
          </header>

          {/* Cover Image */}
          {article.coverImage && (
            <div style={{ marginBottom: '2.5rem', borderRadius: 'var(--radius-card)', overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}>
              <Image
                src={getMediaUrl(article.coverImage)}
                alt={getMediaAlt(article.coverImage, article.title)}
                width={1200}
                height={600}
                priority
                style={{ width: '100%', height: 'auto', maxHeight: '480px', objectFit: 'cover' }}
              />
            </div>
          )}

          {/* Main Article Content */}
          <div style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--color-text)', marginBottom: '3rem' }}>
            <RichTextRenderer content={article.content} />
          </div>

          {/* Navigation Back */}
          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem', marginBottom: '3rem' }}>
            <Link href="/yangiliklar" className="btn btn-outline">
              <ArrowLeft size={16} />
              Barcha yangiliklarga qaytish
            </Link>
          </div>

          {/* Related Stories */}
          {relatedRes.docs.length > 0 && (
            <div style={{ borderTop: '2px solid var(--color-border)', paddingTop: '2.5rem' }}>
              <h3 style={{ marginBottom: '1.5rem' }}>Mavzuga oid yangiliklar</h3>
              <div className="grid grid-cols-1 grid-cols-2-sm" style={{ gap: '1.5rem' }}>
                {relatedRes.docs.map((related: any) => (
                  <div key={related.id} className="card">
                    <div className="card-body">
                      <span style={{ fontSize: '0.8rem', color: 'var(--color-muted)', marginBottom: '0.35rem' }}>
                        {formatUzbekDate(related.publishedAt)}
                      </span>
                      <h4 style={{ fontSize: '1.05rem', marginBottom: '0.5rem' }}>
                        <Link href={`/yangiliklar/${related.slug}`} style={{ color: 'var(--color-navy)' }}>
                          {related.title}
                        </Link>
                      </h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', margin: 0 }}>
                        {related.summary.slice(0, 80)}...
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </article>
      </div>
    </div>
  )
}
