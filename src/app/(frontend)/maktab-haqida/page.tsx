import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getPayloadClient } from '@/lib/payload'
import { getMediaUrl, getMediaAlt } from '@/lib/utils'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { RichTextRenderer } from '@/components/RichTextRenderer'
import { Building, Award, Users, BookOpen, CheckCircle2, ShieldCheck, Phone, Mail, MapPin, GraduationCap } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Maktab haqida — 142-sonli umumiy o‘rta ta’lim maktabi',
  description: 'Toshkent shahar Mirzo Ulug‘bek tumani 142-maktabining tarixi, qadriyatlari, rahbariyati va zamonaviy o‘quv sharoitlari.',
}

export default async function AboutSchoolPage() {
  const payload = await getPayloadClient()

  // Check if CMS Page override exists
  const pageRes = await payload.find({
    collection: 'pages',
    where: {
      slug: { equals: 'maktab-haqida' },
      status: { equals: 'nashr_qilingan' },
    },
    limit: 1,
  }).catch(() => ({ docs: [] }))

  const cmsPage = pageRes.docs[0]

  // Fetch school leadership
  const leadershipRes = await payload.find({
    collection: 'staff',
    where: {
      role: { in: ['direktor', 'orinbosar_oquv', 'orinbosar_manaviyat'] },
      status: { equals: 'faol' },
    },
    sort: 'displayOrder',
    limit: 6,
  }).catch(() => ({ docs: [] }))

  // Global settings
  const settings = await payload.findGlobal({
    slug: 'site-settings',
  }).catch(() => null)

  return (
    <div className="section">
      <div className="container">
        <Breadcrumbs items={[{ label: 'Maktab haqida' }]} />

        {/* Hero Header */}
        <div style={{ maxWidth: '840px', marginBottom: '3.5rem' }}>
          <span className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>
            Rasmiy institutsional ma’lumotnoma
          </span>
          <h1 style={{ color: 'var(--color-navy-950)', marginBottom: '1.25rem' }}>
            142-sonli umumiy o‘rta ta’lim maktabi
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--color-muted)', lineHeight: 1.7 }}>
            Toshkent shahri Mirzo Ulug‘bek tumanida joylashgan davlat umumiy o‘rta ta’lim muassasasi. 
            Biz har bir o‘quvchining aqliy salohiyati, ma’naviy-axloqiy kamoloti va mustaqil fikrlash qobiliyatini yuksaltirishga intilamiz.
          </p>
        </div>

        {/* CMS Rich Text if defined */}
        {cmsPage?.content && (
          <div className="card" style={{ padding: '2.5rem', marginBottom: '3.5rem' }}>
            <RichTextRenderer content={cmsPage.content} />
          </div>
        )}

        {/* Key Institutional Facts */}
        <div className="grid grid-cols-1 grid-cols-2-sm grid-cols-4-lg" style={{ gap: '1.5rem', marginBottom: '4rem' }}>
          <div className="stat-pill">
            <div className="stat-icon-wrap" style={{ background: '#eff6ff', color: '#1d4ed8' }}>
              <Building size={26} />
            </div>
            <div>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.85rem', fontWeight: 800, color: 'var(--color-navy-950)', lineHeight: 1.1 }}>
                1 250+
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: 500 }}>
                Tahsil olayotgan o‘quvchilar
              </div>
            </div>
          </div>

          <div className="stat-pill">
            <div className="stat-icon-wrap" style={{ background: '#ecfdf5', color: '#059669' }}>
              <Users size={26} />
            </div>
            <div>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.85rem', fontWeight: 800, color: 'var(--color-navy-950)', lineHeight: 1.1 }}>
                85+
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: 500 }}>
                Oliy toifali pedagoglar
              </div>
            </div>
          </div>

          <div className="stat-pill">
            <div className="stat-icon-wrap" style={{ background: '#fffbeb', color: '#d97706' }}>
              <BookOpen size={26} />
            </div>
            <div>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.85rem', fontWeight: 800, color: 'var(--color-navy-950)', lineHeight: 1.1 }}>
                11 Yil
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: 500 }}>
                Uzluksiz davlat ta’limi
              </div>
            </div>
          </div>

          <div className="stat-pill">
            <div className="stat-icon-wrap" style={{ background: '#f5f3ff', color: '#7c3aed' }}>
              <Award size={26} />
            </div>
            <div>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.85rem', fontWeight: 800, color: 'var(--color-navy-950)', lineHeight: 1.1 }}>
                98%
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: 500 }}>
                OTMga kirish ko‘rsatkichi
              </div>
            </div>
          </div>
        </div>

        {/* Mission and Principles */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '2rem', marginBottom: '4rem' }}>
          <div className="card" style={{ padding: '2.25rem', borderLeft: '4px solid var(--color-primary)' }}>
            <h3 style={{ fontSize: '1.35rem', color: 'var(--color-navy-950)', marginBottom: '0.75rem' }}>
              Maktabimiz missiyasi
            </h3>
            <p style={{ lineHeight: 1.75, color: '#334155', margin: 0, fontSize: '1rem' }}>
              Har bir yosh avlod vakiliga chuqur akademik bilim berish bilan bir qatorda, 
              zamonaviy dunyoda o‘z o‘rnini topa oladigan, milliy qadriyatlarimizga sodiq, 
              mas’uliyatli va mustaqil qaror qabul qila oladigan komil insonni tarbiyalash.
            </p>
          </div>

          <div className="card" style={{ padding: '2.25rem', borderLeft: '4px solid #10b981' }}>
            <h3 style={{ fontSize: '1.35rem', color: 'var(--color-navy-950)', marginBottom: '0.75rem' }}>
              Asosiy ta’lim tamoyillari
            </h3>
            <ul style={{ margin: 0, paddingLeft: '1.25rem', lineHeight: 1.8, color: '#334155', fontSize: '0.95rem' }}>
              <li>O‘quvchiga yo‘naltirilgan individual ta’lim yondashuvi</li>
              <li>Aniq va tabiiy fanlar (STEM) amaliy integratsiyasi</li>
              <li>Zamonaviy xorijiy tillarni (ingliz, rus) chuqur o‘rganish</li>
              <li>Akademik halollik va doimiy o‘z ustida ishlash madaniyati</li>
            </ul>
          </div>
        </div>

        {/* School Leadership Section */}
        <div style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>Rahbariyat</span>
              <h2 style={{ marginBottom: 0 }}>Maktab rahbariyati</h2>
            </div>
            <Link href="/oqituvchilar" className="btn btn-outline">
              Barcha pedagogik jamoa &rarr;
            </Link>
          </div>

          {leadershipRes.docs.length > 0 ? (
            <div className="grid grid-cols-1 grid-cols-2-sm grid-cols-3-lg" style={{ gap: '1.75rem' }}>
              {leadershipRes.docs.map((leader: any) => (
                <div key={leader.id} className="card">
                  <div style={{ height: '240px', overflow: 'hidden', background: '#f1f5f9', position: 'relative' }}>
                    {leader.portrait ? (
                      <Image
                        src={getMediaUrl(leader.portrait)}
                        alt={getMediaAlt(leader.portrait, leader.fullName)}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        style={{ objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', color: '#1d4ed8', gap: '0.5rem' }}>
                        <GraduationCap size={44} />
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Maktab rahbari</span>
                      </div>
                    )}
                  </div>
                  <div className="card-body">
                    <span className="badge badge-primary" style={{ alignSelf: 'flex-start', marginBottom: '0.65rem' }}>
                      {leader.role === 'direktor'
                        ? 'Maktab direktori'
                        : leader.role === 'orinbosar_oquv'
                        ? 'Direktor o‘rinbosari (O‘quv)'
                        : 'Direktor o‘rinbosari (Ma’naviyat)'}
                    </span>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '0.35rem', lineHeight: 1.3 }}>
                      <Link href={`/oqituvchilar/${leader.slug}`} style={{ color: 'var(--color-navy-950)' }}>
                        {leader.fullName}
                      </Link>
                    </h3>
                    {leader.email && (
                      <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', margin: 0 }}>
                        {leader.email}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card" style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--color-muted)' }}>
              Rahbariyat ro‘yxati <Link href="/oqituvchilar">O‘qituvchilar bo‘limida</Link> keltirilgan.
            </div>
          )}
        </div>

        {/* Facilities & Infrastructure */}
        <div style={{ marginBottom: '4rem' }}>
          <div style={{ marginBottom: '2rem' }}>
            <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>Zamonaviy shart-sharoitlar</span>
            <h2 style={{ marginBottom: 0 }}>Maktab infratuzilmasi va qulayliklari</h2>
          </div>

          <div className="grid grid-cols-1 grid-cols-2-sm grid-cols-3-lg" style={{ gap: '1.5rem' }}>
            <div className="card" style={{ padding: '1.75rem' }}>
              <h4 style={{ fontSize: '1.15rem', color: 'var(--color-navy-950)', marginBottom: '0.5rem' }}>
                Laboratoriya va STEM xonalari
              </h4>
              <p style={{ fontSize: '0.925rem', color: 'var(--color-muted)', margin: 0, lineHeight: 1.65 }}>
                Fizika, kimyo va biologiya fanlari bo‘yicha to‘liq amaliy tajribalar o‘tkazish uchun jihozlangan maxsus laboratoriyalar.
              </p>
            </div>

            <div className="card" style={{ padding: '1.75rem' }}>
              <h4 style={{ fontSize: '1.15rem', color: 'var(--color-navy-950)', marginBottom: '0.5rem' }}>
                Zamonaviy IT va kompyuter sinflari
              </h4>
              <p style={{ fontSize: '0.925rem', color: 'var(--color-muted)', margin: 0, lineHeight: 1.65 }}>
                Tezkor optik tolali internetga ulangan zamonaviy kompyuterlar, dasturlash va robototexnika vositalari.
              </p>
            </div>

            <div className="card" style={{ padding: '1.75rem' }}>
              <h4 style={{ fontSize: '1.15rem', color: 'var(--color-navy-950)', marginBottom: '0.5rem' }}>
                Kutubxona va axborot-resurs markazi
              </h4>
              <p style={{ fontSize: '0.925rem', color: 'var(--color-muted)', margin: 0, lineHeight: 1.65 }}>
                15 000 dan ortiq darslik, badiiy adabiyot va ilmiy manbalarga ega kutubxona hamda tinch mutolaa zali.
              </p>
            </div>

            <div className="card" style={{ padding: '1.75rem' }}>
              <h4 style={{ fontSize: '1.15rem', color: 'var(--color-navy-950)', marginBottom: '0.5rem' }}>
                Yopiq sport zali va stadion
              </h4>
              <p style={{ fontSize: '0.925rem', color: 'var(--color-muted)', margin: 0, lineHeight: 1.65 }}>
                Gimnastika, basketbol, voleybol uchun yopiq sport zali hamda sun’iy qoplamali zamonaviy futbol maydoni.
              </p>
            </div>

            <div className="card" style={{ padding: '1.75rem' }}>
              <h4 style={{ fontSize: '1.15rem', color: 'var(--color-navy-950)', marginBottom: '0.5rem' }}>
                Tibbiy xizmat va psixologik xona
              </h4>
              <p style={{ fontSize: '0.925rem', color: 'var(--color-muted)', margin: 0, lineHeight: 1.65 }}>
                Doimiy faoliyat yurituvchi malakali tibbiyot xodimi hamda o‘quvchilar bilan individual ishlaydigan maktab psixologi.
              </p>
            </div>

            <div className="card" style={{ padding: '1.75rem' }}>
              <h4 style={{ fontSize: '1.15rem', color: 'var(--color-navy-950)', marginBottom: '0.5rem' }}>
                Oshxona va sog‘lom ovqatlanish
              </h4>
              <p style={{ fontSize: '0.925rem', color: 'var(--color-muted)', margin: 0, lineHeight: 1.65 }}>
                Sanitariya-gigiyena talablariga to‘liq javob beruvchi, issiq va sifatli taomlar tayyorlanadigan keng oshxona.
              </p>
            </div>
          </div>
        </div>

        {/* Contact info card */}
        <div className="card" style={{ padding: '2.25rem', background: '#ffffff', border: '1px solid var(--color-border)' }}>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--color-navy-950)', marginBottom: '1.25rem' }}>
            Rasmiy aloqa va manzil
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2.5rem', fontSize: '0.95rem', color: '#334155' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <MapPin size={20} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
              <span>{settings?.address || 'Toshkent shahar, Mirzo Ulug‘bek tumani, Sayram ko‘chasi, 42-uy'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Phone size={20} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
              <a href="tel:+998712680142" style={{ color: 'var(--color-navy-950)', fontWeight: 600 }}>
                {settings?.phone || '+998 71 268 01 42'}
              </a>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Mail size={20} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
              <a href="mailto:info@maktab142.uz" style={{ color: 'var(--color-navy-950)', fontWeight: 600 }}>
                {settings?.email || 'info@maktab142.uz'}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
