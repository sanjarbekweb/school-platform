import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getCachedNewsArchive } from '@/lib/data/cached'
import { formatUzbekDate, getMediaUrl, getMediaAlt } from '@/lib/utils'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { Pagination } from '@/components/Pagination'
import { ArrowRight, Calendar, FileText, Tag } from 'lucide-react'

export const metadata: Metadata = {
  title: 'So‘nggi yangiliklar',
  description: '142-sonli maktabning rasmiy yangiliklari, tadbirlari va e’lonlari.',
}

export default async function NewsArchivePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedSearchParams = await searchParams
  const rawCategory = Array.isArray(resolvedSearchParams.kategoriya) ? resolvedSearchParams.kategoriya[0] : resolvedSearchParams.kategoriya
  const categoryFilter = rawCategory || ''

  const rawPage = Array.isArray(resolvedSearchParams.page) ? resolvedSearchParams.page[0] : resolvedSearchParams.page
  const currentPage = rawPage ? Math.max(1, parseInt(rawPage, 10) || 1) : 1

  const newsRes = await getCachedNewsArchive(categoryFilter, currentPage, 9)

  const categories = [
    { label: 'Barchasi', value: '' },
    { label: 'Akademik jarayon', value: 'akademik' },
    { label: 'Tadbirlar', value: 'tadbirlar' },
    { label: 'Sport', value: 'sport' },
    { label: 'Madaniyat', value: 'madaniyat' },
  ]

  return (
    <div className="section">
      <div className="container">
        <Breadcrumbs items={[{ label: 'Yangiliklar' }]} />

        <div style={{ marginBottom: '2.5rem' }}>
          <span className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>Maktab matbuot xizmati</span>
          <h1 style={{ color: 'var(--color-navy-950)', marginBottom: '0.75rem' }}>So‘nggi yangiliklar</h1>
          <p style={{ color: 'var(--color-muted)', fontSize: '1.1rem', maxWidth: '44rem' }}>
            142-maktab hayotidagi eng muhim voqealar, akademik natijalar, tadbirlar va ijodiy yutuqlar.
          </p>
        </div>

        {/* Category Filters */}
        <div style={{ display: 'flex', gap: '0.65rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
          {categories.map((cat) => {
            const isActive = categoryFilter === cat.value
            const href = cat.value ? `/yangiliklar?kategoriya=${cat.value}` : '/yangiliklar'
            return (
              <Link
                key={cat.value}
                href={href}
                className={isActive ? 'btn btn-primary' : 'btn btn-outline'}
                style={{ 
                  padding: '0.5rem 1.15rem', 
                  fontSize: '0.875rem',
                  borderRadius: '9999px',
                  fontWeight: 600,
                }}
              >
                {cat.label}
              </Link>
            )
          })}
        </div>

        {/* News Grid */}
        {newsRes.docs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 grid-cols-3-lg">
              {newsRes.docs.map((item: any) => (
                <article key={item.id} className="card">
                  {item.coverImage ? (
                    <div style={{ height: '220px', overflow: 'hidden', background: '#e2e8f0', position: 'relative' }}>
                      <Image
                        src={getMediaUrl(item.coverImage)}
                        alt={getMediaAlt(item.coverImage, item.title)}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                  ) : (
                    <div style={{ height: '150px', background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
                      <FileText size={40} style={{ opacity: 0.6 }} />
                    </div>
                  )}
                  <div className="card-body">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--color-muted)', marginBottom: '0.65rem' }}>
                      <span className="badge badge-primary" style={{ textTransform: 'capitalize' }}>{item.category || 'Yangilik'}</span>
                      <span>•</span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Calendar size={13} />
                        {formatUzbekDate(item.publishedAt)}
                      </span>
                    </div>
                    <h2 style={{ fontSize: '1.2rem', marginBottom: '0.65rem', lineHeight: 1.35 }}>
                      <Link href={`/yangiliklar/${item.slug}`} style={{ color: 'var(--color-navy-950)' }}>
                        {item.title}
                      </Link>
                    </h2>
                    <p style={{ color: 'var(--color-muted)', fontSize: '0.925rem', flex: 1, lineHeight: 1.65 }}>
                      {item.summary}
                    </p>
                    <Link 
                      href={`/yangiliklar/${item.slug}`} 
                      style={{ 
                        fontWeight: 600, 
                        fontSize: '0.875rem', 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '0.35rem', 
                        marginTop: '1rem',
                        color: 'var(--color-primary)' 
                      }}
                    >
                      <span>Batafsil o‘qish</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            <Pagination
              currentPage={newsRes.page || 1}
              totalPages={newsRes.totalPages || 1}
              baseUrl="/yangiliklar"
              searchParams={{ kategoriya: categoryFilter }}
            />
          </>
        ) : (
          <div className="card" style={{ padding: '3.5rem 2rem', textAlign: 'center', color: 'var(--color-muted)' }}>
            <p style={{ margin: 0, fontSize: '1.05rem' }}>
              Ushbu ruknda hozircha yangiliklar mavjud emas.
            </p>
          </div>
        )}

      </div>
    </div>
  )
}
