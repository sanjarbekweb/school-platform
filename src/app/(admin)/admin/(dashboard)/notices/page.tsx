import React from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/session'
import { getAdminList } from '@/lib/data/admin'
import { formatDate } from '@/lib/utils'

export default async function AdminNoticesListPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const user = await getCurrentUser()
  if (!user || user.role === 'teacher') {
    redirect('/admin')
  }

  const resolvedParams = await searchParams
  const page = parseInt(resolvedParams.page || '1', 10)
  const status = resolvedParams.status || 'all'
  const search = resolvedParams.search || ''

  const result = await getAdminList(
    'notices',
    { page, limit: 15, status, search },
    user
  )

  return (
    <div>
      <div className="admin-page-header">
        <div className="admin-page-title-group">
          <h1>Rasmiy e’lonlar va bildirishnomalar</h1>
          <p>
            Bosh sahifa va axborot bo‘limidagi rasmiy xabarnomalar va ularning amal qilish muddatlari.
          </p>
        </div>

        <Link href="/admin/notices/new" className="btn btn-primary">
          📢 Yangi e’lon qo‘shish
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="admin-card" style={{ padding: 'var(--space-4)' }}>
        <form method="GET" style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          <input
            type="text"
            name="search"
            defaultValue={search}
            placeholder="E’lon sarlavhasi bo‘yicha..."
            className="admin-input"
            style={{ flex: '1 1 240px' }}
          />

          <select
            name="status"
            defaultValue={status}
            className="admin-select"
            style={{ width: 'auto' }}
          >
            <option value="all">Barcha holatlar</option>
            <option value="faol">Faol</option>
            <option value="qoralama">Qoralama</option>
            <option value="arxivlangan">Arxivlangan</option>
          </select>

          <button type="submit" className="btn btn-secondary">
            Filtrlash
          </button>

          {(search || status !== 'all') && (
            <Link href="/admin/notices" className="btn btn-outline">
              Tozalash
            </Link>
          )}
        </form>
      </div>

      {/* Table */}
      <div className="admin-card">
        {result.docs.length === 0 ? (
          <div className="admin-empty-state">
            <div className="admin-empty-icon">📢</div>
            <div className="admin-empty-title">E’lonlar topilmadi</div>
            <div className="admin-empty-desc">
              Hozircha hech qanday e’lon kiritilmagan.
            </div>
            <Link href="/admin/notices/new" className="btn btn-primary">
              Yangi e’lon qo‘shish
            </Link>
          </div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Sarlavha</th>
                  <th>Muhimlik</th>
                  <th>Holati</th>
                  <th>Boshlanish</th>
                  <th>Tugash muddati</th>
                  <th style={{ textAlign: 'right' }}>Amallar</th>
                </tr>
              </thead>
              <tbody>
                {result.docs.map((notice: any) => {
                  const isExpired = new Date(notice.expiryDate).getTime() < Date.now()
                  return (
                    <tr key={notice.id}>
                      <td style={{ fontWeight: 600 }}>
                        <Link
                          href={`/admin/notices/${notice.id}`}
                          style={{ color: 'inherit', textDecoration: 'none' }}
                        >
                          {notice.title}
                        </Link>
                        {notice.link && (
                          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-blue)' }}>
                            {notice.link}
                          </div>
                        )}
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            notice.priority === 'shoshilinch'
                              ? 'badge-danger'
                              : notice.priority === 'muhim'
                              ? 'badge-warning'
                              : 'badge-info'
                          }`}
                        >
                          {notice.priority}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge status-${notice.status}`}>
                          {notice.status === 'faol' ? 'Faol' : notice.status === 'qoralama' ? 'Qoralama' : 'Arxiv'}
                        </span>
                        {isExpired && notice.status === 'faol' && (
                          <span
                            style={{
                              marginLeft: '6px',
                              fontSize: '0.7rem',
                              color: '#ef4444',
                              fontWeight: 600,
                            }}
                          >
                            (Muddati o‘tgan)
                          </span>
                        )}
                      </td>
                      <td>{formatDate(notice.startDate)}</td>
                      <td>{formatDate(notice.expiryDate)}</td>
                      <td style={{ textAlign: 'right' }}>
                        <Link
                          href={`/admin/notices/${notice.id}`}
                          className="btn btn-outline"
                          style={{ padding: '0.2rem 0.5rem', fontSize: 'var(--text-xs)' }}
                        >
                          Tahrirlash
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
