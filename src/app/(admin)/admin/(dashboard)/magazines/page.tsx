import React from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/session'
import { getAdminList } from '@/lib/data/admin'

export default async function AdminMagazinesListPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const user = await getCurrentUser()
  if (!user || user.role === 'teacher') redirect('/admin')

  const resolvedParams = await searchParams
  const search = resolvedParams.search || ''

  const result = await getAdminList('magazines', { page: 1, limit: 30, search, sort: '-createdAt' }, user)

  return (
    <div>
      <div className="admin-page-header">
        <div className="admin-page-title-group">
          <h1>Maktab jurnallari</h1>
          <p>“Zukko avlod” va boshqa ilmiy-ommabop maktab nashrlarining elektron arxivi.</p>
        </div>

        <Link href="/admin/magazines/new" className="btn btn-primary">
          📚 Yangi sonni qo‘shish
        </Link>
      </div>

      <div className="admin-card" style={{ padding: 'var(--space-4)' }}>
        <form method="GET" style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          <input
            type="text"
            name="search"
            defaultValue={search}
            placeholder="Jurnal nomi yoki nashr soni bo‘yicha qidirish..."
            className="admin-input"
            style={{ flex: '1 1 240px' }}
          />
          <button type="submit" className="btn btn-secondary">
            Qidirish
          </button>
          {search && (
            <Link href="/admin/magazines" className="btn btn-outline">
              Tozalash
            </Link>
          )}
        </form>
      </div>

      <div className="admin-card">
        {result.docs.length === 0 ? (
          <div className="admin-empty-state">
            <div className="admin-empty-icon">📚</div>
            <div className="admin-empty-title">Jurnallar topilmadi</div>
            <div className="admin-empty-desc">
              {search ? 'Qidiruv bo‘yicha mos jurnal topilmadi.' : 'Hozircha maktab jurnallari joylanmagan.'}
            </div>
            <Link href="/admin/magazines/new" className="btn btn-primary">
              Yangi sonni qo‘shish
            </Link>
          </div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Jurnal nomi</th>
                  <th>Nashr soni</th>
                  <th>PDF fayli</th>
                  <th>Hajmi</th>
                  <th>Holati</th>
                  <th style={{ textAlign: 'right' }}>Amallar</th>
                </tr>
              </thead>
              <tbody>
                {result.docs.map((doc: any) => (
                  <tr key={doc.id}>
                    <td style={{ fontWeight: 600 }}>
                      <Link href={`/admin/magazines/${doc.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                        {doc.title}
                      </Link>
                    </td>
                    <td>
                      <span className="badge badge-info">{doc.issueNumber}</span>
                    </td>
                    <td>
                      {doc.pdfFile ? (
                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-blue)' }}>
                          📄 Biriktirilgan
                        </span>
                      ) : (
                        <span style={{ fontSize: 'var(--text-xs)', color: '#ef4444' }}>Faylsiz</span>
                      )}
                    </td>
                    <td>{doc.fileSize || '—'}</td>
                    <td>
                      <span className={`status-badge status-${doc.status}`}>
                        {doc.status === 'nashr_qilingan' ? 'Nashr qilingan' : 'Qoralama'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <Link
                        href={`/admin/magazines/${doc.id}`}
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
