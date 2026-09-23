import React from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/session'
import { getAdminOverview } from '@/lib/data/admin'
import { formatDate } from '@/lib/utils'
import {
  Newspaper,
  Clock,
  Bell,
  Users,
  Award,
  FolderOpen,
  PlusCircle,
  User,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Edit3,
  FileText
} from 'lucide-react'

export default async function AdminOverviewPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/admin/login')

  const overview = await getAdminOverview(user)
  const { stats, draftsRequiringReview, expiringNotices, recentNews } = overview

  const isTeacher = user.role === 'teacher'
  const isEditorOrAdmin = user.role === 'admin' || user.role === 'editor'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Page Header */}
      <div className="admin-page-header">
        <div className="admin-page-title-group">
          <h1 style={{ fontFamily: 'Outfit, sans-serif' }}>
            Xush kelibsiz, {user.name}!
          </h1>
          <p>
            {isTeacher
              ? 'O‘qituvchi shaxsiy kabineti: maqolalar yozish va profilingizni boshqarish.'
              : '142-maktab rasmiy axborot va kontent boshqaruv paneli.'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
          <Link 
            href="/admin/news/new" 
            className="btn btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: '0.55rem 1rem' }}
          >
            <PlusCircle size={16} />
            <span>Yangilik yozish</span>
          </Link>
          {isEditorOrAdmin && (
            <Link 
              href="/admin/notices/new" 
              className="btn btn-outline"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: '0.55rem 1rem' }}
            >
              <Bell size={16} />
              <span>Yangi e’lon</span>
            </Link>
          )}
          {isTeacher && user.linkedStaff && (
            <Link 
              href={`/admin/staff/${user.linkedStaff}`} 
              className="btn btn-outline"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: '0.55rem 1rem' }}
            >
              <User size={16} />
              <span>Mening profilim</span>
            </Link>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="admin-stats-grid">
        {/* 1. News */}
        <div className="admin-stat-card">
          <div>
            <div className="admin-stat-value">{stats.newsCount}</div>
            <div className="admin-stat-label">Nashr etilgan yangiliklar</div>
          </div>
          <div 
            className="admin-stat-icon" 
            style={{ background: 'rgba(29, 78, 216, 0.1)', color: '#1d4ed8' }}
            aria-hidden="true"
          >
            <Newspaper size={22} />
          </div>
        </div>

        {/* 2. Review News (if admin/editor) */}
        {isEditorOrAdmin && (
          <div className="admin-stat-card">
            <div>
              <div className="admin-stat-value" style={{ color: '#d97706' }}>
                {stats.reviewNewsCount}
              </div>
              <div className="admin-stat-label">Ko‘rib chiqilayotganlar</div>
            </div>
            <div 
              className="admin-stat-icon" 
              style={{ background: 'rgba(245, 158, 11, 0.12)', color: '#d97706' }}
              aria-hidden="true"
            >
              <Clock size={22} />
            </div>
          </div>
        )}

        {/* 3. Active Notices */}
        <div className="admin-stat-card">
          <div>
            <div className="admin-stat-value">{stats.activeNoticesCount}</div>
            <div className="admin-stat-label">Faol rasmiy e’lonlar</div>
          </div>
          <div 
            className="admin-stat-icon" 
            style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#059669' }}
            aria-hidden="true"
          >
            <Bell size={22} />
          </div>
        </div>

        {/* 4. Staff */}
        <div className="admin-stat-card">
          <div>
            <div className="admin-stat-value">{stats.staffCount}</div>
            <div className="admin-stat-label">O‘qituvchi va xodimlar</div>
          </div>
          <div 
            className="admin-stat-icon" 
            style={{ background: 'rgba(79, 70, 229, 0.1)', color: '#4f46e5' }}
            aria-hidden="true"
          >
            <Users size={22} />
          </div>
        </div>

        {/* 5. Awards */}
        <div className="admin-stat-card">
          <div>
            <div className="admin-stat-value">{stats.awardsCount}</div>
            <div className="admin-stat-label">Maktab yutuqlari</div>
          </div>
          <div 
            className="admin-stat-icon" 
            style={{ background: 'rgba(217, 119, 6, 0.1)', color: '#d97706' }}
            aria-hidden="true"
          >
            <Award size={22} />
          </div>
        </div>

        {/* 6. Media */}
        <div className="admin-stat-card">
          <div>
            <div className="admin-stat-value">{stats.mediaCount}</div>
            <div className="admin-stat-label">Media fayllar</div>
          </div>
          <div 
            className="admin-stat-icon" 
            style={{ background: 'rgba(14, 165, 233, 0.1)', color: '#0284c7' }}
            aria-hidden="true"
          >
            <FolderOpen size={22} />
          </div>
        </div>
      </div>

      {/* Editorial Attention: Drafts requiring review */}
      {isEditorOrAdmin && draftsRequiringReview.length > 0 && (
        <div className="admin-card" style={{ borderLeft: '4px solid #f59e0b', padding: '1.25rem' }}>
          <div className="admin-card-header" style={{ marginBottom: '1rem' }}>
            <div>
              <h2 className="admin-card-title" style={{ color: '#b45309', display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '1.05rem' }}>
                <AlertTriangle size={18} />
                <span>Ko‘rib chiqishni kutayotgan maqolalar ({draftsRequiringReview.length})</span>
              </h2>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', margin: '0.25rem 0 0' }}>
                O‘qituvchilar tomonidan tayyorlangan va nashrga tavsiya etilgan qoralamalar.
              </p>
            </div>
          </div>
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Sarlavha</th>
                  <th>Kategoriya</th>
                  <th>Muallif</th>
                  <th>Yuborilgan sana</th>
                  <th style={{ textAlign: 'right' }}>Amal</th>
                </tr>
              </thead>
              <tbody>
                {draftsRequiringReview.map((doc: any) => (
                  <tr key={doc.id}>
                    <td style={{ fontWeight: 600 }}>{doc.title}</td>
                    <td>
                      <span className="badge badge-info">{doc.category}</span>
                    </td>
                    <td>{doc.author?.name || doc.author?.email || 'O‘qituvchi'}</td>
                    <td>{formatDate(doc.updatedAt || doc.createdAt)}</td>
                    <td style={{ textAlign: 'right' }}>
                      <Link
                        href={`/admin/news/${doc.id}`}
                        className="btn btn-primary"
                        style={{ padding: '0.35rem 0.75rem', fontSize: 'var(--text-xs)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                      >
                        <span>Tekshirish</span>
                        <ArrowRight size={13} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Expiring Announcements Alert */}
      {isEditorOrAdmin && expiringNotices.length > 0 && (
        <div className="admin-card" style={{ borderLeft: '4px solid #ef4444', padding: '1.25rem' }}>
          <div className="admin-card-header" style={{ marginBottom: '1rem' }}>
            <div>
              <h2 className="admin-card-title" style={{ color: '#b91c1c', display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '1.05rem' }}>
                <Clock size={18} />
                <span>Muddati 5 kun ichida tugaydigan e’lonlar ({expiringNotices.length})</span>
              </h2>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', margin: '0.25rem 0 0' }}>
                Ushbu e’lonlar belgilangan muddat o‘tgach bosh sahifadan avtomatik arxivga olinadi.
              </p>
            </div>
          </div>
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Sarlavha</th>
                  <th>Muhimlik</th>
                  <th>Tugash muddati</th>
                  <th style={{ textAlign: 'right' }}>Amal</th>
                </tr>
              </thead>
              <tbody>
                {expiringNotices.map((n: any) => (
                  <tr key={n.id}>
                    <td style={{ fontWeight: 600 }}>{n.title}</td>
                    <td>
                      <span className="badge badge-warning">{n.priority}</span>
                    </td>
                    <td>{formatDate(n.expiryDate)}</td>
                    <td style={{ textAlign: 'right' }}>
                      <Link
                        href={`/admin/notices/${n.id}`}
                        className="btn btn-outline"
                        style={{ padding: '0.35rem 0.75rem', fontSize: 'var(--text-xs)' }}
                      >
                        Muddatni uzaytirish
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recent Content */}
      <div className="admin-card" style={{ padding: '1.5rem' }}>
        <div className="admin-card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h2 className="admin-card-title" style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.15rem' }}>
              Oxirgi yangiliklar va maqolalar
            </h2>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', margin: '0.2rem 0 0' }}>
              Yaqinda yaratilgan va tahrirlangan maqolalar ro‘yxati
            </p>
          </div>
          <Link
            href="/admin/news"
            style={{ 
              fontSize: 'var(--text-xs)', 
              color: 'var(--color-primary)', 
              textDecoration: 'none', 
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}
          >
            <span>Barchasini ko‘rish</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {recentNews.length === 0 ? (
          <div className="admin-empty-state">
            <div className="admin-empty-icon" style={{ display: 'flex', justifyContent: 'center', color: 'var(--color-text-muted)' }}>
              <FileText size={48} />
            </div>
            <div className="admin-empty-title">Hozircha yangiliklar mavjud emas</div>
            <div className="admin-empty-desc">
              Birinchi yangilikni yozib, maktab hayoti haqida xabar bering.
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
                  <th>Holat</th>
                  <th>Sana</th>
                  <th style={{ textAlign: 'right' }}>Amal</th>
                </tr>
              </thead>
              <tbody>
                {recentNews.map((item: any) => (
                  <tr key={item.id}>
                    <td style={{ fontWeight: 600 }}>
                      <Link
                        href={`/admin/news/${item.id}`}
                        style={{ color: 'inherit', textDecoration: 'none' }}
                      >
                        {item.title}
                      </Link>
                    </td>
                    <td>
                      <span className="badge">{item.category}</span>
                    </td>
                    <td>
                      <span className={`status-badge status-${item.status}`}>
                        {item.status === 'nashr_qilingan'
                          ? 'Nashr qilingan'
                          : item.status === 'korib_chiqilmoqda'
                          ? 'Ko‘rib chiqilmoqda'
                          : item.status === 'ozgartirish_kerak'
                          ? 'Qaytarilgan'
                          : 'Qoralama'}
                      </span>
                    </td>
                    <td style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                      {formatDate(item.publishedAt || item.createdAt)}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <Link
                        href={`/admin/news/${item.id}`}
                        className="btn btn-outline"
                        style={{ 
                          padding: '0.35rem 0.7rem', 
                          fontSize: 'var(--text-xs)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          borderRadius: 'var(--radius-md)'
                        }}
                      >
                        <Edit3 size={12} />
                        <span>Tahrirlash</span>
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
