import React from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/session'
import { getAdminList } from '@/lib/data/admin'

export default async function AdminAwardsListPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const user = await getCurrentUser()
  if (!user || user.role === 'teacher') redirect('/admin')

  const resolvedParams = await searchParams
  const search = resolvedParams.search || ''

  const result = await getAdminList('awards', { page: 1, limit: 30, search, sort: '-year' }, user)

  return (
    <div>
      <div className="admin-page-header">
        <div className="admin-page-title-group">
          <h1>Maktab yutuqlari va mukofotlar</h1>
          <p>Olimpiadalar, sport va fan tanlovlaridagi g‘olibliklar arxivi.</p>
        </div>

        <Link href="/admin/awards/new" className="btn btn-primary">
          🏆 Yangi yutuq qo‘shish
        </Link>
      </div>

      <div className="admin-card" style={{ padding: 'var(--space-4)' }}>
        <form method="GET" style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          <input
            type="text"
            name="search"
            defaultValue={search}
            placeholder="Yutuq, musobaqa yoki g‘olib bo‘yicha qidirish..."
            className="admin-input"
            style={{ flex: '1 1 240px' }}
          />
          <button type="submit" className="btn btn-secondary">
            Qidirish
          </button>
          {search && (
            <Link href="/admin/awards" className="btn btn-outline">
              Tozalash
            </Link>
          )}
        </form>
      </div>

      <div className="admin-card">
        {result.docs.length === 0 ? (
          <div className="admin-empty-state">
            <div className="admin-empty-icon">🏆</div>
            <div className="admin-empty-title">Yutuqlar topilmadi</div>
            <div className="admin-empty-desc">
              {search ? 'Qidiruv bo‘yicha mos yutuq topilmadi.' : 'Hozircha mukofotlar kiritilmagan.'}
            </div>
            <Link href="/admin/awards/new" className="btn btn-primary">
              Yangi yutuq qo‘shish
            </Link>
          </div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Yil</th>
                  <th>Yutuq sarlavhasi</th>
                  <th>Musobaqa</th>
                  <th>Bosqich</th>
                  <th>G‘olib</th>
                  <th>Natija</th>
                  <th style={{ textAlign: 'right' }}>Amallar</th>
                </tr>
              </thead>
              <tbody>
                {result.docs.map((doc: any) => (
                  <tr key={doc.id}>
                    <td style={{ fontWeight: 700 }}>{doc.year}</td>
                    <td style={{ fontWeight: 600 }}>
                      <Link href={`/admin/awards/${doc.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                        {doc.title}
                      </Link>
                    </td>
                    <td>{doc.competition}</td>
                    <td>
                      <span className="badge badge-info">{doc.level}</span>
                    </td>
                    <td>{doc.recipient}</td>
                    <td>
                      <span className="badge badge-warning">{doc.result}</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <Link
                        href={`/admin/awards/${doc.id}`}
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
