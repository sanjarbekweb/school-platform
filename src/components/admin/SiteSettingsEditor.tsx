'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateSiteSettingsAction } from '@/lib/actions/admin'

interface SiteSettingsEditorProps {
  initialSettings: any
}

export function SiteSettingsEditor({ initialSettings }: SiteSettingsEditorProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'legal' | 'contact' | 'leadership'>('legal')

  // Legal
  const [schoolName, setSchoolName] = useState(initialSettings?.schoolName || '142-sonli umumiy o‘rta ta’lim maktabi')
  const [shortName, setShortName] = useState(initialSettings?.shortName || '142-maktab')
  const [schoolNumber, setSchoolNumber] = useState(initialSettings?.schoolNumber || '142')
  const [legalName, setLegalName] = useState(
    initialSettings?.legalName || 'Toshkent shahar Mirzo Ulug‘bek tumani 142-sonli umumiy o‘rta ta’lim maktabi'
  )
  const [institutionId, setInstitutionId] = useState(initialSettings?.institutionId || '142')
  const [supervisingAuthority, setSupervisingAuthority] = useState(
    initialSettings?.supervisingAuthority || 'O‘zbekiston Respublikasi Maktabgacha va maktab ta’limi vazirligi'
  )

  // Contact
  const [address, setAddress] = useState(initialSettings?.address || 'Toshkent shahri, Mirzo Ulug‘bek tumani')
  const [phone, setPhone] = useState(initialSettings?.phone || '+998 71 200 01 42')
  const [phoneVerified, setPhoneVerified] = useState(Boolean(initialSettings?.phoneVerified))
  const [email, setEmail] = useState(initialSettings?.email || 'info@maktab142.uz')
  const [emailVerified, setEmailVerified] = useState(Boolean(initialSettings?.emailVerified))
  const [telegram, setTelegram] = useState(initialSettings?.telegram || 'https://t.me/maktab142_uz')
  const [receptionHours, setReceptionHours] = useState(
    initialSettings?.receptionHours || 'Dushanba – Juma: 09:00 – 17:00'
  )

  // Leadership & College Counselor
  const [directorName, setDirectorName] = useState(initialSettings?.directorName || 'Maktab rahbariyati')
  const [counselorName, setCounselorName] = useState(initialSettings?.counselorName || 'Akademik maslahatchi')
  const [counselorEmail, setCounselorEmail] = useState(initialSettings?.counselorEmail || 'admissions@maktab142.uz')
  const [lastVerifiedDate, setLastVerifiedDate] = useState(initialSettings?.lastVerifiedDate || '2026-yil sentyabr')
  const [approvedBy, setApprovedBy] = useState(initialSettings?.approvedBy || '142-maktab ma’muriyati')

  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError(null)
    setSuccessMsg(null)

    const payloadData = {
      schoolName,
      shortName,
      schoolNumber,
      legalName,
      institutionId,
      supervisingAuthority,
      address,
      phone,
      phoneVerified,
      email,
      emailVerified,
      telegram,
      receptionHours,
      directorName,
      counselorName,
      counselorEmail,
      lastVerifiedDate,
      approvedBy,
    }

    const res = await updateSiteSettingsAction(payloadData)

    if (!res.success) {
      setError(
        res.error ||
          (res.validationErrors && res.validationErrors.map((err) => err.message).join(' ')) ||
          'Xatolik yuz berdi'
      )
      setIsSaving(false)
      return
    }

    setSuccessMsg('Maktab sozlamalari muvaffaqiyatli saqlandi!')
    setIsSaving(false)
    router.refresh()
  }

  return (
    <div>
      <div className="admin-page-header">
        <div className="admin-page-title-group">
          <h1>Maktabning rasmiy sozlamalari</h1>
          <p>Yuridik rekvizitlar, kontaktlar, qabulxona va attestatsiya ma’lumotlari (SiteSettings Global).</p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={isSaving}
        >
          {isSaving ? 'Saqlanmoqda...' : '💾 Sozlamalarni saqlash'}
        </button>
      </div>

      {error && (
        <div
          role="alert"
          style={{
            padding: '1rem',
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid #ef4444',
            borderRadius: 'var(--radius-md)',
            color: '#b91c1c',
            marginBottom: 'var(--space-4)',
          }}
        >
          {error}
        </div>
      )}

      {successMsg && (
        <div
          role="status"
          style={{
            padding: '1rem',
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid #10b981',
            borderRadius: 'var(--radius-md)',
            color: '#047857',
            marginBottom: 'var(--space-4)',
          }}
        >
          {successMsg}
        </div>
      )}

      {/* Tabs */}
      <div className="admin-tabs">
        <button
          type="button"
          className={`admin-tab ${activeTab === 'legal' ? 'active' : ''}`}
          onClick={() => setActiveTab('legal')}
        >
          🏛️ Asosiy va Yuridik
        </button>
        <button
          type="button"
          className={`admin-tab ${activeTab === 'contact' ? 'active' : ''}`}
          onClick={() => setActiveTab('contact')}
        >
          📞 Aloqa va Qabulxona
        </button>
        <button
          type="button"
          className={`admin-tab ${activeTab === 'leadership' ? 'active' : ''}`}
          onClick={() => setActiveTab('leadership')}
        >
          🎓 Rahbariyat va Maslahatchi
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Tab 1: Legal */}
        {activeTab === 'legal' && (
          <div className="admin-form-card">
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label" htmlFor="setting-school-name">
                  Maktabning to‘liq nomi *
                </label>
                <input
                  id="setting-school-name"
                  type="text"
                  className="admin-input"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label" htmlFor="setting-short-name">
                  Qisqa nomi *
                </label>
                <input
                  id="setting-short-name"
                  type="text"
                  className="admin-input"
                  value={shortName}
                  onChange={(e) => setShortName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label" htmlFor="setting-school-number">
                  Maktab raqami *
                </label>
                <input
                  id="setting-school-number"
                  type="text"
                  className="admin-input"
                  value={schoolNumber}
                  onChange={(e) => setSchoolNumber(e.target.value)}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label" htmlFor="setting-institution-id">
                  Muassasa identifikatori (STIR / Litsenziya)
                </label>
                <input
                  id="setting-institution-id"
                  type="text"
                  className="admin-input"
                  value={institutionId}
                  onChange={(e) => setInstitutionId(e.target.value)}
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="setting-legal-name">
                To‘liq yuridik nomi (Nizom bo‘yicha)
              </label>
              <input
                id="setting-legal-name"
                type="text"
                className="admin-input"
                value={legalName}
                onChange={(e) => setLegalName(e.target.value)}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="setting-supervising">
                Yuqori turuvchi idora
              </label>
              <input
                id="setting-supervising"
                type="text"
                className="admin-input"
                value={supervisingAuthority}
                onChange={(e) => setSupervisingAuthority(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Tab 2: Contact */}
        {activeTab === 'contact' && (
          <div className="admin-form-card">
            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="setting-address">
                Pochta manzili *
              </label>
              <input
                id="setting-address"
                type="text"
                className="admin-input"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label" htmlFor="setting-phone">
                  Rasmiy qabulxona telefoni *
                </label>
                <input
                  id="setting-phone"
                  type="text"
                  className="admin-input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px', fontSize: 'var(--text-xs)' }}>
                  <input
                    type="checkbox"
                    checked={phoneVerified}
                    onChange={(e) => setPhoneVerified(e.target.checked)}
                  />
                  Telefon raqami rasman tekshirilgan va tasdiqlangan
                </label>
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label" htmlFor="setting-email">
                  Rasmiy institutsional elektron pochta *
                </label>
                <input
                  id="setting-email"
                  type="email"
                  className="admin-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px', fontSize: 'var(--text-xs)' }}>
                  <input
                    type="checkbox"
                    checked={emailVerified}
                    onChange={(e) => setEmailVerified(e.target.checked)}
                  />
                  Elektron pochta rasman tekshirilgan va tasdiqlangan
                </label>
              </div>
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label" htmlFor="setting-telegram">
                  Rasmiy Telegram kanali manzili
                </label>
                <input
                  id="setting-telegram"
                  type="text"
                  className="admin-input"
                  value={telegram}
                  onChange={(e) => setTelegram(e.target.value)}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label" htmlFor="setting-hours">
                  Fuqarolarni qabul qilish soatlari
                </label>
                <input
                  id="setting-hours"
                  type="text"
                  className="admin-input"
                  value={receptionHours}
                  onChange={(e) => setReceptionHours(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Leadership & Admissions Counselor */}
        {activeTab === 'leadership' && (
          <div className="admin-form-card">
            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="setting-director">
                Maktab direktori F.I.O.
              </label>
              <input
                id="setting-director"
                type="text"
                className="admin-input"
                value={directorName}
                onChange={(e) => setDirectorName(e.target.value)}
              />
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label" htmlFor="setting-counselor">
                  Oliy ta’lim va kasbga yo‘naltirish maslahatchisi
                </label>
                <input
                  id="setting-counselor"
                  type="text"
                  className="admin-input"
                  value={counselorName}
                  onChange={(e) => setCounselorName(e.target.value)}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label" htmlFor="setting-counselor-email">
                  Maslahatchi xizmat pochtasi (Common App / Parchment)
                </label>
                <input
                  id="setting-counselor-email"
                  type="email"
                  className="admin-input"
                  value={counselorEmail}
                  onChange={(e) => setCounselorEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label" htmlFor="setting-verified-date">
                  Oxirgi ma’muriy tasdiqlangan sana
                </label>
                <input
                  id="setting-verified-date"
                  type="text"
                  className="admin-input"
                  value={lastVerifiedDate}
                  onChange={(e) => setLastVerifiedDate(e.target.value)}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label" htmlFor="setting-approved-by">
                  Tasdiqlagan mas’ul organ / xodim
                </label>
                <input
                  id="setting-approved-by"
                  type="text"
                  className="admin-input"
                  value={approvedBy}
                  onChange={(e) => setApprovedBy(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}
