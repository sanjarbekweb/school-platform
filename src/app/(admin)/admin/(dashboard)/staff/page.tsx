import React from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/session'
import { getAdminList } from '@/lib/data/admin'

export default async function AdminStaffListPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const user = await getCurrentUser()
  if (!user) redirect('/admin/login')

  // If teacher, redirect to their own staff profile if linked
  if (user.role === 'teacher') {
    if (user.linkedStaff) {
      redirect(`/admin/staff/${user.linkedStaff}`)
    } else {
      return (
        <div className="admin-empty-state">
          <div className="admin-empty-icon">⚠️</div>
          <div className="admin-empty-title">Profilingiz biriktirilmagan</div>
          <div className="admin-empty-desc">
            Sizning hisobingizga hali o‘qituvchi profili biriktirilmagan. Iltimos, bosh administratorga murojaat qiling.
          </div>
          <Link href="/admin" className="btn btn-primary">
            Boshqaruv paneliga qaytish
          </Link>
        </div>
      )
    }
  }

  const resolvedParams = await searchParams
  const page = parseInt(resolvedParams.page || '1', 10)
  const status = resolvedParams.status || 'all'
  const search = resolvedParams.search || ''

  const result = await getAdminList(
    'staff',
    { page, limit: 20, status, search, sort: 'displayOrder' },
    user
  )

  const roleLabels: Record<string, string> = {
    direktor: 'Maktab direktori',
    orinbosar_oquv: 'Direktor o‘rinbosari (O‘quv)',
    orinbosar_manaviyat: 'Direktor o‘rinbosari (Ma’naviyat)',
    oqituvchi: 'Fan o‘qituvchisi',
    boshlangich: 'Boshlang‘ich sinf o‘qituvchisi',
    psixolog: 'Maktab psixologi',
    kutubxonachi: 'Kutubxona mudiri',
  }

  return (
    <div>
      <div className="admin-page-header">
        <div className="admin-page-title-group">
          <h1>O‘qituvchilar va ma’muriyat</h1>
          <p>
            Maktab pedagogik jamoasi, rahbariyat va xodimlarning rasmiy profillari.
          </p>
        </div>

        <Link href="/admin/staff/new" className="btn btn-primary">
          👥 Yangi xodim qo‘shish
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="admin-card" style={{ padding: 'var(--space-4)' }}>
        <form method="GET" style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          <input
            type="text"
            name="search"
            defaultValue={search}
            placeholder="F.I.O. bo‘yicha qidirish..."
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
            <Link href="/admin/staff" className="btn btn-outline">
              Tozalash
            </Link>
          )}
        </form>
      </div>

      {/* Table */}
      <div className="admin-card">
        {result.docs.length === 0 ? (
          <div className="admin-empty-state">
            <div className="admin-empty-icon">👥</div>
            <div className="admin-empty-title">Xodimlar topilmadi</div>
            <div className="admin-empty-desc">
              Kiritilgan mezonlarga mos xodimlar mavjud emas.
            </div>
            <Link href="/admin/staff/new" className="btn btn-primary">
              Yangi xodim qo‘shish
            </Link>
          </div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>Tartib</th>
                  <th>F.I.O.</th>
                  <th>Lavozimi</th>
                  <th>Fani</th>
                  <th>Holati</th>
                  <th>Aloqa</th>
                  <th style={{ textAlign: 'right' }}>Amallar</th>
                </tr>
              </thead>
              <tbody>
                {result.docs.map((doc: any) => (
                  <tr key={doc.id}>
                    <td style={{ fontWeight: 600, color: 'var(--color-text-muted)' }}>
                      #{doc.displayOrder ?? 10}
                    </td>
                    <td style={{ fontWeight: 600 }}>
                      <Link
                        href={`/admin/staff/${doc.id}`}
                        style={{ color: 'inherit', textDecoration: 'none' }}
                      >
                        {doc.fullName}
                      </Link>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                        /oqituvchilar/{doc.slug}
                      </div>
                    </td>
                    <td>{roleLabels[doc.role] || doc.role}</td>
                    <td>
                      <span className="badge badge-info">{doc.subject || '—'}</span>
                    </td>
                    <td>
                      <span className={`status-badge status-${doc.status}`}>
                        {doc.status === 'faol' ? 'Faol' : doc.status === 'qoralama' ? 'Qoralama' : 'Arxiv'}
                      </span>
                    </td>
                    <td style={{ fontSize: 'var(--text-xs)' }}>
                      {doc.email && <div>✉️ {doc.email}</div>}
                      {doc.phone && <div>📞 {doc.phone}</div>}
                      {!doc.email && !doc.phone && <span style={{ color: 'var(--color-text-muted)' }}>—</span>}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <Link
                        href={`/admin/staff/${doc.id}`}
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
