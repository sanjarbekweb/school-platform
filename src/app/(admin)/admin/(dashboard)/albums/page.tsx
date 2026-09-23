import React from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/session'
import { getAdminList } from '@/lib/data/admin'
import { formatDate } from '@/lib/utils'

export default async function AdminAlbumsListPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const user = await getCurrentUser()
  if (!user || user.role === 'teacher') redirect('/admin')

  const resolvedParams = await searchParams
  const search = resolvedParams.search || ''

  const result = await getAdminList('albums', { page: 1, limit: 30, search, sort: '-eventDate' }, user)

  return (
    <div>
      <div className="admin-page-header">
        <div className="admin-page-title-group">
          <h1>Fotogalereyalar va tadbirlar</h1>
          <p>Maktab tadbirlari, bayramlar va ochiq darslardan fotohisobotlar to‘plami.</p>
        </div>

        <Link href="/admin/albums/new" className="btn btn-primary">
          🖼️ Yangi albom yaratish
        </Link>
      </div>

      <div className="admin-card" style={{ padding: 'var(--space-4)' }}>
        <form method="GET" style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          <input
            type="text"
            name="search"
            defaultValue={search}
            placeholder="Albom nomi bo‘yicha qidirish..."
            className="admin-input"
            style={{ flex: '1 1 240px' }}
          />
          <button type="submit" className="btn btn-secondary">
            Qidirish
          </button>
          {search && (
            <Link href="/admin/albums" className="btn btn-outline">
              Tozalash
            </Link>
          )}
        </form>
      </div>

      <div className="admin-card">
        {result.docs.length === 0 ? (
          <div className="admin-empty-state">
            <div className="admin-empty-icon">🖼️</div>
            <div className="admin-empty-title">Albomlar topilmadi</div>
            <div className="admin-empty-desc">
              {search ? 'Qidiruv bo‘yicha mos albom topilmadi.' : 'Hozircha fotogalereya albomi kiritilmagan.'}
            </div>
            <Link href="/admin/albums/new" className="btn btn-primary">
              Yangi albom yaratish
            </Link>
          </div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Albom nomi</th>
                  <th>Veb-manzil (Slug)</th>
                  <th>Tadbir sanasi</th>
                  <th>Rasmlar soni</th>
                  <th>Holati</th>
                  <th style={{ textAlign: 'right' }}>Amallar</th>
                </tr>
              </thead>
              <tbody>
                {result.docs.map((doc: any) => (
                  <tr key={doc.id}>
                    <td style={{ fontWeight: 600 }}>
                      <Link href={`/admin/albums/${doc.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                        {doc.title}
                      </Link>
                    </td>
                    <td>/{doc.slug}</td>
                    <td>{formatDate(doc.eventDate)}</td>
                    <td>{doc.images?.length || 0} ta rasm</td>
                    <td>
                      <span className={`status-badge status-${doc.status}`}>
                        {doc.status === 'nashr_qilingan' ? 'Nashr qilingan' : 'Qoralama'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <Link
                        href={`/admin/albums/${doc.id}`}
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
