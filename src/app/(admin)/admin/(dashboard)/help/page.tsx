import React from 'react'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/session'
import { getPayloadClient } from '@/lib/payload'
import { RichTextRenderer } from '@/components/RichTextRenderer'

export default async function AdminHelpPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/admin/login')

  const payload = await getPayloadClient()
  const helpData = await payload.findGlobal({ slug: 'help-guide' }).catch(() => null)

  const mediaRules =
    helpData?.mediaRules ||
    '1. Yangilik muqovasi: 16:10 nisbatda (masalan: 1200x750px), maksimal 5 MB.\n' +
    '2. O‘qituvchi portreti: 4:5 nisbatda (masalan: 800x1000px), rasmiy kiyimda, tiniq fon.\n' +
    '3. Maktab jurnali: 3:4 muqova rasmi va haqiqiy PDF fayl (maksimal 25 MB).\n' +
    '4. Har bir rasm uchun alt-matn (tavsif) yozish majburiydir (WCAG 2.2 talabi).\n' +
    '5. Maxfiy yoki shaxsiy o‘quvchi ma’lumotlarini ochiq media kutubxonasiga yuklash qat’iyan taqiqlanadi.'

  const supportContact =
    helpData?.supportContact ||
    'Texnik ma’mur: admin@maktab142.uz | Bosh muharrir: +998 71 200 01 42 (ichki 102)'

  return (
    <div>
      <div className="admin-page-header">
        <div className="admin-page-title-group">
          <h1>Yordam va Yo‘riqnoma</h1>
          <p>Mualliflar, o‘qituvchilar va muharrirlar uchun elektron qo‘llanma va nashr standartlari.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-6)' }}>
        {/* O'qituvchilar uchun */}
        <div className="admin-card" style={{ padding: 'var(--space-6)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-3)' }}>
            <span style={{ fontSize: '1.75rem' }}>✍️</span>
            <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, margin: 0 }}>
              {helpData?.teacherGuideTitle || 'O‘qituvchilar uchun yo‘riqnoma'}
            </h2>
          </div>
          {helpData?.teacherGuideContent ? (
            <RichTextRenderer content={helpData.teacherGuideContent} />
          ) : (
            <div style={{ fontSize: 'var(--text-sm)', lineHeight: 1.6, color: 'var(--color-text)' }}>
              <p>
                <strong>1. Maqola tayyorlash:</strong> Yangi maqola yoki yangilik yozish uchun &quot;Yangilik yozish&quot; tugmasini bosing. Sarlavha, anons va asosiy matnni kiriting.
              </p>
              <p>
                <strong>2. Holatni boshqarish:</strong> Maqolani tahrir qilib bo‘lgach, &quot;Tahririyatga yuborish&quot; tugmasini bosing. Shunda maqola &quot;Ko‘rib chiqilmoqda&quot; holatiga o‘tadi va bosh muharrirga tekshirish uchun ko‘rinadi.
              </p>
              <p>
                <strong>3. O‘zgartirish talab etilsa:</strong> Agar maqolada tuzatish zarur bo‘lsa, muharrir izoh qoldirib maqolani qaytaradi. Siz uni to‘g‘rilab, yana qayta yuborishingiz mumkin.
              </p>
              <p>
                <strong>4. Shaxsiy profil:</strong> &quot;Mening profilim&quot; bo‘limida o‘zingizning rasmingiz, malakangiz, o‘quvchilaringiz erishgan yutuqlarni muntazam yangilab boring.
              </p>
            </div>
          )}
        </div>

        {/* Muharrirlar uchun */}
        <div className="admin-card" style={{ padding: 'var(--space-6)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-3)' }}>
            <span style={{ fontSize: '1.75rem' }}>🔍</span>
            <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, margin: 0 }}>
              {helpData?.editorGuideTitle || 'Muharrirlar uchun nashr siyosati'}
            </h2>
          </div>
          {helpData?.editorGuideContent ? (
            <RichTextRenderer content={helpData.editorGuideContent} />
          ) : (
            <div style={{ fontSize: 'var(--text-sm)', lineHeight: 1.6, color: 'var(--color-text)' }}>
              <p>
                <strong>1. Moderatsiya va tekshirish:</strong> Boshqaruv panelida &quot;Ko‘rib chiqilayotgan maqolalar&quot; bloki yangi kelib tushgan qoralamalarni ko‘rsatadi. Imlo, uslub va mazmunni tekshiring.
              </p>
              <p>
                <strong>2. Nashr qilish:</strong> Barcha talablarga javob beradigan materialni &quot;Nashr qilingan&quot; holatiga o‘tkazing. U darhol maktab rasmiy veb-saytida va RSS tasmada aks etadi.
              </p>
              <p>
                <strong>3. Izohlar (Editorial Notes):</strong> Muallifga yo‘llanadigan tahrir ko‘rsatmalarini ichki izohlar maydoniga yozing. Ushbu maydon tashrif buyuruvchilarga ko‘rinmaydi.
              </p>
              <p>
                <strong>4. Rasmiy e’lonlar:</strong> E’lonlarning boshlanish va tugash sanasini to‘g‘ri belgilang. Tugash vaqti o‘tgan e’lonlar sayt peshtaxtasidan avtomatik olinadi.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Texnik va Fotosuratlar standarti */}
      <div className="admin-card" style={{ padding: 'var(--space-6)', marginTop: 'var(--space-6)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-4)' }}>
          <span style={{ fontSize: '1.75rem' }}>📐</span>
          <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, margin: 0 }}>
            Texnik standartlar va Fotosuratlar talabi
          </h2>
        </div>

        <div
          style={{
            background: 'var(--color-surface-hover)',
            padding: '1.25rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            whiteSpace: 'pre-line',
            fontFamily: 'monospace',
            fontSize: 'var(--text-sm)',
            lineHeight: 1.8,
            marginBottom: 'var(--space-4)',
          }}
        >
          {mediaRules}
        </div>

        <div
          style={{
            padding: '1rem',
            background: 'rgba(26, 54, 93, 0.05)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            fontSize: 'var(--text-sm)',
          }}
        >
          <strong>Aloqa va texnik ko‘mak:</strong> {supportContact}
        </div>
      </div>
    </div>
  )
}
