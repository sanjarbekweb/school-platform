import React from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getPayloadClient } from '@/lib/payload'
import { getMediaUrl, formatUzbekDate } from '@/lib/utils'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { RichTextRenderer } from '@/components/RichTextRenderer'
import { Calendar, User, ChevronLeft, ArrowRight } from 'lucide-react'

interface PageProps {
  params: Promise<{ slug: string }>
}

export const dynamic = 'force-static'
export const dynamicParams = true

export async function generateStaticParams() {
  try {
    const payload = await getPayloadClient()
    const res = await payload.find({
      collection: 'blog',
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
    collection: 'blog',
    where: {
      slug: { equals: slug },
      status: { equals: 'nashr_qilingan' },
    },
    limit: 1,
  }).catch(() => ({ docs: [] }))

  const post = res.docs[0]
  if (!post) {
    return { title: 'Maqola topilmadi' }
  }

  return {
    title: `${post.title} — Ustozlar blogi`,
    description: post.summary || post.title,
  }
}

export default async function BlogPostDetailPage({ params }: PageProps) {
  const { slug } = await params
  const payload = await getPayloadClient()

  const res = await payload.find({
    collection: 'blog',
    where: {
      slug: { equals: slug },
      status: { equals: 'nashr_qilingan' },
    },
    limit: 1,
  }).catch(() => ({ docs: [] }))

  const post = res.docs[0]
  if (!post) {
    notFound()
  }

  // Fetch recent other blog posts
  const recentPosts = await payload.find({
    collection: 'blog',
    where: {
      id: { not_equals: post.id },
      status: { equals: 'nashr_qilingan' },
    },
    limit: 3,
    sort: '-publishedAt',
  }).catch(() => ({ docs: [] }))

  return (
    <div className="section">
      <div className="container" style={{ maxWidth: '880px' }}>
        <Breadcrumbs
          items={[
            { label: 'Blog', href: '/blog' },
            { label: post.title },
          ]}
        />

        <div style={{ marginBottom: '1.5rem' }}>
          <Link href="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-navy)', fontSize: '0.9rem', fontWeight: 500 }}>
            <ChevronLeft size={16} /> Barcha maqolalarga qaytish
          </Link>
        </div>

        <article>
          <header style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '2.4rem', lineHeight: 1.25, color: 'var(--color-navy)', marginBottom: '1rem' }}>
              {post.title}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', color: 'var(--color-muted)', fontSize: '0.95rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-navy)', fontWeight: 600 }}>
                <User size={16} style={{ color: 'var(--color-primary)' }} />
                <span>{post.authorName}</span>
              </div>

              {post.publishedAt && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Calendar size={16} />
                  <time dateTime={post.publishedAt}>{formatUzbekDate(post.publishedAt)}</time>
                </div>
              )}
            </div>
          </header>

          {post.coverImage && (
            <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '2.5rem', maxHeight: '440px', background: '#f1f5f9' }}>
              <Image
                src={getMediaUrl(post.coverImage)}
                alt={post.title}
                width={1200}
                height={600}
                priority
                style={{ width: '100%', height: 'auto', maxHeight: '440px', objectFit: 'cover' }}
              />
            </div>
          )}

          {post.summary && (
            <div style={{ fontSize: '1.15rem', lineHeight: 1.7, color: '#334155', fontStyle: 'italic', paddingLeft: '1.25rem', borderLeft: '3px solid var(--color-primary)', marginBottom: '2rem' }}>
              {post.summary}
            </div>
          )}

          <div style={{ fontSize: '1.05rem', lineHeight: 1.8, color: '#1e293b' }}>
            <RichTextRenderer content={post.content} />
          </div>
        </article>

        {/* Related Posts */}
        {recentPosts.docs.length > 0 && (
          <div style={{ marginTop: '4rem', paddingTop: '2.5rem', borderTop: '1px solid var(--color-border)' }}>
            <h3 style={{ fontSize: '1.4rem', color: 'var(--color-navy)', marginBottom: '1.5rem' }}>
              Boshqa tavsiya etiladigan maqolalar
            </h3>
            <div className="grid grid-cols-1 grid-cols-3-sm" style={{ gap: '1.5rem' }}>
              {recentPosts.docs.map((item: any) => (
                <div key={item.id} className="card" style={{ padding: '1.25rem' }}>
                  <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem', lineHeight: 1.4 }}>
                    <Link href={`/blog/${item.slug}`} style={{ color: 'var(--color-navy)' }}>
                      {item.title}
                    </Link>
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', margin: 0 }}>
                    {item.authorName}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
