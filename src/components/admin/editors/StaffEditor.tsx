'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { MediaPickerModal, MediaItem } from '../MediaPickerModal'
import { saveDocumentAction, deleteDocumentAction, rollbackVersionAction } from '@/lib/actions/admin'
import { formatDate } from '@/lib/utils'
import type { SessionUser } from '@/lib/auth/session'

interface StaffEditorProps {
  initialDoc?: any
  versions?: any[]
  currentUser: SessionUser
}

export function StaffEditor({
  initialDoc,
  versions = [],
  currentUser,
}: StaffEditorProps) {
  const router = useRouter()
  const isNew = !initialDoc?.id

  const [fullName, setFullName] = useState(initialDoc?.fullName || '')
  const [slug, setSlug] = useState(initialDoc?.slug || '')
  const [role, setRole] = useState(initialDoc?.role || 'oqituvchi')
  const [subject, setSubject] = useState(initialDoc?.subject || 'matematika')
  const [qualifications, setQualifications] = useState(initialDoc?.qualifications || '')
  const [achievements, setAchievements] = useState(initialDoc?.achievements || '')
  const [bio, setBio] = useState(initialDoc?.bio || '')
  const [email, setEmail] = useState(initialDoc?.email || '')
  const [phone, setPhone] = useState(initialDoc?.phone || '')
  const [displayOrder, setDisplayOrder] = useState(initialDoc?.displayOrder ?? 10)
  const [status, setStatus] = useState(initialDoc?.status || 'faol')
  const [portrait, setPortrait] = useState<MediaItem | null>(
    initialDoc?.portrait && typeof initialDoc.portrait === 'object' ? initialDoc.portrait : null
  )

  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const isTeacher = currentUser.role === 'teacher'
  const isEditorOrAdmin = currentUser.role === 'admin' || currentUser.role === 'editor'

  const handleNameChange = (val: string) => {
    setFullName(val)
    if (isNew || !slug) {
      const generated = val
        .toLowerCase()
        .replace(/['‘’`]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      setSlug(generated)
    }
  }

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setIsSaving(true)
    setError(null)
    setSuccessMsg(null)

    const payloadData: Record<string, any> = {
      fullName,
      slug: slug.trim(),
      role,
      subject,
      qualifications,
      achievements,
      bio,
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
      displayOrder: Number(displayOrder) || 10,
      status,
      portrait: portrait?.id || null,
    }

    const res = await saveDocumentAction('staff', initialDoc?.id || null, payloadData)

    if (!res.success) {
      setError(
        res.error ||
          (res.validationErrors && res.validationErrors.map((e) => e.message).join(' ')) ||
          'Xatolik yuz berdi'
      )
      setIsSaving(false)
      return
    }

    setSuccessMsg('Xodim profili muvaffaqiyatli saqlandi!')
    setIsSaving(false)

    if (isNew && res.id) {
      router.push(`/admin/staff/${res.id}`)
    } else {
      router.refresh()
    }
  }

  const handleDelete = async () => {
    if (!initialDoc?.id || isTeacher) return
    if (!window.confirm('Haqiqatan ham ushbu xodim profilini o‘chirmoqchimisiz?')) return

    setIsSaving(true)
    const res = await deleteDocumentAction('staff', initialDoc.id)
    if (!res.success) {
      setError(res.error || 'O‘chirishda xatolik yuz berdi.')
      setIsSaving(false)
      return
    }

    router.push('/admin/staff')
  }

  const handleRollback = async (versionId: string | number) => {
    if (!initialDoc?.id || isTeacher) return
    if (!window.confirm('Haqiqatan ham ushbu eski versiyani tiklamoqchimisiz?')) return

    setIsSaving(true)
    const res = await rollbackVersionAction('staff', initialDoc.id, versionId)
    if (!res.success) {
      setError(res.error || 'Versiyani tiklashda xatolik yuz berdi.')
      setIsSaving(false)
      return
    }

    setSuccessMsg('Eski versiya muvaffaqiyatli tiklandi!')
    setIsSaving(false)
    router.refresh()
  }

  return (
    <div>
      <div className="admin-page-header">
        <div className="admin-page-title-group">
          {!isTeacher && (
            <Link
              href="/admin/staff"
              style={{ color: 'var(--color-blue)', textDecoration: 'none', fontSize: 'var(--text-sm)' }}
            >
              ← Xodimlar ro‘yxatiga qaytish
            </Link>
          )}
          <h1>{isNew ? 'Yangi xodim qo‘shish' : isTeacher ? 'Mening profilim' : 'Xodim profilini tahrirlash'}</h1>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          {!isNew && isEditorOrAdmin && (
            <button
              type="button"
              className="btn btn-outline"
              style={{ color: '#ef4444', borderColor: '#ef4444' }}
              onClick={handleDelete}
              disabled={isSaving}
            >
              🗑️ O‘chirish
            </button>
          )}
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => handleSave()}
            disabled={isSaving}
          >
            {isSaving ? 'Saqlanmoqda...' : '💾 Saqlash'}
          </button>
        </div>
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

      <form onSubmit={handleSave}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 320px', gap: 'var(--space-6)' }}>
          <div>
            <div className="admin-form-card">
              <div className="admin-form-group">
                <label className="admin-form-label" htmlFor="staff-full-name">
                  To‘liq ismi (F.I.O.) *
                </label>
                <input
                  id="staff-full-name"
                  type="text"
                  className="admin-input"
                  placeholder="Rustamov Alisher Vohidovich"
                  value={fullName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label" htmlFor="staff-slug">
                  Veb-manzil (Slug) *
                </label>
                <input
                  id="staff-slug"
                  type="text"
                  className="admin-input"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  required
                />
                <span className="admin-form-help">
                  Manzil: /oqituvchilar/{slug || 'alisher-rustamov'}
                </span>
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label className="admin-form-label" htmlFor="staff-role">
                    Lavozimi *
                  </label>
                  <select
                    id="staff-role"
                    className="admin-select"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    disabled={isTeacher}
                  >
                    <option value="direktor">Maktab direktori</option>
                    <option value="orinbosar_oquv">O‘quv ishlari bo‘yicha direktor o‘rinbosari</option>
                    <option value="orinbosar_manaviyat">Ma’naviy-ma’rifiy ishlar bo‘yicha direktor o‘rinbosari</option>
                    <option value="oqituvchi">Fan o‘qituvchisi</option>
                    <option value="boshlangich">Boshlang‘ich sinf o‘qituvchisi</option>
                    <option value="psixolog">Maktab psixologi</option>
                    <option value="kutubxonachi">Kutubxona mudiri</option>
                  </select>
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label" htmlFor="staff-subject">
                    Mutaxassislik fani
                  </label>
                  <select
                    id="staff-subject"
                    className="admin-select"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  >
                    <option value="matematika">Matematika</option>
                    <option value="ona_tili">Ona tili va adabiyot</option>
                    <option value="fizika">Fizika</option>
                    <option value="kimyo">Kimyo</option>
                    <option value="biologiya">Biologiya</option>
                    <option value="ingliz_tili">Ingliz tili</option>
                    <option value="tarix">Tarix va huquq</option>
                    <option value="informatika">Informatika va IT</option>
                    <option value="boshlangich_talim">Boshlang‘ich ta’lim</option>
                    <option value="jismoniy_tarbiya">Jismoniy tarbiya</option>
                    <option value="sanat">Tasviriy san’at va musiqa</option>
                  </select>
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label" htmlFor="staff-qualifications">
                  Toifasi va ma’lumoti
                </label>
                <input
                  id="staff-qualifications"
                  type="text"
                  className="admin-input"
                  placeholder="Oliy toifali o‘qituvchi, Nizomiy nomidagi TDPU bitiruvchisi"
                  value={qualifications}
                  onChange={(e) => setQualifications(e.target.value)}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label" htmlFor="staff-achievements">
                  Yutuqlari va mukofotlari
                </label>
                <textarea
                  id="staff-achievements"
                  className="admin-textarea"
                  style={{ minHeight: '80px' }}
                  placeholder="“Xalq ta’limi a’lochisi” ko‘krak nishoni sohibi (2023-yil)..."
                  value={achievements}
                  onChange={(e) => setAchievements(e.target.value)}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label" htmlFor="staff-bio">
                  Tarjimai hol (Biografiya)
                </label>
                <textarea
                  id="staff-bio"
                  className="admin-textarea"
                  style={{ minHeight: '110px' }}
                  placeholder="Pedagogik faoliyatini 2012-yilda boshlagan..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label className="admin-form-label" htmlFor="staff-email">
                    Rasmiy maktab elektron pochtasi
                  </label>
                  <input
                    id="staff-email"
                    type="email"
                    className="admin-input"
                    placeholder="a.rustamov@maktab142.uz"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label" htmlFor="staff-phone">
                    Xizmat telefoni (Ichki raqam)
                  </label>
                  <input
                    id="staff-phone"
                    type="text"
                    className="admin-input"
                    placeholder="+998 71 200 01 42 (ichki 104)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            {/* Portrait Card */}
            <div className="admin-form-card">
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 600, marginBottom: 'var(--space-3)' }}>
                Rasmiy fotosurati (Portret)
              </h3>

              {portrait ? (
                <div>
                  <div
                    style={{
                      width: '100%',
                      aspectRatio: '4/5',
                      borderRadius: 'var(--radius-md)',
                      overflow: 'hidden',
                      marginBottom: 'var(--space-3)',
                      background: 'var(--color-surface-hover)',
                    }}
                  >
                    <img
                      src={portrait.url || `/media/${portrait.filename}`}
                      alt={portrait.alt || ''}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    <button
                      type="button"
                      className="btn btn-outline"
                      style={{ flex: 1, fontSize: 'var(--text-xs)' }}
                      onClick={() => setIsMediaModalOpen(true)}
                    >
                      O‘zgartirish
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline"
                      style={{ color: '#ef4444', fontSize: 'var(--text-xs)' }}
                      onClick={() => setPortrait(null)}
                    >
                      Olib tashlash
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => setIsMediaModalOpen(true)}
                  style={{
                    border: '2px dashed var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '2rem 1rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    background: 'var(--color-surface-hover)',
                  }}
                >
                  <div style={{ fontSize: '2rem', marginBottom: '4px' }}>👤</div>
                  <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text)' }}>
                    Portret rasmni tanlash
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                    4:5 nisbat tavsiya etiladi (800x1000)
                  </div>
                </div>
              )}
            </div>

            {/* Publication Parameters */}
            <div className="admin-form-card">
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 600, marginBottom: 'var(--space-4)' }}>
                Holati va Tartibi
              </h3>

              <div className="admin-form-group">
                <label className="admin-form-label" htmlFor="staff-status">
                  Profil holati
                </label>
                <select
                  id="staff-status"
                  className="admin-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  disabled={isTeacher}
                >
                  <option value="faol">Faol (Saytda ko‘rinadi)</option>
                  <option value="qoralama">Qoralama (Tekshirilmoqda)</option>
                  <option value="arxivlangan">Arxivlangan (Ishdan bo‘shagan)</option>
                </select>
              </div>

              {!isTeacher && (
                <div className="admin-form-group">
                  <label className="admin-form-label" htmlFor="staff-order">
                    Tartib raqami (Ketma-ketlik)
                  </label>
                  <input
                    id="staff-order"
                    type="number"
                    className="admin-input"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(parseInt(e.target.value, 10) || 10)}
                  />
                  <span className="admin-form-help">
                    Kichik sonlar ro‘yxat boshida turadi (1 = Direktor).
                  </span>
                </div>
              )}
            </div>

            {/* Revisions */}
            {!isNew && versions.length > 0 && isEditorOrAdmin && (
              <div className="admin-form-card">
                <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 600, marginBottom: 'var(--space-3)' }}>
                  Tahrirlar tarixi ({versions.length})
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  {versions.slice(0, 5).map((v: any, idx: number) => (
                    <div
                      key={v.id || idx}
                      style={{
                        padding: '0.5rem',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: 'var(--text-xs)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 600 }}>{formatDate(v.createdAt)}</div>
                        <div style={{ color: 'var(--color-text-muted)' }}>
                          {v.version?.fullName}
                        </div>
                      </div>
                      <button
                        type="button"
                        className="btn btn-outline"
                        style={{ padding: '0.2rem 0.4rem', fontSize: '0.7rem' }}
                        onClick={() => handleRollback(v.id)}
                      >
                        Tiklash
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </form>

      <MediaPickerModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        onSelect={(media) => setPortrait(media)}
        allowedTypes="image"
        title="O‘qituvchi rasmiy portret fotosuratini tanlash"
      />
    </div>
  )
}
