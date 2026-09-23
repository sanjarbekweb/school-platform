import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getPayloadClient } from '@/lib/payload'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { RichTextRenderer } from '@/components/RichTextRenderer'
import { Users, FileCheck, Clock, HelpCircle, Shield, Phone, ExternalLink } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Ota-onalar uchun ma’lumotnoma va qabul tartibi — 142-maktab',
  description: '1-sinfga qabul qilish tartibi, kerakli hujjatlar, rahbariyatning qabul soatlari va ota-onalar uchun eslatmalar.',
}

export default async function ParentsPage() {
  const payload = await getPayloadClient()

  const pageRes = await payload.find({
    collection: 'pages',
    where: {
      slug: { equals: 'ota-onalar' },
      status: { equals: 'nashr_qilingan' },
    },
    limit: 1,
  }).catch(() => ({ docs: [] }))

  const cmsPage = pageRes.docs[0]

  return (
    <div className="section">
      <div className="container">
        <Breadcrumbs items={[{ label: 'Ota-onalar uchun' }]} />

        <div style={{ maxWidth: '840px', marginBottom: '3rem' }}>
          <span className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>
            Qabul va hamkorlik
          </span>
          <h1 style={{ fontSize: '2.5rem', lineHeight: 1.2, color: 'var(--color-navy)', marginBottom: '1rem' }}>
            Ota-onalar uchun qo‘llanma va qabul tartibi
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--color-muted)', lineHeight: 1.6 }}>
            Farzandingizning sifatli ta’lim olishi, maktab hayotiga tez moslashishi va xavfsizligi bo‘yicha barcha rasmiy tartiblar, qabul jadvali va mezonlar.
          </p>
        </div>

        {cmsPage?.content && (
          <div className="card" style={{ padding: '2.5rem', marginBottom: '3rem' }}>
            <RichTextRenderer content={cmsPage.content} />
          </div>
        )}

        {/* 1st Grade Admission Process */}
        <div style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--color-navy)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <FileCheck size={24} style={{ color: 'var(--color-primary)' }} />
            1-sinfga qabul qilish tartibi (2026/2027 o‘quv yili)
          </h2>

          <div className="grid grid-cols-1 grid-cols-2-sm" style={{ gap: '2rem' }}>
            <div className="card" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--color-navy)', marginBottom: '1rem' }}>
                Onlayn ariza topshirish
              </h3>
              <p style={{ color: '#475569', lineHeight: 1.6, fontSize: '0.95rem', marginBottom: '1.25rem' }}>
                O‘zbekiston Respublikasi Maktabgacha va maktab ta’limi vazirligi elektron tizimi (<strong>my.maktab.uz</strong>) orqali amalga oshiriladi:
              </p>
              <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#334155', lineHeight: 1.7, fontSize: '0.9rem' }}>
                <li><strong>Asosiy bosqich (Mikrohudud):</strong> 20-iyundan 31-iyulgacha</li>
                <li><strong>Qo‘shimcha bosqich (Mikrohududdan tashqari):</strong> 1-avgustdan 15-avgustgacha (bo‘sh o‘rinlar mavjud bo‘lganda)</li>
              </ul>
              <div style={{ marginTop: '1.5rem' }}>
                <a
                  href="https://my.maktab.uz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem' }}
                >
                  my.maktab.uz portaliga o‘tish <ExternalLink size={14} />
                </a>
              </div>
            </div>

            <div className="card" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--color-navy)', marginBottom: '1rem' }}>
                Talab etiladigan hujjatlar
              </h3>
              <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#334155', lineHeight: 1.8, fontSize: '0.95rem' }}>
                <li>Ota-onaning (yoki ularning o‘rnini bosuvchi shaxslarning) arizasi</li>
                <li>Bolaning tug‘ilganlik haqida guvohnomasi nusxasi</li>
                <li>Ota-onaning shaxsini tasdiqlovchi hujjat (pasport/ID-karta) nusxasi</li>
                <li>Bolaning 086-U shakldagi tibbiy ma’lumotnomasi va emlash kartasi (063-U)</li>
                <li>Bolaning 3x4 sm o‘lchamdagi 4 dona rangli fotosurati</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Reception Hours of Administration */}
        <div style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--color-navy)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Clock size={24} style={{ color: 'var(--color-primary)' }} />
            Maktab rahbariyatining fuqarolar va ota-onalarni qabul qilish jadvali
          </h2>

          <div className="card" style={{ overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.95rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid var(--color-border)' }}>
                    <th style={{ padding: '1rem 1.25rem', color: 'var(--color-navy)' }}>Lavozimi</th>
                    <th style={{ padding: '1rem 1.25rem', color: 'var(--color-navy)' }}>F.I.O.</th>
                    <th style={{ padding: '1rem 1.25rem', color: 'var(--color-navy)' }}>Qabul kunlari</th>
                    <th style={{ padding: '1rem 1.25rem', color: 'var(--color-navy)' }}>Qabul vaqti</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '1rem 1.25rem', fontWeight: 600 }}>Maktab direktori</td>
                    <td style={{ padding: '1rem 1.25rem' }}>Rustamov Alisher Vohidovich</td>
                    <td style={{ padding: '1rem 1.25rem' }}>Dushanba, Payshanba</td>
                    <td style={{ padding: '1rem 1.25rem', color: 'var(--color-primary)', fontWeight: 600 }}>09:00 – 12:00</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '1rem 1.25rem', fontWeight: 600 }}>Direktor o‘rinbosari (O‘quv)</td>
                    <td style={{ padding: '1rem 1.25rem' }}>Karimova Dilnoza Tohirovna</td>
                    <td style={{ padding: '1rem 1.25rem' }}>Seshanba, Juma</td>
                    <td style={{ padding: '1rem 1.25rem', color: 'var(--color-primary)', fontWeight: 600 }}>14:00 – 17:00</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '1rem 1.25rem', fontWeight: 600 }}>Direktor o‘rinbosari (Ma’naviyat)</td>
                    <td style={{ padding: '1rem 1.25rem' }}>Yusupov Otabek Baxtiyorovich</td>
                    <td style={{ padding: '1rem 1.25rem' }}>Chorshanba, Shanba</td>
                    <td style={{ padding: '1rem 1.25rem', color: 'var(--color-primary)', fontWeight: 600 }}>10:00 – 13:00</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '1rem 1.25rem', fontWeight: 600 }}>Maktab psixologi</td>
                    <td style={{ padding: '1rem 1.25rem' }}>Ahmedova Zulfiya Shokirovna</td>
                    <td style={{ padding: '1rem 1.25rem' }}>Har kuni (kelishuv asosida)</td>
                    <td style={{ padding: '1rem 1.25rem', color: 'var(--color-primary)', fontWeight: 600 }}>11:00 – 15:00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* eMaktab Guide & School Uniform Rules */}
        <div className="grid grid-cols-1 grid-cols-2-sm" style={{ gap: '2rem' }}>
          <div className="card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--color-navy)', marginBottom: '0.75rem' }}>
              eMaktab (Kundalik) platformasi
            </h3>
            <p style={{ color: '#475569', lineHeight: 1.6, fontSize: '0.95rem', margin: '0 0 1rem' }}>
              Ota-onalar farzandlarining dars baholari, uyga vazifalari va davomatini real vaqt rejimida kuzatib borishlari uchun elektron jurnal xizmati faoliyat ko‘rsatadi.
            </p>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-muted)', margin: 0 }}>
              Login yoki parolni tiklash zarurati bo‘lganda, sinf rahbari yoki maktab IT koordinatori bilan bog‘laning.
            </p>
          </div>

          <div className="card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--color-navy)', marginBottom: '0.75rem' }}>
              Maktab kiyinish madaniyati (Uniforma)
            </h3>
            <p style={{ color: '#475569', lineHeight: 1.6, fontSize: '0.95rem', margin: '0 0 1rem' }}>
              Maktabimizda O‘zbekiston Respublikasi Vazirlar Mahkamasining qarori bilan belgilangan davlat maktab formasi talablariga qat’iy rioya etiladi.
            </p>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-muted)', margin: 0 }}>
              Toza, ozoda va klassik uslubdagi kiyim madaniyati har bir o‘quvchining jamoaviy tengligi va intizomini ta’minlaydi.
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}
