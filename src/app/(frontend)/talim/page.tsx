import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getPayloadClient } from '@/lib/payload'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { RichTextRenderer } from '@/components/RichTextRenderer'
import { BookOpen, Calendar, Clock, Award, CheckCircle2, GraduationCap, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Ta’lim jarayoni va o‘quv dasturlari — 142-maktab',
  description: '142-sonli maktabning ta’lim bosqichlari (1-11 sinf), o‘quv yili taqvimi, dars jadvali va baholash mezonlari.',
}

export default async function EducationPage() {
  const payload = await getPayloadClient()

  const pageRes = await payload.find({
    collection: 'pages',
    where: {
      slug: { equals: 'talim' },
      status: { equals: 'nashr_qilingan' },
    },
    limit: 1,
  }).catch(() => ({ docs: [] }))

  const cmsPage = pageRes.docs[0]

  return (
    <div className="section">
      <div className="container">
        <Breadcrumbs items={[{ label: 'Ta’lim' }]} />

        <div style={{ maxWidth: '840px', marginBottom: '3.5rem' }}>
          <span className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>
            Davlat ta’lim standarti
          </span>
          <h1 style={{ color: 'var(--color-navy-950)', marginBottom: '1rem' }}>
            Ta’lim bosqichlari va o‘quv dasturi
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--color-muted)', lineHeight: 1.7 }}>
            O‘zbekiston Respublikasi Maktabgacha va maktab ta’limi vazirligi tomonidan tasdiqlangan davlat ta’lim standartlari asosida tashkil etilgan uzluksiz 11 yillik umumiy o‘rta ta’lim tizimi.
          </p>
        </div>

        {cmsPage?.content && (
          <div className="card" style={{ padding: '2.5rem', marginBottom: '3.5rem' }}>
            <RichTextRenderer content={cmsPage.content} />
          </div>
        )}

        {/* 3 Education Stages */}
        <div style={{ marginBottom: '4.5rem' }}>
          <div style={{ marginBottom: '2rem' }}>
            <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>Bosqichma-bosqich rivojlanish</span>
            <h2 style={{ marginBottom: 0 }}>Uch bosqichli uzluksiz ta’lim tizimi</h2>
          </div>

          <div className="grid grid-cols-1 grid-cols-3-lg" style={{ gap: '2rem' }}>
            {/* Stage 1 */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '1.75rem', borderBottom: '1px solid var(--color-border)', backgroundColor: '#f8fafc' }}>
                <span className="badge badge-primary" style={{ marginBottom: '0.65rem' }}>1–4 sinflar</span>
                <h3 style={{ fontSize: '1.35rem', margin: 0, color: 'var(--color-navy-950)' }}>
                  Boshlang‘ich ta’lim
                </h3>
              </div>
              <div className="card-body" style={{ flex: 1 }}>
                <p style={{ fontSize: '0.95rem', color: '#475569', lineHeight: 1.65, marginBottom: '1.25rem' }}>
                  Bolalarda o‘qish, yozish, hisoblash, mustaqil fikrlash ko‘nikmalarini shakllantirish va atrof-olamni anglash asoslari.
                </p>
                <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.9rem', color: '#334155', lineHeight: 1.75 }}>
                  <li>Ona tili va o‘qish savodxonligi</li>
                  <li>Matematika va mantiqiy fikrlash</li>
                  <li>Tabiiy fanlar (Science integratsiyasi)</li>
                  <li>Ingliz tili (boshlang‘ich interaktiv)</li>
                  <li>Tasviriy san’at, texnologiya va musiqa</li>
                </ul>
              </div>
            </div>

            {/* Stage 2 */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '1.75rem', borderBottom: '1px solid var(--color-border)', backgroundColor: '#f8fafc' }}>
                <span className="badge badge-primary" style={{ marginBottom: '0.65rem' }}>5–9 sinflar</span>
                <h3 style={{ fontSize: '1.35rem', margin: 0, color: 'var(--color-navy-950)' }}>
                  Tayanch o‘rta ta’lim
                </h3>
              </div>
              <div className="card-body" style={{ flex: 1 }}>
                <p style={{ fontSize: '0.95rem', color: '#475569', lineHeight: 1.65, marginBottom: '1.25rem' }}>
                  Fundamental ilmiy bilimlar, tizimli tahlil, laboratoriya amaliyotlari va dastlabki kasbga yo‘naltirish davri.
                </p>
                <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.9rem', color: '#334155', lineHeight: 1.75 }}>
                  <li>Algebra, geometriya va matematika</li>
                  <li>Fizika, kimyo va biologiya laboratoriyalari</li>
                  <li>O‘zbekiston tarixi va jahon tarixi</li>
                  <li>Informatika, IT va robototexnika</li>
                  <li>Chet tillari va adabiyot</li>
                </ul>
              </div>
            </div>

            {/* Stage 3 */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '1.75rem', borderBottom: '1px solid var(--color-border)', backgroundColor: '#f8fafc' }}>
                <span className="badge badge-primary" style={{ marginBottom: '0.65rem' }}>10–11 sinflar</span>
                <h3 style={{ fontSize: '1.35rem', margin: 0, color: 'var(--color-navy-950)' }}>
                  Umumiy o‘rta ta’lim
                </h3>
              </div>
              <div className="card-body" style={{ flex: 1 }}>
                <p style={{ fontSize: '0.95rem', color: '#475569', lineHeight: 1.65, marginBottom: '1.25rem' }}>
                  Chuqurlashtirilgan fan yo‘nalishlari, OTMga kirish imtihonlariga tizimli tayyorgarlik va ilmiy izlanishlar.
                </p>
                <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.9rem', color: '#334155', lineHeight: 1.75 }}>
                  <li>Aniq va tabiiy fanlar ixtisoslashuvi</li>
                  <li>Xalqaro til sertifikatlari (IELTS, CEFR)</li>
                  <li>Respublika va xalqaro fan olimpiadalari</li>
                  <li>Universitetlarga tayyorgarlik maslahatlari</li>
                  <li>Davlat attestatsiyasi va yakuniy imtihonlar</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Academic Calendar Table */}
        <div style={{ marginBottom: '4.5rem' }}>
          <div style={{ marginBottom: '1.75rem' }}>
            <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>Akademik reja</span>
            <h2 style={{ marginBottom: 0, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Calendar size={24} style={{ color: 'var(--color-primary)' }} />
              <span>O‘quv yili taqvimi va ta’tillar (2025–2026)</span>
            </h2>
          </div>

          <div className="card" style={{ overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.95rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid var(--color-border)' }}>
                    <th style={{ padding: '1.1rem 1.5rem', color: 'var(--color-navy-950)', fontWeight: 700 }}>O‘quv choragi</th>
                    <th style={{ padding: '1.1rem 1.5rem', color: 'var(--color-navy-950)', fontWeight: 700 }}>Davomiyligi</th>
                    <th style={{ padding: '1.1rem 1.5rem', color: 'var(--color-navy-950)', fontWeight: 700 }}>Ta’til davri</th>
                    <th style={{ padding: '1.1rem 1.5rem', color: 'var(--color-navy-950)', fontWeight: 700 }}>Ta’til kunlari</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--color-navy-950)' }}>I chorak</td>
                    <td style={{ padding: '1rem 1.5rem' }}>2-sentabr – 3-noyabr</td>
                    <td style={{ padding: '1rem 1.5rem' }}>4-noyabr – 10-noyabr (Kuzgi ta’til)</td>
                    <td style={{ padding: '1rem 1.5rem', color: 'var(--color-primary)', fontWeight: 700 }}>6 kun</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--color-navy-950)' }}>II chorak</td>
                    <td style={{ padding: '1rem 1.5rem' }}>11-noyabr – 27-dekabr</td>
                    <td style={{ padding: '1rem 1.5rem' }}>28-dekabr – 10-yanvar (Qishki ta’til)</td>
                    <td style={{ padding: '1rem 1.5rem', color: 'var(--color-primary)', fontWeight: 700 }}>14 kun</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--color-navy-950)' }}>III chorak</td>
                    <td style={{ padding: '1rem 1.5rem' }}>11-yanvar – 20-mart</td>
                    <td style={{ padding: '1rem 1.5rem' }}>21-mart – 27-mart (Bahorgi ta’til)</td>
                    <td style={{ padding: '1rem 1.5rem', color: 'var(--color-primary)', fontWeight: 700 }}>7 kun</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--color-navy-950)' }}>IV chorak</td>
                    <td style={{ padding: '1rem 1.5rem' }}>28-mart – 25-may</td>
                    <td style={{ padding: '1rem 1.5rem' }}>26-may – 1-sentabr (Yozgi ta’til)</td>
                    <td style={{ padding: '1rem 1.5rem', color: 'var(--color-primary)', fontWeight: 700 }}>Yoz oylari</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Daily Schedule & Grading */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '2rem', marginBottom: '3.5rem' }}>
          <div className="card" style={{ padding: '2.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.5rem' }}>
              <Clock size={24} style={{ color: 'var(--color-primary)' }} />
              <h3 style={{ fontSize: '1.25rem', margin: 0, color: 'var(--color-navy-950)' }}>
                Qo‘ng‘iroqlar jadvali (1-smena)
              </h3>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, lineHeight: 2.2, fontSize: '0.95rem' }}>
              <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #e2e8f0' }}>
                <span>1-dars:</span> <strong style={{ color: 'var(--color-navy-950)' }}>08:00 – 08:45</strong>
              </li>
              <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #e2e8f0' }}>
                <span>2-dars:</span> <strong style={{ color: 'var(--color-navy-950)' }}>08:50 – 09:35</strong>
              </li>
              <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #e2e8f0' }}>
                <span>3-dars:</span> <strong style={{ color: 'var(--color-navy-950)' }}>09:45 – 10:30</strong>
              </li>
              <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #e2e8f0' }}>
                <span>4-dars:</span> <strong style={{ color: 'var(--color-navy-950)' }}>10:40 – 11:25</strong>
              </li>
              <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #e2e8f0' }}>
                <span>5-dars:</span> <strong style={{ color: 'var(--color-navy-950)' }}>11:35 – 12:20</strong>
              </li>
              <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>6-dars:</span> <strong style={{ color: 'var(--color-navy-950)' }}>12:25 – 13:10</strong>
              </li>
            </ul>
          </div>

          <div className="card" style={{ padding: '2.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.5rem' }}>
              <GraduationCap size={24} style={{ color: 'var(--color-primary)' }} />
              <h3 style={{ fontSize: '1.25rem', margin: 0, color: 'var(--color-navy-950)' }}>
                Baholash tizimi va elektron jurnal
              </h3>
            </div>
            <p style={{ fontSize: '0.95rem', color: '#475569', lineHeight: 1.65, marginBottom: '1.25rem' }}>
              Maktabimizda o‘quvchilar bilimi O‘zbekiston davlat 5 ballik baholash shkalasi bo‘yicha baholanadi. Barcha baholar, davomat va uy vazifalari <strong>Kundalik (eMaktab)</strong> tizimida yuritiladi.
            </p>
            <div style={{ backgroundColor: '#f8fafc', padding: '1.25rem', borderRadius: 'var(--radius-md)', fontSize: '0.9rem', color: '#334155', border: '1px solid var(--color-border)' }}>
              <p style={{ margin: '0 0 0.5rem' }}><strong style={{ color: '#059669' }}>5 (A’lo)</strong> — Fan dasturini to‘liq o‘zlashtirgan (86–100%)</p>
              <p style={{ margin: '0 0 0.5rem' }}><strong style={{ color: '#1d4ed8' }}>4 (Yaxshi)</strong> — Kichik kamchiliklar bilan o‘zlashtirgan (71–85%)</p>
              <p style={{ margin: '0 0 0.5rem' }}><strong style={{ color: '#d97706' }}>3 (Qoniqarli)</strong> — Asosiy talablarni bajargan (56–70%)</p>
              <p style={{ margin: 0 }}><strong style={{ color: '#dc2626' }}>2 (Qoniqarsiz)</strong> — Dasturni o‘zlashtirmagan (0–55%)</p>
            </div>
          </div>
        </div>

        {/* Link to School Profile */}
        <div className="card" style={{ padding: '2.25rem', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', color: '#1e3a8a', margin: '0 0 0.35rem' }}>
                Xalqaro va OTM qabullari uchun rasmiy maktab profili
              </h3>
              <p style={{ margin: 0, color: '#1e40af', fontSize: '0.95rem' }}>
                GPA konvertatsiyasi, unweighted 4.0 baholash tizimi va Common App talablari bilan tanishing.
              </p>
            </div>
            <Link href="/school-profile" className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>
              <span>School Profile sahifasi</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
