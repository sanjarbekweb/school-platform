import React from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getPayloadClient } from '@/lib/payload'
import { getMediaUrl, getMediaAlt } from '@/lib/utils'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { Mail, Phone, Award, BookOpen, GraduationCap, ChevronLeft } from 'lucide-react'

interface PageProps {
  params: Promise<{ slug: string }>
}

export const dynamic = 'force-static'
export const dynamicParams = true

export async function generateStaticParams() {
  try {
    const payload = await getPayloadClient()
    const res = await payload.find({
      collection: 'staff',
      where: { status: { equals: 'faol' } },
      limit: 200,
    })
    return res.docs.map((doc: any) => ({ slug: doc.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayloadClient()

  const res = await payload.find({
    collection: 'staff',
    where: {
      slug: { equals: slug },
      status: { equals: 'faol' },
    },
    limit: 1,
  }).catch(() => ({ docs: [] }))

  const staff = res.docs[0]
  if (!staff) {
    return { title: 'Xodim topilmadi' }
  }

  return {
    title: `${staff.fullName} — O‘qituvchi profili`,
    description: staff.bio || `${staff.fullName} - 142-sonli maktab o‘qituvchisi.`,
  }
}

export default async function TeacherDetailPage({ params }: PageProps) {
  const { slug } = await params
  const payload = await getPayloadClient()

  const staffRes = await payload.find({
    collection: 'staff',
    where: {
      slug: { equals: slug },
      status: { equals: 'faol' },
    },
    limit: 1,
  }).catch(() => ({ docs: [] }))

  const staff = staffRes.docs[0]
  if (!staff) {
    notFound()
  }

  const roleLabels: Record<string, string> = {
    direktor: 'Maktab direktori',
    orinbosar_oquv: 'O‘quv ishlari bo‘yicha direktor o‘rinbosari',
    orinbosar_manaviyat: 'Ma’naviy-ma’rifiy ishlar bo‘yicha o‘rinbosar',
    oqituvchi: 'Fan o‘qituvchisi',
    boshlangich: 'Boshlang‘ich sinf o‘qituvchisi',
    psixolog: 'Maktab psixologi',
    kutubxonachi: 'Kutubxona mudiri',
  }

  const subjectLabels: Record<string, string> = {
    matematika: 'Matematika',
    ona_tili: 'Ona tili va adabiyot',
    fizika: 'Fizika',
    kimyo: 'Kimyo',
    biologiya: 'Biologiya',
    ingliz_tili: 'Ingliz tili',
    tarix: 'Tarix va huquq',
    informatika: 'Informatika va IT',
    boshlangich_talim: 'Boshlang‘ich ta’lim',
    jismoniy_tarbiya: 'Jismoniy tarbiya',
    sanat: 'Tasviriy san’at va musiqa',
  }

  // Find linked user for author attribution if present
  const userRes = await payload.find({
    collection: 'users',
    where: { linkedStaff: { equals: staff.id } },
    limit: 1,
  }).catch(() => ({ docs: [] }))
  const linkedUserId = userRes.docs[0]?.id

  const authorConditions: any[] = [{ authorStaff: { equals: staff.id } }]
  if (linkedUserId) {
    authorConditions.push({ author: { equals: linkedUserId } })
  }

  // Fetch articles authored by this staff member (checking both authorStaff and linked user)
  const articlesRes = await payload.find({
    collection: 'news',
    where: {
      or: authorConditions,
      status: { equals: 'nashr_qilingan' },
    },
    limit: 6,
    sort: '-publishedAt',
  }).catch(() => ({ docs: [] }))

  const portraitUrl = getMediaUrl(staff.portrait)
  const portraitAlt = getMediaAlt(staff.portrait, staff.fullName)

  return (
    <div className="section">
      <div className="container">
        <Breadcrumbs
          items={[
            { label: 'O‘qituvchilar', href: '/oqituvchilar' },
            { label: staff.fullName },
          ]}
        />

        <div style={{ marginBottom: '1.5rem' }}>
          <Link href="/oqituvchilar" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-navy)', fontSize: '0.9rem', fontWeight: 500 }}>
            <ChevronLeft size={16} /> Barcha o‘qituvchilar ro‘yxatiga qaytish
          </Link>
        </div>

        <div className="detail-split-grid">
          {/* Left Column: Portrait & Direct Contact */}
          <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ width: '220px', height: '275px', margin: '0 auto 1.5rem', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: '#f1f5f9', boxShadow: 'var(--shadow-sm)', position: 'relative' }}>
              {portraitUrl ? (
                <Image
                  src={portraitUrl}
                  alt={portraitAlt}
                  width={220}
                  height={275}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  priority
                />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                  <GraduationCap size={64} />
                </div>
              )}
            </div>

            <span className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>
              {roleLabels[staff.role] || staff.role}
            </span>

            {staff.subject && (
              <p style={{ margin: '0 0 1rem', color: 'var(--color-muted)', fontSize: '0.95rem', fontWeight: 500 }}>
                {subjectLabels[staff.subject] || staff.subject}
              </p>
            )}

            <div style={{ textAlign: 'left', borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem', marginTop: '1rem' }}>
              {staff.email && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem', fontSize: '0.85rem' }}>
                  <Mail size={16} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                  <span style={{ wordBreak: 'break-all' }}>{staff.email}</span>
                </div>
              )}

              {staff.phone && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem' }}>
                  <Phone size={16} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                  <span>{staff.phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Bio, Qualifications, Achievements, Authored Content */}
          <div>
            <h1 style={{ fontSize: '2.2rem', marginBottom: '0.5rem', color: 'var(--color-navy)' }}>
              {staff.fullName}
            </h1>

            {staff.qualifications && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-muted)', fontSize: '1.05rem', marginBottom: '1.75rem' }}>
                <BookOpen size={18} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                <span>{staff.qualifications}</span>
              </div>
            )}

            {staff.bio && (
              <div className="card" style={{ padding: '1.75rem', marginBottom: '1.75rem' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem', color: 'var(--color-navy)' }}>
                  Faoliyati va qisqacha ma’lumot
                </h3>
                <p style={{ margin: 0, lineHeight: 1.7, color: '#334155', whiteSpace: 'pre-line' }}>
                  {staff.bio}
                </p>
              </div>
            )}

            {staff.achievements && (
              <div className="card" style={{ padding: '1.75rem', marginBottom: '1.75rem', backgroundColor: '#f8fafc', borderLeft: '4px solid var(--color-primary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <Award size={20} style={{ color: 'var(--color-primary)' }} />
                  <h3 style={{ fontSize: '1.2rem', margin: 0, color: 'var(--color-navy)' }}>
                    Yutuqlari va e’tiroflari
                  </h3>
                </div>
                <p style={{ margin: 0, lineHeight: 1.6, color: '#334155', whiteSpace: 'pre-line' }}>
                  {staff.achievements}
                </p>
              </div>
            )}

            {articlesRes.docs.length > 0 && (
              <div style={{ marginTop: '2.5rem' }}>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', color: 'var(--color-navy)' }}>
                  Mualliflik maqolalari va yangiliklari
                </h3>
                <div className="grid grid-cols-1 grid-cols-2-sm" style={{ gap: '1rem' }}>
                  {articlesRes.docs.map((article: any) => (
                    <div key={article.id} className="card" style={{ padding: '1.25rem' }}>
                      <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>
                        <Link href={`/yangiliklar/${article.slug}`} style={{ color: 'var(--color-navy)' }}>
                          {article.title}
                        </Link>
                      </h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', margin: 0 }}>
                        {article.summary ? (article.summary.slice(0, 110) + '...') : ''}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
