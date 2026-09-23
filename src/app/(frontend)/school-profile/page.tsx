import React from 'react'
import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { PrintButton } from '@/components/PrintButton'
import { AlertCircle } from 'lucide-react'

import { getPayloadClient } from '@/lib/payload'

export const metadata: Metadata = {
  title: 'Maktab profili (School Profile)',
  description: '142-sonli umumiy o‘rta ta’lim maktabining oliy ta’lim muassasalari qabul komissiyalari (Admissions Officers) uchun rasmiy institutsional profili.',
}

export default async function SchoolProfilePage() {
  let settings: any = null
  try {
    const payload = await getPayloadClient()
    settings = await payload.findGlobal({ slug: 'site-settings' }).catch(() => null)
  } catch {
    // fallback
  }

  const schoolName = settings?.schoolName || '142-sonli umumiy o‘rta ta’lim maktabi'
  const schoolNumber = settings?.schoolNumber || '142'
  const directorName = settings?.directorName || 'Maktab rahbariyati'
  const counselorName = settings?.counselorName || 'Akademik maslahatchi'
  const counselorEmail = settings?.counselorEmail || 'admissions@maktab142.uz'
  const phone = settings?.phone || '+998 71 200 01 42'
  const address = settings?.address || 'Toshkent shahri, Mirzo Ulug‘bek tumani, 142-maktab'
  const lastVerifiedDate = settings?.lastVerifiedDate || '2026-yil sentyabr'
  const approvedBy = settings?.approvedBy || '142-maktab ma’muriyati'

  return (
    <div className="section">
      <div className="container">
        <Breadcrumbs items={[{ label: 'Maktab haqida', href: '/maktab-haqida' }, { label: 'Maktab profili' }]} />

        {/* Page Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1.5rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
          <div>
            <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>
              Rasmiy maktab profili: 2026-2027 o‘quv yili
            </span>
            <h1 style={{ marginBottom: '0.5rem' }}>Maktab profili (School Profile)</h1>
            <p style={{ color: 'var(--color-muted)', fontSize: '1.05rem', maxWidth: '44rem' }}>
              Mahalliy va xalqaro oliy ta’lim muassasalari qabul komissiyalari hamda akademik hamkorlar uchun institutsional ma’lumotnoma.
            </p>
          </div>

          <div className="no-print">
            <PrintButton />
          </div>
        </div>

        <div className="reading-column" style={{ maxWidth: '52rem' }}>
          {/* Printable Official Letterhead Header */}
          <div className="profile-letterhead" style={{ borderBottom: '2px solid var(--color-navy)', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', color: 'var(--color-navy)', marginBottom: '0.25rem' }}>
                  {schoolName}
                </h2>
                <p style={{ fontSize: '0.95rem', color: 'var(--color-muted)', margin: 0 }}>
                  Maktabgacha va maktab ta’limi vazirligi | Toshkent shahri, Mirzo Ulug‘bek tumani
                </p>
                <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.25rem' }}>
                  <strong>Muassasa kodi:</strong> {schoolNumber} | <strong>Veb-sayt:</strong> https://maktab142.uz
                </p>
              </div>
              <div style={{ textAlign: 'right', fontSize: '0.85rem', color: 'var(--color-muted)' }}>
                <div><strong>O‘quv yili:</strong> 2026-2027</div>
                <div><strong>Tasdiqlangan:</strong> {lastVerifiedDate}</div>
              </div>
            </div>
          </div>

          {/* 1. Leadership & Institutional Admissions Contact */}
          <section style={{ marginBottom: '2.5rem' }}>
            <h3 style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
              1. Muassasa rahbariyati va qabul xizmati bilan aloqa
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: '1rem 0', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.95rem' }}>
              <li><strong>Maktab direktori:</strong> {directorName}</li>
              <li><strong>Oliy ta’lim va kasbga yo‘naltirish maslahatchisi:</strong> {counselorName}</li>
              <li><strong>Universitetlar uchun rasmiy elektron manzil:</strong> <a href={`mailto:${counselorEmail}`}>{counselorEmail}</a></li>
              <li><strong>Telefon:</strong> {phone}</li>
              <li><strong>Pochta manzili:</strong> {address}</li>
            </ul>
          </section>

          {/* 2. School & Community Context */}
          <section style={{ marginBottom: '2.5rem' }}>
            <h3 style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
              2. Maktab turi va akademik taqvim
            </h3>
            <p style={{ lineHeight: 1.7 }}>
              142-sonli umumiy o‘rta ta’lim maktabi O‘zbekiston Respublikasi davlat ta’lim tizimiga qarashli kunduzgi umumta’lim muassasasi hisoblanadi. Maktabda ta’lim 1-sinfdan 11-sinfgacha tashkil etilgan.
            </p>
            <p style={{ lineHeight: 1.7, fontSize: '0.95rem', color: 'var(--color-muted)' }}>
              <strong>Ta’lim tili:</strong> O‘zbek tili, Rus tili.<br />
              <strong>Akademik taqvim:</strong> 4 chorak (Sentyabr — May oylari), jami 34 o‘quv haftasi.
            </p>
          </section>

          {/* 3. Grading System & Class Ranking Policy */}
          <section style={{ marginBottom: '2.5rem' }}>
            <h3 style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
              3. Baholash tizimi va akademik siyosat
            </h3>
            <p style={{ marginBottom: '1rem', lineHeight: 1.6 }}>
              O‘zbekiston Respublikasi ta’lim tizimida davlat tomonidan belgilangan 5 ballik baholash shkalasi qo‘llaniladi. Baholash mezoni quyidagicha tartibga solingan:
            </p>

            <div style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
              <table className="grading-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
                <thead>
                  <tr style={{ background: 'var(--color-surface)', borderBottom: '2px solid var(--color-border)', textAlign: 'left' }}>
                    <th style={{ padding: '0.75rem 1rem' }}>Davlat bahosi</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Tavsif (Uzbek)</th>
                    <th style={{ padding: '0.75rem 1rem' }}>O‘zlashtirish foizi</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Xalqaro ekvivalent</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--color-success)' }}>5</td>
                    <td style={{ padding: '0.75rem 1rem' }}>A’lo (Excellent)</td>
                    <td style={{ padding: '0.75rem 1rem' }}>86% – 100%</td>
                    <td style={{ padding: '0.75rem 1rem' }}>A (4.0)</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--color-primary)' }}>4</td>
                    <td style={{ padding: '0.75rem 1rem' }}>Yaxshi (Good)</td>
                    <td style={{ padding: '0.75rem 1rem' }}>71% – 85%</td>
                    <td style={{ padding: '0.75rem 1rem' }}>B (3.0)</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#d97706' }}>3</td>
                    <td style={{ padding: '0.75rem 1rem' }}>Qoniqarli (Satisfactory)</td>
                    <td style={{ padding: '0.75rem 1rem' }}>56% – 70%</td>
                    <td style={{ padding: '0.75rem 1rem' }}>C (2.0)</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--color-error)' }}>2</td>
                    <td style={{ padding: '0.75rem 1rem' }}>Qoniqarsiz (Fail)</td>
                    <td style={{ padding: '0.75rem 1rem' }}>0% – 55%</td>
                    <td style={{ padding: '0.75rem 1rem' }}>F (0.0)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style={{ background: '#f8fafc', borderLeft: '4px solid #3b82f6', padding: '1rem', marginBottom: '1rem', fontSize: '0.9rem', color: '#334155' }}>
              <p style={{ margin: '0 0 0.5rem 0' }}>
                <strong>Sinf bo‘yicha reyting (Class Rank):</strong> Maktabimiz o‘quvchilarni sinf yoki maktab miqyosida rasmiy reyting tartibida (Class Rank) tabaqalashtirmaydi va reyting ko‘rsatkichlarini rasmiy hujjatlarda qayd etmaydi.
              </p>
              <p style={{ margin: 0 }}>
                <strong>GPA vazni (Weighting):</strong> Barcha o‘quv fanlari davlat attestatiga teng qiymatda kiritiladi; og‘irlikli GPA (weighted GPA) hisoblanmaydi.
              </p>
            </div>
          </section>

          {/* 4. Graduation Requirements */}
          <section style={{ marginBottom: '2.5rem' }}>
            <h3 style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
              4. Maktabni tamomlash talablari (Graduation Requirements)
            </h3>
            <p style={{ lineHeight: 1.7, marginBottom: '1rem' }}>
              Umumiy o‘rta ta’lim to‘g‘risidagi davlat shahodatnomasini (attestat) olish uchun 11-sinf o‘quvchilari quyidagi shartlarni bajarishlari shart:
            </p>
            <ol style={{ paddingLeft: '1.5rem', lineHeight: 1.7 }}>
              <li>10- va 11-sinflar uchun belgilangan barcha majburiy fanlar dasturini muvaffaqiyatli o‘zlashtirish;</li>
              <li>Yillik barcha fanlardan ijobiy (kamida 3 - &ldquo;qoniqarli&rdquo;) baholarga ega bo‘lish;</li>
              <li>Maktabgacha va maktab ta’limi vazirligi tomonidan tasdiqlangan yakuniy davlat attestatsiyasi (imtihonlari)ni muvaffaqiyatli topshirish.</li>
            </ol>
          </section>

          {/* 5. Mandatory University Verification Disclaimer */}
          <section className="profile-disclaimer-box" style={{ background: '#fffbeb', border: '1px solid #fde68a', borderLeft: '4px solid #d97706', padding: '1.5rem', borderRadius: 'var(--radius-card)', marginBottom: '2.5rem' }}>
            <h3 style={{ color: '#92400e', fontSize: '1.1rem', marginTop: 0, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={20} />
              <span>Oliy ta’lim muassasalari va qabul komissiyalari diqqatiga (Official Disclaimer)</span>
            </h3>
            <p style={{ color: '#78350f', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '0.75rem' }}>
              <strong>Rasmiy transkript va tavsiyanomalar yuborish tartibi:</strong> Ushbu veb-sahifa va unda keltirilgan ma’lumotnoma faqat yordamchi institutsional kontekst vazifasini o‘taydi. O‘quvchining rasmiy baholar varaqasi (transkript), tavsiyanomalar va maktab hisoboti (School Report) faqatgina qabul qiluvchi universitet tomonidan tasdiqlangan rasmiy elektron tizimlar (Common Application, Parchment yoki maktabning rasmiy institutsional emaili) orqali vakolatli maslahatchi/ma’muriyat tomonidan to‘g‘ridan-to‘g‘ri yuborilgandagina rasmiy deb tan olinadi.
            </p>
            <p style={{ color: '#78350f', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>
              Maktab veb-sayti talabaning rasmiy shaxsiy hujjati yoki attestati sifatida qabul qilinishi mumkin emas.
            </p>
          </section>

          {/* 6. Administrative Attestation Footer */}
          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem', fontSize: '0.85rem', color: 'var(--color-muted)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <strong>Oxirgi ma’muriy tasdiq sanasi:</strong> {lastVerifiedDate}
            </div>
            <div>
              <strong>Tasdiqlovchi mas’ul idora:</strong> {approvedBy}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
