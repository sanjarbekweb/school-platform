import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getPayloadClient } from '@/lib/payload'
import { matchesUzbekQuery } from '@/lib/search'
import { getActiveNoticesWhere } from '@/lib/notices'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { Pagination } from '@/components/Pagination'
import { Search, FileText, User, Bell, Trophy, BookMarked, Camera, ArrowRight, Layers } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Qidiruv — 142-maktab',
  description: '142-sonli maktab rasmiy sayti bo‘yicha yangiliklar, o‘qituvchilar, e’lonlar va sahifalar qidiruvi.',
}

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

const ITEMS_PER_PAGE = 10

export default async function SearchPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams

  // Safely handle array or string query and truncate to max 100 chars
  let rawQuery = ''
  if (Array.isArray(resolvedParams.q)) {
    rawQuery = resolvedParams.q[0] || ''
  } else if (typeof resolvedParams.q === 'string') {
    rawQuery = resolvedParams.q
  }
  rawQuery = rawQuery.slice(0, 100).trim().replace(/[<>]/g, '')

  // Type filter
  const rawType = Array.isArray(resolvedParams.type) ? resolvedParams.type[0] : resolvedParams.type
  const selectedType = rawType && ['all', 'news', 'staff', 'notices', 'pages', 'awards', 'magazines', 'albums', 'blog'].includes(rawType)
    ? rawType
    : 'all'

  // Safely parse page number
  let currentPage = 1
  const rawPage = Array.isArray(resolvedParams.page) ? resolvedParams.page[0] : resolvedParams.page
  if (rawPage) {
    const parsed = parseInt(rawPage, 10)
    if (!isNaN(parsed) && parsed > 0) {
      currentPage = parsed
    }
  }

  const payload = await getPayloadClient()
  const nowIso = new Date().toISOString()

  let allResults: Array<{
    type: string
    title: string
    url: string
    snippet?: string
    badge: string
    icon: any
  }> = []

  if (rawQuery) {
    // 1. Search News (only published)
    const newsRes = await payload.find({
      collection: 'news',
      where: { status: { equals: 'nashr_qilingan' } },
      limit: 50,
    }).catch(() => ({ docs: [] }))

    for (const item of newsRes.docs as any[]) {
      if (matchesUzbekQuery(item.title, rawQuery) || matchesUzbekQuery(item.summary || '', rawQuery)) {
        allResults.push({
          type: 'news',
          title: item.title,
          url: `/yangiliklar/${item.slug}`,
          snippet: item.summary,
          badge: 'Yangilik',
          icon: FileText,
        })
      }
    }

    // 2. Search Static Pages (maktab-haqida, talim, etc.)
    const pagesRes = await payload.find({
      collection: 'pages',
      where: { status: { equals: 'nashr_qilingan' } },
      limit: 30,
    }).catch(() => ({ docs: [] }))

    for (const item of pagesRes.docs as any[]) {
      if (matchesUzbekQuery(item.title, rawQuery) || matchesUzbekQuery(item.subtitle || '', rawQuery)) {
        allResults.push({
          type: 'pages',
          title: item.title,
          url: `/${item.slug}`,
          snippet: item.subtitle,
          badge: 'Sahifa',
          icon: Layers,
        })
      }
    }

    // 3. Search Staff (only active)
    const staffRes = await payload.find({
      collection: 'staff',
      where: { status: { equals: 'faol' } },
      limit: 50,
    }).catch(() => ({ docs: [] }))

    for (const item of staffRes.docs as any[]) {
      if (
        matchesUzbekQuery(item.fullName, rawQuery) ||
        matchesUzbekQuery(item.qualifications || '', rawQuery) ||
        matchesUzbekQuery(item.role || '', rawQuery) ||
        matchesUzbekQuery(item.bio || '', rawQuery)
      ) {
        allResults.push({
          type: 'staff',
          title: item.fullName,
          url: `/oqituvchilar/${item.slug}`,
          snippet: item.qualifications || item.role,
          badge: 'O‘qituvchi',
          icon: User,
        })
      }
    }

    // 4. Search Notices (CRITICAL: only active notices, never draft or expired)
    const noticesRes = await payload.find({
      collection: 'notices',
      where: getActiveNoticesWhere(nowIso),
      limit: 30,
    }).catch(() => ({ docs: [] }))

    for (const item of noticesRes.docs as any[]) {
      if (matchesUzbekQuery(item.title, rawQuery) || matchesUzbekQuery(item.content || '', rawQuery)) {
        allResults.push({
          type: 'notices',
          title: item.title,
          url: '/elonlar',
          snippet: item.content,
          badge: 'E’lon',
          icon: Bell,
        })
      }
    }

    // 5. Search Awards
    const awardsRes = await payload.find({
      collection: 'awards',
      where: { status: { equals: 'nashr_qilingan' } },
      limit: 30,
    }).catch(() => ({ docs: [] }))

    for (const item of awardsRes.docs as any[]) {
      if (
        matchesUzbekQuery(item.title, rawQuery) ||
        matchesUzbekQuery(item.recipient || '', rawQuery) ||
        matchesUzbekQuery(item.competition || '', rawQuery)
      ) {
        allResults.push({
          type: 'awards',
          title: `${item.title} (${item.recipient})`,
          url: '/yutuqlar',
          snippet: `${item.competition} - ${item.result}`,
          badge: 'Yutuq',
          icon: Trophy,
        })
      }
    }

    // 6. Search Magazines
    const magRes = await payload.find({
      collection: 'magazines',
      where: { status: { equals: 'nashr_qilingan' } },
      limit: 30,
    }).catch(() => ({ docs: [] }))

    for (const item of magRes.docs as any[]) {
      if (matchesUzbekQuery(item.title, rawQuery) || matchesUzbekQuery(item.summary || '', rawQuery)) {
        allResults.push({
          type: 'magazines',
          title: `${item.title} (${item.issueNumber})`,
          url: `/jurnallar/${item.slug}`,
          snippet: item.summary,
          badge: 'Jurnal',
          icon: BookMarked,
        })
      }
    }

    // 7. Search Photo Albums
    const albumsRes = await payload.find({
      collection: 'albums',
      where: { status: { equals: 'nashr_qilingan' } },
      limit: 30,
    }).catch(() => ({ docs: [] }))

    for (const item of albumsRes.docs as any[]) {
      if (matchesUzbekQuery(item.title, rawQuery) || matchesUzbekQuery(item.description || '', rawQuery)) {
        allResults.push({
          type: 'albums',
          title: item.title,
          url: '/galereya',
          snippet: item.description,
          badge: 'Galereya',
          icon: Camera,
        })
      }
    }

    // 8. Search Blog
    const blogRes = await payload.find({
      collection: 'blog',
      where: { status: { equals: 'nashr_qilingan' } },
      limit: 30,
    }).catch(() => ({ docs: [] }))

    for (const item of blogRes.docs as any[]) {
      if (
        matchesUzbekQuery(item.title, rawQuery) ||
        matchesUzbekQuery(item.authorName || '', rawQuery) ||
        matchesUzbekQuery(item.summary || '', rawQuery)
      ) {
        allResults.push({
          type: 'blog',
          title: item.title,
          url: `/blog/${item.slug}`,
          snippet: `${item.authorName} — ${item.summary || ''}`,
          badge: 'Blog',
          icon: FileText,
        })
      }
    }
  }

  // Type filtering
  const filteredResults = selectedType === 'all'
    ? allResults
    : allResults.filter((r) => r.type === selectedType)

  // Pagination calculation
  const totalResults = filteredResults.length
  const totalPages = Math.ceil(totalResults / ITEMS_PER_PAGE)
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), Math.max(totalPages, 1))
  const paginatedResults = filteredResults.slice(
    (safeCurrentPage - 1) * ITEMS_PER_PAGE,
    safeCurrentPage * ITEMS_PER_PAGE,
  )

  const sampleKeywords = ['Olimpiada', 'Matematika', 'Qabul', 'Direktor', 'Ta’lim', 'Jurnal', 'Fotogalereya']

  const typeTabs = [
    { label: 'Barchasi', value: 'all' },
    { label: 'Yangiliklar', value: 'news' },
    { label: 'O‘qituvchilar', value: 'staff' },
    { label: 'E’lonlar', value: 'notices' },
    { label: 'Sahifalar', value: 'pages' },
    { label: 'Yutuqlar', value: 'awards' },
    { label: 'Jurnallar', value: 'magazines' },
    { label: 'Galereya', value: 'albums' },
    { label: 'Blog', value: 'blog' },
  ]

  return (
    <div className="section">
      <div className="container" style={{ maxWidth: '840px' }}>
        <Breadcrumbs items={[{ label: 'Qidiruv' }]} />

        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2.3rem', color: 'var(--color-navy)', marginBottom: '0.75rem' }}>
            Sayt bo‘yicha qidiruv
          </h1>
          <p style={{ color: 'var(--color-muted)', fontSize: '1.05rem', margin: 0 }}>
            Kerakli yangilik, xodim, e’lon, jurnal yoki maktab ma’lumotini toping.
          </p>
        </div>

        {/* Accessible Search Input Box */}
        <form method="GET" action="/search" style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="search-input" className="sr-only">
            Sayt bo‘yicha qidiruv so‘zini kiriting
          </label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <input
                id="search-input"
                type="search"
                name="q"
                defaultValue={rawQuery}
                maxLength={100}
                placeholder="Kalit so‘zni kiriting (masalan: matematika, o‘qituvchi, olimpiada)..."
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem 0.85rem 2.75rem',
                  fontSize: '1rem',
                  border: '2px solid var(--color-border)',
                  borderRadius: 'var(--radius-md, 8px)',
                  outline: 'none',
                }}
              />
              <Search
                size={18}
                style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)' }}
                aria-hidden="true"
              />
            </div>
            {selectedType !== 'all' && <input type="hidden" name="type" value={selectedType} />}
            <button type="submit" className="btn btn-primary" style={{ padding: '0 1.75rem', fontSize: '1rem' }}>
              Qidirish
            </button>
          </div>
        </form>

        {/* Quick Suggestion Chips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--color-muted)' }}>Tezkor qidiruvlar:</span>
          {sampleKeywords.map((kw) => (
            <Link
              key={kw}
              href={`/search?q=${encodeURIComponent(kw)}`}
              style={{
                fontSize: '0.8rem',
                padding: '0.2rem 0.6rem',
                borderRadius: 'var(--radius-full, 9999px)',
                backgroundColor: '#f1f5f9',
                color: 'var(--color-navy)',
                textDecoration: 'none',
              }}
            >
              {kw}
            </Link>
          ))}
        </div>

        {/* Type Filter Tabs */}
        {rawQuery && (
          <div
            style={{
              display: 'flex',
              gap: '0.5rem',
              overflowX: 'auto',
              paddingBottom: '0.5rem',
              marginBottom: '2rem',
              borderBottom: '1px solid var(--color-border)',
            }}
          >
            {typeTabs.map((tab) => {
              const isActive = selectedType === tab.value
              const count = tab.value === 'all'
                ? allResults.length
                : allResults.filter((r) => r.type === tab.value).length

              return (
                <Link
                  key={tab.value}
                  href={`/search?q=${encodeURIComponent(rawQuery)}${tab.value !== 'all' ? `&type=${tab.value}` : ''}`}
                  style={{
                    padding: '0.4rem 0.8rem',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                    borderRadius: 'var(--radius-md, 6px)',
                    backgroundColor: isActive ? 'var(--color-navy)' : '#f1f5f9',
                    color: isActive ? '#ffffff' : 'var(--color-navy)',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span>{tab.label}</span>
                  <span style={{ opacity: 0.75, fontSize: '0.75rem' }}>({count})</span>
                </Link>
              )
            })}
          </div>
        )}

        {/* Search Results Display */}
        {rawQuery ? (
          <div>
            <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1.25rem', color: 'var(--color-navy)', margin: 0 }}>
                “{rawQuery}” bo‘yicha natijalar: {totalResults} ta
              </h2>
            </div>

            {paginatedResults.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {paginatedResults.map((res, index) => {
                  const Icon = res.icon
                  return (
                    <div key={index} className="card" style={{ padding: '1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <span className="badge badge-primary" style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                          <Icon size={12} aria-hidden="true" />
                          {res.badge}
                        </span>
                      </div>
                      <h3 style={{ fontSize: '1.2rem', marginBottom: '0.4rem' }}>
                        <Link href={res.url} style={{ color: 'var(--color-navy)' }}>
                          {res.title}
                        </Link>
                      </h3>
                      {res.snippet && (
                        <p style={{ fontSize: '0.9rem', color: 'var(--color-muted)', lineHeight: 1.5, margin: '0 0 0.75rem' }}>
                          {res.snippet.length > 180 ? res.snippet.slice(0, 180) + '...' : res.snippet}
                        </p>
                      )}
                      <Link
                        href={res.url}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem', color: 'var(--color-primary)', fontWeight: 500 }}
                      >
                        Sahifaga o‘tish <ArrowRight size={14} aria-hidden="true" />
                      </Link>
                    </div>
                  )
                })}

                {/* Pagination with preserved type filter */}
                <Pagination
                  currentPage={safeCurrentPage}
                  totalPages={totalPages}
                  baseUrl="/search"
                  searchParams={{
                    q: rawQuery,
                    ...(selectedType !== 'all' ? { type: selectedType } : {}),
                  }}
                />
              </div>
            ) : (
              <div className="card" style={{ padding: '3.5rem', textAlign: 'center', color: 'var(--color-muted)' }}>
                <Search size={44} style={{ color: '#cbd5e1', margin: '0 auto 1rem' }} aria-hidden="true" />
                <h3 style={{ fontSize: '1.2rem', color: 'var(--color-navy)', marginBottom: '0.5rem' }}>
                  Hech narsa topilmadi
                </h3>
                <p style={{ margin: 0, fontSize: '0.95rem' }}>
                  So‘rovni boshqacharoq yozib ko‘ring yoki yuqoridagi tezkor kalit so‘zlardan foydalaning.
                </p>
              </div>
            )}
          </div>
        ) : null}

      </div>
    </div>
  )
}
