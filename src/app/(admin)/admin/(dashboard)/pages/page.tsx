import React from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/session'
import { getAdminList } from '@/lib/data/admin'

export default async function AdminPagesListPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const user = await getCurrentUser()
  if (!user || user.role === 'teacher') redirect('/admin')

  const resolvedParams = await searchParams
  const search = resolvedParams.search || ''

  const result = await getAdminList(
    'pages',
    { page: 1, limit: 50, search, sort: 'title' },
    user
  )

  return (
    <div>
      <div className="admin-page-header">
        <div className="admin-page-title-group">
          <h1>Statik va axborot sahifalari</h1>
          <p>
            Maktab haqida, ota-onalar uchun ma’lumotlar, ta’lim dasturi va doimiy sahifalar boshqaruvi.
          </p>
        </div>

        <Link href="/admin/pages/new" className="btn btn-primary">
          📄 Yangi sahifa qo‘shish
        </Link>
      </div>

      <div className="admin-card" style={{ padding: 'var(--space-4)' }}>
        <form method="GET" style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          <input
            type="text"
            name="search"
            defaultValue={search}
            placeholder="Sahifa sarlavhasi bo‘yicha qidirish..."
            className="admin-input"
            style={{ flex: '1 1 240px' }}
          />
          <button type="submit" className="btn btn-secondary">
            Qidirish
          </button>
          {search && (
            <Link href="/admin/pages" className="btn btn-outline">
              Tozalash
            </Link>
          )}
        </form>
      </div>

      <div className="admin-card">
        {result.docs.length === 0 ? (
          <div className="admin-empty-state">
            <div className="admin-empty-icon">📄</div>
            <div className="admin-empty-title">Sahifalar topilmadi</div>
            <div className="admin-empty-desc">
              {search ? 'Qidiruv bo‘yicha mos sahifa topilmadi.' : 'Hozircha doimiy sahifalar kiritilmagan.'}
            </div>
            <Link href="/admin/pages/new" className="btn btn-primary">
              Yangi sahifa qo‘shish
            </Link>
          </div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Sahifa sarlavhasi</th>
                  <th>Veb-manzil (URL)</th>
                  <th>Holati</th>
                  <th style={{ textAlign: 'right' }}>Amallar</th>
                </tr>
              </thead>
              <tbody>
                {result.docs.map((page: any) => (
                  <tr key={page.id}>
                    <td style={{ fontWeight: 600 }}>
                      <Link
                        href={`/admin/pages/${page.id}`}
                        style={{ color: 'inherit', textDecoration: 'none' }}
                      >
                        {page.title}
                      </Link>
                      {page.subtitle && (
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                          {page.subtitle}
                        </div>
                      )}
                    </td>
                    <td>
                      <code style={{ fontSize: 'var(--text-xs)' }}>/{page.slug}</code>
                    </td>
                    <td>
                      <span className={`status-badge status-${page.status}`}>
                        {page.status === 'nashr_qilingan' ? 'Nashr qilingan' : 'Qoralama'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <Link
                        href={`/admin/pages/${page.id}`}
                        className="btn btn-outline"
                        style={{ padding: '0.2rem 0.5rem', fontSize: 'var(--text-xs)' }}
                      >
                        Tahrirlash
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
