import React from 'react'
import type { Metadata } from 'next'
import { getPayloadClient } from '@/lib/payload'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { RichTextRenderer } from '@/components/RichTextRenderer'
import { Shield, Lock, EyeOff, FileText, CheckCircle2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Maxfiylik siyosati — 142-maktab',
  description: '142-sonli umumiy o‘rta ta’lim maktabi rasmiy veb-saytining shaxsga doir ma’lumotlar xavfsizligi va maxfiylik siyosati.',
}

export default async function PrivacyPolicyPage() {
  const payload = await getPayloadClient()

  const pageRes = await payload.find({
    collection: 'pages',
    where: {
      slug: { equals: 'maxfiylik' },
      status: { equals: 'nashr_qilingan' },
    },
    limit: 1,
  }).catch(() => ({ docs: [] }))

  const cmsPage = pageRes.docs[0]

  return (
    <div className="section">
      <div className="container" style={{ maxWidth: '880px' }}>
        <Breadcrumbs items={[{ label: 'Maxfiylik siyosati' }]} />

        <div style={{ marginBottom: '2.5rem' }}>
          <span className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>
            Axborot xavfsizligi
          </span>
          <h1 style={{ fontSize: '2.4rem', lineHeight: 1.2, color: 'var(--color-navy)', marginBottom: '1rem' }}>
            Maxfiylik va shaxsga doir ma’lumotlarni himoya qilish siyosati
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--color-muted)', lineHeight: 1.6 }}>
            O‘zbekiston Respublikasining “Shaxsga doir ma’lumotlar to‘g‘risida”gi Qonuniga muvofiq, 142-sonli umumiy o‘rta ta’lim maktabi o‘quvchilar, ota-onalar va xodimlarning daxlsizligini to‘liq ta’minlaydi.
          </p>
        </div>

        {cmsPage?.content && (
          <div className="card" style={{ padding: '2.5rem', marginBottom: '3rem' }}>
            <RichTextRenderer content={cmsPage.content} />
          </div>
        )}

        {/* Core Guarantees */}
        <div className="grid grid-cols-1 grid-cols-3-sm" style={{ gap: '1.5rem', marginBottom: '3rem' }}>
          <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <EyeOff size={32} style={{ color: 'var(--color-primary)', margin: '0 auto 0.75rem' }} />
            <h3 style={{ fontSize: '1.1rem', margin: '0 0 0.35rem', color: 'var(--color-navy)' }}>Kuzatuv yo‘q</h3>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-muted)' }}>Hech qanday tijorat reklama yoki tashqi trekerlar ishlatilmaydi.</p>
          </div>
          <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <Lock size={32} style={{ color: '#059669', margin: '0 auto 0.75rem' }} />
            <h3 style={{ fontSize: '1.1rem', margin: '0 0 0.35rem', color: 'var(--color-navy)' }}>Ma’lumotlar sotilmaydi</h3>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-muted)' }}>Sayt foydalanuvchilari ma’lumotlari uchinchi shaxslarga berilmaydi.</p>
          </div>
          <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <Shield size={32} style={{ color: '#d97706', margin: '0 auto 0.75rem' }} />
            <h3 style={{ fontSize: '1.1rem', margin: '0 0 0.35rem', color: 'var(--color-navy)' }}>Bolalar huquqi</h3>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-muted)' }}>Fotosuratlar faqat qonuniy vakillar roziligi bilan e’lon qilinadi.</p>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="card" style={{ padding: '2.5rem', lineHeight: 1.8, color: '#334155' }}>
          <h2 style={{ fontSize: '1.4rem', color: 'var(--color-navy)', marginBottom: '0.75rem' }}>
            1. Umumiy qoidalar
          </h2>
          <p style={{ marginBottom: '1.5rem' }}>
            Ushbu Maxfiylik siyosati Toshkent shahar Mirzo Ulug‘bek tumani 142-sonli umumiy o‘rta ta’lim maktabining rasmiy veb-saytidan foydalanuvchilarning shaxsga doir ma’lumotlarini yig‘ish, saqlash va himoya qilish tartibini belgilaydi. Biz maktabimiz axborot resurslarining shaffof, xavfsiz va qonun talablariga to‘liq muvofiq bo‘lishini kafolatlaymiz.
          </p>

          <h2 style={{ fontSize: '1.4rem', color: 'var(--color-navy)', marginBottom: '0.75rem' }}>
            2. Qanday ma’lumotlar yig‘iladi?
          </h2>
          <p style={{ marginBottom: '1rem' }}>
            Saytimiz tashrif buyuruvchilardan ro‘yxatdan o‘tishni yoki shaxsiy ma’lumotlarni kiritishni talab qilmaydi. Quyidagi faqat texnik xarakterdagi ma’lumotlar xavfsizlik va barqarorlikni ta’minlash maqsadida server xotirasida avtomatik qayd etilishi mumkin:
          </p>
          <ul style={{ paddingLeft: '1.25rem', marginBottom: '1.5rem' }}>
            <li>Tashrif buyuruvchining IP-manzili va so‘rov vaqti (kiberhujumlardan himoyalanish uchun);</li>
            <li>Foydalanilayotgan brauzer turi va operatsion tizim;</li>
            <li>Ko‘rilgan sahifalar manzillari (sayt ishlash tezligini optimallashtirish uchun).</li>
          </ul>

          <h2 style={{ fontSize: '1.4rem', color: 'var(--color-navy)', marginBottom: '0.75rem' }}>
            3. O‘quvchilar va fotosuratlardan foydalanish
          </h2>
          <p style={{ marginBottom: '1.5rem' }}>
            Maktab hayotiga doir fotolavhalar, fan olimpiadalari g‘oliblari va jamoat tadbirlari fotosuratlari saytga faqatgina o‘quvchilarning erishgan yutuqlarini yoritish hamda ota-onalar (qonuniy vakillar) bilan maktab ta’lim jarayonida kelishilgan me’yorlar asosida joylashtiriladi. Shaxsiy fotosuratni saytdan olib tashlash bo‘yicha har qanday qonuniy vakil murojaati so‘zsiz va zudlik bilan qanoatlantiriladi.
          </p>

          <h2 style={{ fontSize: '1.4rem', color: 'var(--color-navy)', marginBottom: '0.75rem' }}>
            4. Cookie-fayllar
          </h2>
          <p style={{ marginBottom: '1.5rem' }}>
            Sayt faqatgina uning to‘g‘ri ishlashi, shrift o‘lchamini eslab qolish va xavfsizlik sessiyalarini boshqarish uchun zarur bo‘lgan minimal texnik cookie-fayllardan foydalanadi. Tijoriy maqsadli marketing yoki reklama cookie-fayllari umuman qo‘llanilmaydi.
          </p>

          <h2 style={{ fontSize: '1.4rem', color: 'var(--color-navy)', marginBottom: '0.75rem' }}>
            5. Aloqa va murojaat
          </h2>
          <p style={{ margin: 0 }}>
            Ushbu siyosat yoki shaxsga doir ma’lumotlar bilan bog‘liq har qanday savol yoki takliflar bo‘yicha maktab ma’muriyatiga <strong>info@maktab142.uz</strong> elektron pochtasi yoki <strong>+998 71 268 01 42</strong> telefon raqami orqali murojaat qilishingiz mumkin.
          </p>
        </div>
      </div>
    </div>
  )
}
