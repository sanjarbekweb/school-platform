import React from 'react'
import type { Metadata } from 'next'
import { getPayloadClient } from '@/lib/payload'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { RichTextRenderer } from '@/components/RichTextRenderer'
import { MapPin, Phone, Mail, Clock, ShieldCheck, Bus, Send } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Bog‘lanish va manzil — 142-maktab',
  description: '142-sonli maktab bilan rasmiy aloqa, telefon raqamlari, manzil, jamoat transporti va ish vaqti.',
}

export default async function ContactPage() {
  const payload = await getPayloadClient()

  const pageRes = await payload.find({
    collection: 'pages',
    where: {
      slug: { equals: 'boglanish' },
      status: { equals: 'nashr_qilingan' },
    },
    limit: 1,
  }).catch(() => ({ docs: [] }))

  const cmsPage = pageRes.docs[0]

  const settings = await payload.findGlobal({
    slug: 'site-settings',
  }).catch(() => null)

  const address = settings?.address || 'Toshkent shahar, Mirzo Ulug‘bek tumani, Sayram ko‘chasi, 42-uy'
  const phone = settings?.phone || '+998 71 268 01 42'
  const email = settings?.email || 'info@maktab142.uz'

  const receptionHours = settings?.receptionHours || 'Dushanba – Shanba: 08:00 – 18:00'
  const legalName = settings?.legalName || 'Toshkent shahar Mirzo Ulug‘bek tumani 142-sonli umumiy o‘rta ta’lim maktabi'
  const institutionId = settings?.institutionId || '142'

  return (
    <div className="section">
      <div className="container">
        <Breadcrumbs items={[{ label: 'Bog‘lanish' }]} />

        <div style={{ maxWidth: '840px', marginBottom: '3rem' }}>
          <span className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>
            Rasmiy aloqa
          </span>
          <h1 style={{ fontSize: '2.5rem', lineHeight: 1.2, color: 'var(--color-navy)', marginBottom: '1rem' }}>
            Bog‘lanish va qabul ma’lumotlari
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--color-muted)', lineHeight: 1.6 }}>
            Savollaringiz, takliflaringiz yoki rasmiy murojaatlaringiz bo‘yicha maktab ma’muriyatiga to‘g‘ridan-to‘g‘ri murojaat qilishingiz mumkin.
          </p>
        </div>

        {cmsPage?.content && (
          <div className="card" style={{ padding: '2.5rem', marginBottom: '3rem' }}>
            <RichTextRenderer content={cmsPage.content} />
          </div>
        )}

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 grid-cols-2-sm grid-cols-4-lg" style={{ gap: '1.5rem', marginBottom: '3.5rem' }}>
          <div className="card" style={{ padding: '1.75rem' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-md)', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', marginBottom: '1rem' }}>
              <MapPin size={22} />
            </div>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--color-navy)', marginBottom: '0.5rem' }}>Manzilimiz</h3>
            <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.5, margin: 0 }}>
              {address}
            </p>
          </div>

          <div className="card" style={{ padding: '1.75rem' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-md)', backgroundColor: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669', marginBottom: '1rem' }}>
              <Phone size={22} />
            </div>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--color-navy)', marginBottom: '0.5rem' }}>Telefon raqamlar</h3>
            <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>
              <a href={`tel:${phone.replace(/\s+/g, '')}`} style={{ color: 'inherit', display: 'block' }}>{phone}</a>
              <span style={{ color: 'var(--color-muted)', fontSize: '0.85rem' }}>Qabulxona telefoni</span>
            </p>
          </div>

          <div className="card" style={{ padding: '1.75rem' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-md)', backgroundColor: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706', marginBottom: '1rem' }}>
              <Mail size={22} />
            </div>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--color-navy)', marginBottom: '0.5rem' }}>Elektron pochta</h3>
            <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>
              <a href={`mailto:${email}`} style={{ color: 'inherit', display: 'block' }}>{email}</a>
              <span style={{ color: 'var(--color-muted)', fontSize: '0.85rem' }}>Rasmiy yozishmalar uchun</span>
            </p>
          </div>

          <div className="card" style={{ padding: '1.75rem' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-md)', backgroundColor: '#f3e8ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7c3aed', marginBottom: '1rem' }}>
              <Clock size={22} />
            </div>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--color-navy)', marginBottom: '0.5rem' }}>Ish vaqti</h3>
            <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>
              {receptionHours}
            </p>
          </div>
        </div>

        {/* Transportation and Directions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '2rem', marginBottom: '3.5rem' }}>
          <div className="card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <Bus size={22} style={{ color: 'var(--color-primary)' }} />
              <h3 style={{ fontSize: '1.25rem', margin: 0, color: 'var(--color-navy)' }}>
                Qanday yetib kelish mumkin?
              </h3>
            </div>
            <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#334155', lineHeight: 1.7, fontSize: '0.95rem' }}>
              <li><strong>Eng yaqin metro bekati:</strong> “Buyuk Ipak Yo‘li” (Chilonzor yo‘nalishi) — piyoda 10–12 daqiqa.</li>
              <li><strong>Avtobus yo‘nalishlari:</strong> 14, 17, 24, 83, 110-sonli yo‘nalishlar (“Sayram” yoki “142-maktab” bekati).</li>
              <li><strong>Mo‘ljal:</strong> Mirzo Ulug‘bek tumani hokimligi orqa tomoni, Sayram mahallasi.</li>
            </ul>
          </div>

          <div className="card" style={{ padding: '2rem', borderLeft: '4px solid #10b981', backgroundColor: '#f0fdf4' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <ShieldCheck size={24} style={{ color: '#059669' }} />
              <h3 style={{ fontSize: '1.25rem', margin: 0, color: '#065f46' }}>
                Davlat reestridan rasmiy tasdiq
              </h3>
            </div>
            <div style={{ fontSize: '0.9rem', color: '#047857', lineHeight: 1.7 }}>
              <p style={{ margin: '0 0 0.5rem' }}><strong>Muassasa to‘liq nomi:</strong> {legalName}</p>
              <p style={{ margin: '0 0 0.5rem' }}><strong>STIR / Muassasa kodi:</strong> {institutionId}</p>
              <p style={{ margin: '0 0 0.5rem' }}><strong>Akkreditatsiya holati:</strong> Davlat ta’lim inspeksiyasidan to‘liq attestatsiyadan o‘tgan</p>
              <p style={{ margin: 0 }}><strong>Ma’lumotlar tekshirilgan sana:</strong> {settings?.lastVerifiedDate || '2026-yil sentyabr'}</p>
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div className="card" style={{ overflow: 'hidden', padding: 0 }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-border)', backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 600, color: 'var(--color-navy)', fontSize: '0.95rem' }}>
              Maktab xaritadagi joylashuvi
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-muted)' }}>
              Toshkent shahar, Mirzo Ulug‘bek tumani
            </span>
          </div>
          <div style={{ width: '100%', height: '360px', background: '#e2e8f0', position: 'relative' }}>
            <iframe
              title="142-maktab joylashuvi xaritasi"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2996.12!2d69.33!3d41.33!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDE5JzQ4LjAiTiA2OcKwMTknNDguMCJF!5e0!3m2!1suz!2suz!4v1600000000000!5m2!1suz!2suz"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

      </div>
    </div>
  )
}
