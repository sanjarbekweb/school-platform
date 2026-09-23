import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getCachedStaffArchive } from '@/lib/data/cached'
import { getMediaUrl, getMediaAlt } from '@/lib/utils'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { Pagination } from '@/components/Pagination'
import { Mail, GraduationCap, Award, ChevronRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'O‘qituvchilar va pedagogik jamoa',
  description: '142-sonli maktabning rahbariyati, oliy toifali pedagoglari va o‘qituvchilari.',
}

export default async function TeachersDirectoryPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams
  const rawSubject = Array.isArray(resolvedParams.fan) ? resolvedParams.fan[0] : resolvedParams.fan
  const subjectFilter = rawSubject || ''

  const rawPage = Array.isArray(resolvedParams.page) ? resolvedParams.page[0] : resolvedParams.page
  const currentPage = rawPage ? Math.max(1, parseInt(rawPage, 10) || 1) : 1

  const staffRes = await getCachedStaffArchive(subjectFilter, currentPage, 12)

  const subjects = [
    { label: 'Barchasi', value: '' },
    { label: 'Matematika', value: 'matematika' },
    { label: 'Ona tili', value: 'ona_tili' },
    { label: 'Fizika', value: 'fizika' },
    { label: 'Kimyo', value: 'kimyo' },
    { label: 'Biologiya', value: 'biologiya' },
    { label: 'Ingliz tili', value: 'ingliz_tili' },
    { label: 'Informatika', value: 'informatika' },
    { label: 'Boshlang‘ich', value: 'boshlangich_talim' },
  ]

  const roleLabels: Record<string, string> = {
    direktor: 'Maktab direktori',
    orinbosar_oquv: 'O‘quv ishlari bo‘yicha direktor o‘rinbosari',
    orinbosar_manaviyat: 'Ma’naviy-ma’rifiy ishlar bo‘yicha o‘rinbosar',
    oqituvchi: 'Fan o‘qituvchisi',
    boshlangich: 'Boshlang‘ich sinf o‘qituvchisi',
    psixolog: 'Maktab psixologi',
    kutubxonachi: 'Kutubxona mudiri',
  }

  return (
    <div className="section">
      <div className="container">
        <Breadcrumbs items={[{ label: 'O‘qituvchilar' }]} />

        <div style={{ marginBottom: '2.5rem' }}>
          <span className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>Pedagogik jamoa</span>
          <h1 style={{ color: 'var(--color-navy-950)', marginBottom: '0.75rem' }}>O‘qituvchilar va mutaxassislar</h1>
          <p style={{ color: 'var(--color-muted)', fontSize: '1.1rem', maxWidth: '44rem' }}>
            Maktabimizda tahsil beruvchi oliy toifali, boy tajribaga ega va doimiy o‘z ustida ishlovchi fidoyi ustozlarimiz.
          </p>
        </div>

        {/* Subject Filters */}
        <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
          {subjects.map((sub) => {
            const isActive = subjectFilter === sub.value
            const href = sub.value ? `/oqituvchilar?fan=${sub.value}` : '/oqituvchilar'
            return (
              <Link
                key={sub.value}
                href={href}
                className={isActive ? 'btn btn-primary' : 'btn btn-outline'}
                style={{ 
                  padding: '0.5rem 1.15rem', 
                  fontSize: '0.875rem',
                  borderRadius: '9999px',
                  fontWeight: 600,
                }}
              >
                {sub.label}
              </Link>
            )
          })}
        </div>

        {/* Staff Grid */}
        {staffRes.docs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 grid-cols-2-sm grid-cols-4-lg">
              {staffRes.docs.map((staff: any) => (
                <div key={staff.id} className="card">
                  <div style={{ height: '240px', overflow: 'hidden', background: '#f1f5f9', position: 'relative' }}>
                    {staff.portrait ? (
                      <Image
                        src={getMediaUrl(staff.portrait)}
                        alt={getMediaAlt(staff.portrait, staff.fullName)}
                        fill
                        sizes="(max-width: 768px) 100vw, 25vw"
                        style={{ objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{ 
                        width: '100%', 
                        height: '100%', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)', 
                        color: '#64748b',
                        gap: '0.5rem'
                      }}>
                        <GraduationCap size={44} color="#3b82f6" />
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>142-maktab pedagogi</span>
                      </div>
                    )}
                  </div>

                  <div className="card-body">
                    <span className="badge badge-primary" style={{ alignSelf: 'flex-start', marginBottom: '0.65rem' }}>
                      {roleLabels[staff.role] || staff.role}
                    </span>

                    <h3 style={{ fontSize: '1.15rem', marginBottom: '0.35rem', lineHeight: 1.3 }}>
                      <Link href={`/oqituvchilar/${staff.slug}`} style={{ color: 'var(--color-navy-950)' }}>
                        {staff.fullName}
                      </Link>
                    </h3>

                    {staff.qualifications && (
                      <p style={{ fontSize: '0.875rem', color: 'var(--color-muted)', marginBottom: '0.75rem', flex: 1, lineHeight: 1.5 }}>
                        {staff.qualifications}
                      </p>
                    )}

                    {staff.email && (
                      <div style={{ marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--color-border)', fontSize: '0.8rem', color: 'var(--color-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Mail size={14} color="#3b82f6" />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{staff.email}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <Pagination
              currentPage={staffRes.page || 1}
              totalPages={staffRes.totalPages || 1}
              baseUrl="/oqituvchilar"
              searchParams={{ fan: subjectFilter }}
            />
          </>
        ) : (
          <div className="card" style={{ padding: '3.5rem 2rem', textAlign: 'center', color: 'var(--color-muted)' }}>
            <p style={{ margin: 0, fontSize: '1.05rem' }}>
              Ushbu fan bo‘yicha o‘qituvchilar ro‘yxati tekshirilmoqda.
            </p>
          </div>
        )}

      </div>
    </div>
  )
}
