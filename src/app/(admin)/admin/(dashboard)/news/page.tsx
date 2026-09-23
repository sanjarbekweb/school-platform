import React from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/session'
import { getAdminList } from '@/lib/data/admin'
import { formatDate } from '@/lib/utils'

export default async function AdminNewsListPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const user = await getCurrentUser()
  if (!user) redirect('/admin/login')

  const resolvedParams = await searchParams
  const page = parseInt(resolvedParams.page || '1', 10)
  const status = resolvedParams.status || 'all'
  const category = resolvedParams.category || 'all'
  const search = resolvedParams.search || ''

  const result = await getAdminList(
    'news',
    { page, limit: 15, status, category, search },
    user
  )

  const isTeacher = user.role === 'teacher'

  return (
    <div>
      <div className="admin-page-header">
        <div className="admin-page-title-group">
          <h1>Yangiliklar va maqolalar</h1>
          <p>
            {isTeacher
              ? 'Siz yaratgan maqolalar va tahrirdagi qoralamalar ro‘yxati.'
              : 'Maktab yangiliklari, e’lon qilingan maqolalar va workflow boshqaruvi.'}
          </p>
        </div>

        <Link href="/admin/news/new" className="btn btn-primary">
          ✍️ Yangi yangilik yozish
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="admin-card" style={{ padding: 'var(--space-4)' }}>
        <form method="GET" style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          <input
            type="text"
            name="search"
            defaultValue={search}
            placeholder="Sarlavha bo‘yicha qidirish..."
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
            <option value="nashr_qilingan">Nashr qilingan</option>
            <option value="korib_chiqilmoqda">Ko‘rib chiqilmoqda</option>
            <option value="qoralama">Qoralama</option>
            <option value="ozgartirish_kerak">Qaytarilgan</option>
            <option value="arxivlangan">Arxivlangan</option>
          </select>

          <select
            name="category"
            defaultValue={category}
            className="admin-select"
            style={{ width: 'auto' }}
          >
            <option value="all">Barcha ruknlar</option>
            <option value="akademik">Akademik</option>
            <option value="tadbirlar">Tadbirlar</option>
            <option value="sport">Sport</option>
            <option value="madaniyat">Madaniyat</option>
          </select>

          <button type="submit" className="btn btn-secondary">
            Filtrlash
          </button>

          {(search || status !== 'all' || category !== 'all') && (
            <Link href="/admin/news" className="btn btn-outline">
              Tozalash
            </Link>
          )}
        </form>
      </div>

      {/* Table */}
      <div className="admin-card">
        {result.docs.length === 0 ? (
          <div className="admin-empty-state">
            <div className="admin-empty-icon">📰</div>
            <div className="admin-empty-title">Yangiliklar topilmadi</div>
            <div className="admin-empty-desc">
              Kiritilgan qidiruv yoki filtr bo‘yicha hech qanday maqola mavjud emas.
            </div>
            <Link href="/admin/news/new" className="btn btn-primary">
              Yangi yangilik yozish
            </Link>
          </div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Sarlavha</th>
                  <th>Rukn</th>
                  <th>Holati</th>
                  <th>Muallif</th>
                  <th>Sana</th>
                  <th style={{ textAlign: 'right' }}>Amallar</th>
                </tr>
              </thead>
              <tbody>
                {result.docs.map((doc: any) => (
                  <tr key={doc.id}>
                    <td style={{ fontWeight: 600 }}>
                      <Link
                        href={`/admin/news/${doc.id}`}
                        style={{ color: 'inherit', textDecoration: 'none' }}
                      >
                        {doc.title}
                      </Link>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                        /yangiliklar/{doc.slug}
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-info">{doc.category}</span>
                    </td>
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
                    <td>{doc.author?.name || doc.author?.email || '—'}</td>
                    <td>{formatDate(doc.publishedAt || doc.createdAt)}</td>
                    <td style={{ textAlign: 'right' }}>
                      <Link
                        href={`/admin/news/${doc.id}`}
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

      {/* Pagination */}
      {result.totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-2)', marginTop: 'var(--space-4)' }}>
          {Array.from({ length: result.totalPages }, (_, i) => i + 1).map((p) => {
            const isCurrent = p === result.page
            return (
              <Link
                key={p}
                href={`/admin/news?page=${p}&status=${status}&category=${category}&search=${encodeURIComponent(search)}`}
                className={`btn ${isCurrent ? 'btn-primary' : 'btn-outline'}`}
                style={{ minWidth: '38px', padding: '0.3rem 0.6rem' }}
              >
                {p}
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
