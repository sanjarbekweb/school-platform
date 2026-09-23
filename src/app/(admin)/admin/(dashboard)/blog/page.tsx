import React from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/session'
import { getAdminList } from '@/lib/data/admin'
import { formatDate } from '@/lib/utils'

export default async function AdminBlogListPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const user = await getCurrentUser()
  if (!user) redirect('/admin/login')

  const resolvedParams = await searchParams
  const page = parseInt(resolvedParams.page || '1', 10)
  const status = resolvedParams.status || 'all'
  const search = resolvedParams.search || ''

  const result = await getAdminList('blog', { page, limit: 20, status, search, sort: '-updatedAt' }, user)

  return (
    <div>
      <div className="admin-page-header">
        <div className="admin-page-title-group">
          <h1>Blog va ilmiy-metodik maqolalar</h1>
          <p>O‘qituvchilarimizning metodik qo‘llanmalari, dars ishlanmalari va maqolalari.</p>
        </div>

        <Link href="/admin/blog/new" className="btn btn-primary">
          ✍️ Yangi maqola yozish
        </Link>
      </div>

      <div className="admin-card" style={{ padding: 'var(--space-4)' }}>
        <form method="GET" style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          <input
            type="text"
            name="search"
            defaultValue={search}
            placeholder="Maqola sarlavhasi yoki muallif bo‘yicha qidirish..."
            className="admin-input"
            style={{ flex: '1 1 240px' }}
          />
          <select name="status" defaultValue={status} className="admin-select" style={{ width: 'auto' }}>
            <option value="all">Barcha holatlar</option>
            <option value="nashr_qilingan">Nashr qilingan</option>
            <option value="korib_chiqilmoqda">Ko‘rib chiqilmoqda</option>
            <option value="qoralama">Qoralama</option>
            <option value="ozgartirish_kerak">Qaytarilgan</option>
            <option value="arxivlangan">Arxivlangan</option>
          </select>
          <button type="submit" className="btn btn-secondary">
            Filtrlash
          </button>
          {(search || status !== 'all') && (
            <Link href="/admin/blog" className="btn btn-outline">
              Tozalash
            </Link>
          )}
        </form>
      </div>

      <div className="admin-card">
        {result.docs.length === 0 ? (
          <div className="admin-empty-state">
            <div className="admin-empty-icon">✍️</div>
            <div className="admin-empty-title">Maqolalar topilmadi</div>
            <div className="admin-empty-desc">
              {search || status !== 'all'
                ? 'Kiritilgan qidiruv yoki filtr bo‘yicha maqola topilmadi.'
                : 'Hozircha maqolalar kiritilmagan.'}
            </div>
            <Link href="/admin/blog/new" className="btn btn-primary">
              Yangi maqola yozish
            </Link>
          </div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Sarlavha</th>
                  <th>Muallif</th>
                  <th>Holati</th>
                  <th>Sana</th>
                  <th style={{ textAlign: 'right' }}>Amallar</th>
                </tr>
              </thead>
              <tbody>
                {result.docs.map((doc: any) => (
                  <tr key={doc.id}>
                    <td style={{ fontWeight: 600 }}>
                      <Link href={`/admin/blog/${doc.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                        {doc.title}
                      </Link>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                        /blog/{doc.slug}
                      </div>
                    </td>
                    <td>{doc.authorName}</td>
                    <td>
                      <span className={`status-badge status-${doc.status}`}>
                        {doc.status === 'nashr_qilingan'
                          ? 'Nashr qilingan'
                          : doc.status === 'korib_chiqilmoqda'
                          ? 'Ko‘rib chiqilmoqda'
                          : doc.status === 'ozgartirish_kerak'
                          ? 'Qaytarilgan'
                          : doc.status === 'arxivlangan'
                          ? 'Arxiv'
                          : 'Qoralama'}
                      </span>
                    </td>
                    <td>{formatDate(doc.publishedAt || doc.createdAt)}</td>
                    <td style={{ textAlign: 'right' }}>
                      <Link
                        href={`/admin/blog/${doc.id}`}
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
