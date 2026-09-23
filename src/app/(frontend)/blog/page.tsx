import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getCachedBlogArchive } from '@/lib/data/cached'
import { getMediaUrl, formatUzbekDate } from '@/lib/utils'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { Pagination } from '@/components/Pagination'
import { BookOpen, Calendar, ArrowRight, User } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Ustozlar blogi va ilmiy-metodik maqolalar',
  description: '142-sonli maktab pedagoglarining maqolalari, dars ishlanmalari va ilg‘or tajribalari.',
}

export default async function BlogArchivePage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = searchParams ? await searchParams : {}
  const rawPage = Array.isArray(resolvedParams.page) ? resolvedParams.page[0] : resolvedParams.page
  const currentPage = rawPage ? Math.max(1, parseInt(rawPage, 10) || 1) : 1

  const blogRes = await getCachedBlogArchive(currentPage, 9)

  return (
    <div className="section">
      <div className="container">
        <Breadcrumbs items={[{ label: 'Blog' }]} />

        <div style={{ maxWidth: '840px', marginBottom: '2.5rem' }}>
          <span className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>
            Pedagogik tajriba
          </span>
          <h1 style={{ fontSize: '2.5rem', lineHeight: 1.2, color: 'var(--color-navy)', marginBottom: '1rem' }}>
            Ustozlar blogi va ilmiy-uslubiy maqolalar
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--color-muted)', lineHeight: 1.6 }}>
            Tajribali pedagoglarimizning dars o‘tish metodikasi, o‘quvchilarni fanga qiziqtirish usullari va zamonaviy ta’lim texnologiyalari haqidagi fikr-mulohazalari.
          </p>
        </div>

        {blogRes.docs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 grid-cols-2-sm grid-cols-3-lg" style={{ gap: '2rem' }}>
              {blogRes.docs.map((post: any) => (
                <div key={post.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                  {post.coverImage ? (
                    <Link href={`/blog/${post.slug}`} style={{ display: 'block', position: 'relative', height: '210px', overflow: 'hidden', background: '#e2e8f0' }}>
                      <Image
                        src={getMediaUrl(post.coverImage)}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        style={{ objectFit: 'cover', transition: 'transform 0.3s ease' }}
                      />
                    </Link>
                  ) : (
                    <div style={{ height: '120px', background: 'linear-gradient(135deg, #1e3a8a10, #3b82f615)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
                      <BookOpen size={48} />
                    </div>
                  )}

                  <div className="card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                      <Calendar size={14} />
                      <time dateTime={post.publishedAt}>{formatUzbekDate(post.publishedAt)}</time>
                    </div>

                    <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', lineHeight: 1.4 }}>
                      <Link href={`/blog/${post.slug}`} style={{ color: 'var(--color-navy)' }}>
                        {post.title}
                      </Link>
                    </h3>

                    <p style={{ fontSize: '0.9rem', color: 'var(--color-muted)', lineHeight: 1.6, marginBottom: '1.25rem', flex: 1 }}>
                      {post.summary ? (post.summary.length > 130 ? post.summary.slice(0, 130) + '...' : post.summary) : ''}
                    </p>

                    <div style={{ marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-navy)', fontWeight: 500 }}>
                        <User size={14} style={{ color: 'var(--color-primary)' }} />
                        {post.authorName}
                      </span>

                      <Link
                        href={`/blog/${post.slug}`}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-primary)', fontWeight: 500 }}
                      >
                        O‘qish <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Pagination
              currentPage={blogRes.page || 1}
              totalPages={blogRes.totalPages || 1}
              baseUrl="/blog"
            />
          </>
        ) : (
          <div className="card" style={{ padding: '3.5rem', textAlign: 'center', color: 'var(--color-muted)' }}>
            <BookOpen size={48} style={{ color: '#cbd5e1', margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.2rem', color: 'var(--color-navy)', marginBottom: '0.5rem' }}>
              Blog maqolalari tayyorlanmoqda
            </h3>
            <p style={{ margin: 0, fontSize: '0.95rem' }}>
              Ustozlarimizning maqolalari tez orada e’lon qilinadi.
            </p>
          </div>
        )}

      </div>
    </div>
  )
}
