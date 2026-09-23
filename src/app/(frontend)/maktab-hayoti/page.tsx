import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getPayloadClient } from '@/lib/payload'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { RichTextRenderer } from '@/components/RichTextRenderer'
import { Sparkles, Trophy, Music, Laptop, BookOpen, Activity, Images, BookMarked } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Maktab hayoti va to‘garaklar — 142-maktab',
  description: '142-maktabdagi to‘garaklar, sport seksiyalari, madaniy tadbirlar va Besh muhim tashabbus doirasidagi faoliyat.',
}

export default async function SchoolLifePage() {
  const payload = await getPayloadClient()

  const pageRes = await payload.find({
    collection: 'pages',
    where: {
      slug: { equals: 'maktab-hayoti' },
      status: { equals: 'nashr_qilingan' },
    },
    limit: 1,
  }).catch(() => ({ docs: [] }))

  const cmsPage = pageRes.docs[0]

  return (
    <div className="section">
      <div className="container">
        <Breadcrumbs items={[{ label: 'Maktab hayoti' }]} />

        <div style={{ maxWidth: '840px', marginBottom: '3rem' }}>
          <span className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>
            Faoliyat va to‘garaklar
          </span>
          <h1 style={{ fontSize: '2.5rem', lineHeight: 1.2, color: 'var(--color-navy)', marginBottom: '1rem' }}>
            Maktab hayoti va darsdan tashqari faoliyat
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--color-muted)', lineHeight: 1.6 }}>
            142-maktab nafaqat kuchli akademik bilim maskani, balki har bir o‘quvchining ijodiy, intellektual va jismoniy qobiliyatlarini kashf etuvchi boy ijtimoiy muhitdir.
          </p>
        </div>

        {cmsPage?.content && (
          <div className="card" style={{ padding: '2.5rem', marginBottom: '3rem' }}>
            <RichTextRenderer content={cmsPage.content} />
          </div>
        )}

        {/* 5 Key Initiatives (Besh muhim tashabbus) */}
        <div style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--color-navy)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Sparkles size={24} style={{ color: 'var(--color-primary)' }} />
            Besh muhim tashabbus doirasidagi yo‘nalishlar
          </h2>

          <div className="grid grid-cols-1 grid-cols-2-sm grid-cols-3-lg" style={{ gap: '1.5rem' }}>
            <div className="card" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
                  <Music size={20} />
                </div>
                <h3 style={{ fontSize: '1.15rem', margin: 0, color: 'var(--color-navy)' }}>1. San’at va madaniyat</h3>
              </div>
              <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                Musiqa asboblari (doira, dutor, fortepiano), xor va tasviriy san’at to‘garaklari orqali o‘quvchilarning estetik didi rivojlantiriladi.
              </p>
            </div>

            <div className="card" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
                  <Activity size={20} />
                </div>
                <h3 style={{ fontSize: '1.15rem', margin: 0, color: 'var(--color-navy)' }}>2. Sport va salomatlik</h3>
              </div>
              <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                Futbol, shaxmat-shashka, voleybol va stol tennisi seksiyalari doimiy faoliyat yuritadi. Tuman va shahar musobaqalarida faxrli o‘rinlar egallanadi.
              </p>
            </div>

            <div className="card" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706' }}>
                  <Laptop size={20} />
                </div>
                <h3 style={{ fontSize: '1.15rem', margin: 0, color: 'var(--color-navy)' }}>3. IT va raqamli savod</h3>
              </div>
              <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                Robototexnika, Python dasturlash tili va kompyuter grafikasi to‘garaklari yoshlarning zamonaviy kasblarga qiziqishini oshiradi.
              </p>
            </div>

            <div className="card" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#f3e8ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7c3aed' }}>
                  <BookOpen size={20} />
                </div>
                <h3 style={{ fontSize: '1.15rem', margin: 0, color: 'var(--color-navy)' }}>4. Kitobxonlik</h3>
              </div>
              <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                “Yosh kitobxon” tanlovlari, adiblar bilan ijodiy uchrashuvlar va yangi nashrlar taqdimotlari haftalik o‘tkaziladi.
              </p>
            </div>

            <div className="card" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#ffe4e6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e11d48' }}>
                  <Trophy size={20} />
                </div>
                <h3 style={{ fontSize: '1.15rem', margin: 0, color: 'var(--color-navy)' }}>5. Kasbga yo‘naltirish</h3>
              </div>
              <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                Hunarmandchilik, pazandachilik, dizayn va mustaqil hayot ko‘nikmalarini shakllantiruvchi amaliy mashg‘ulotlar.
              </p>
            </div>
          </div>
        </div>

        {/* Clubs Table */}
        <div style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--color-navy)', marginBottom: '1.5rem' }}>
            Maktab to‘garaklari jadvali
          </h2>
          <div className="card" style={{ overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.95rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid var(--color-border)' }}>
                    <th style={{ padding: '1rem 1.25rem', color: 'var(--color-navy)' }}>To‘garak nomi</th>
                    <th style={{ padding: '1rem 1.25rem', color: 'var(--color-navy)' }}>Sinflar</th>
                    <th style={{ padding: '1rem 1.25rem', color: 'var(--color-navy)' }}>Mashg‘ulot kunlari</th>
                    <th style={{ padding: '1rem 1.25rem', color: 'var(--color-navy)' }}>Vaqti</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '1rem 1.25rem', fontWeight: 600 }}>Yosh matematiklar</td>
                    <td style={{ padding: '1rem 1.25rem' }}>5–8 sinflar</td>
                    <td style={{ padding: '1rem 1.25rem' }}>Seshanba, Payshanba</td>
                    <td style={{ padding: '1rem 1.25rem' }}>14:00 – 15:30</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '1rem 1.25rem', fontWeight: 600 }}>Robototexnika va IT</td>
                    <td style={{ padding: '1rem 1.25rem' }}>6–10 sinflar</td>
                    <td style={{ padding: '1rem 1.25rem' }}>Dushanba, Chorshanba</td>
                    <td style={{ padding: '1rem 1.25rem' }}>14:30 – 16:00</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '1rem 1.25rem', fontWeight: 600 }}>English Speaking Club</td>
                    <td style={{ padding: '1rem 1.25rem' }}>7–11 sinflar</td>
                    <td style={{ padding: '1rem 1.25rem' }}>Juma, Shanba</td>
                    <td style={{ padding: '1rem 1.25rem' }}>13:30 – 15:00</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '1rem 1.25rem', fontWeight: 600 }}>Shaxmat va mantiq</td>
                    <td style={{ padding: '1rem 1.25rem' }}>1–6 sinflar</td>
                    <td style={{ padding: '1rem 1.25rem' }}>Seshanba, Shanba</td>
                    <td style={{ padding: '1rem 1.25rem' }}>14:00 – 15:00</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '1rem 1.25rem', fontWeight: 600 }}>Futbol seksiyasi</td>
                    <td style={{ padding: '1rem 1.25rem' }}>5–11 sinflar</td>
                    <td style={{ padding: '1rem 1.25rem' }}>Dushanba, Chorshanba, Juma</td>
                    <td style={{ padding: '1rem 1.25rem' }}>15:30 – 17:00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Fast Access to Gallery & Magazines */}
        <div className="grid grid-cols-1 grid-cols-2-sm" style={{ gap: '2rem' }}>
          <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <Images size={24} style={{ color: 'var(--color-primary)' }} />
              <h3 style={{ fontSize: '1.25rem', margin: 0, color: 'var(--color-navy)' }}>
                Maktab fotogalereyasi
              </h3>
            </div>
            <p style={{ color: 'var(--color-muted)', fontSize: '0.95rem', lineHeight: 1.6, flex: 1, marginBottom: '1.5rem' }}>
              Tadbirlar, bayramlar, sport musobaqalari va ochiq darslardan olingan eng sara lahzalar to‘plami.
            </p>
            <Link href="/galereya" className="btn btn-outline" style={{ alignSelf: 'flex-start' }}>
              Fotogalereyani ko‘rish
            </Link>
          </div>

          <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <BookMarked size={24} style={{ color: 'var(--color-primary)' }} />
              <h3 style={{ fontSize: '1.25rem', margin: 0, color: 'var(--color-navy)' }}>
                Maktab jurnali nashrlari
              </h3>
            </div>
            <p style={{ color: 'var(--color-muted)', fontSize: '0.95rem', lineHeight: 1.6, flex: 1, marginBottom: '1.5rem' }}>
              O‘qituvchi va o‘quvchilarning ilmiy-ijodiy maqolalari chop etiladigan rasmiy maktab jurnallarini PDF shaklda yuklab oling.
            </p>
            <Link href="/jurnallar" className="btn btn-outline" style={{ alignSelf: 'flex-start' }}>
              Jurnallarni ko‘rish
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
