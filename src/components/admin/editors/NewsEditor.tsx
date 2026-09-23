'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { MediaPickerModal, MediaItem } from '../MediaPickerModal'
import { saveDocumentAction, deleteDocumentAction, rollbackVersionAction } from '@/lib/actions/admin'
import { textToLexical, lexicalToText } from '@/lib/lexical/convert'
import { formatDate } from '@/lib/utils'
import type { SessionUser } from '@/lib/auth/session'

interface NewsEditorProps {
  initialDoc?: any
  versions?: any[]
  staffList?: { id: string | number; fullName: string }[]
  currentUser: SessionUser
}

export function NewsEditor({
  initialDoc,
  versions = [],
  staffList = [],
  currentUser,
}: NewsEditorProps) {
  const router = useRouter()
  const isNew = !initialDoc?.id

  const [title, setTitle] = useState(initialDoc?.title || '')
  const [slug, setSlug] = useState(initialDoc?.slug || '')
  const [summary, setSummary] = useState(initialDoc?.summary || '')
  const [category, setCategory] = useState(initialDoc?.category || 'akademik')
  const [content, setContent] = useState(
    initialDoc?.content ? lexicalToText(initialDoc.content) : ''
  )
  const [coverImage, setCoverImage] = useState<MediaItem | null>(
    initialDoc?.coverImage && typeof initialDoc.coverImage === 'object'
      ? initialDoc.coverImage
      : null
  )
  const [status, setStatus] = useState(initialDoc?.status || 'qoralama')
  const [editorialNotes, setEditorialNotes] = useState(initialDoc?.editorialNotes || '')
  const [authorStaff, setAuthorStaff] = useState(
    initialDoc?.authorStaff && typeof initialDoc.authorStaff === 'object'
      ? initialDoc.authorStaff.id
      : initialDoc?.authorStaff || currentUser.linkedStaff || ''
  )

  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const isTeacher = currentUser.role === 'teacher'
  const canPublish = currentUser.role === 'admin' || currentUser.role === 'editor'

  const handleTitleChange = (val: string) => {
    setTitle(val)
    if (isNew || !slug) {
      const generated = val
        .toLowerCase()
        .replace(/['‘’`]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      setSlug(generated)
    }
  }

  const handleSave = async (targetStatus?: string) => {
    setIsSaving(true)
    setError(null)
    setSuccessMsg(null)

    const finalStatus = targetStatus || status

    const payloadData: Record<string, any> = {
      title,
      slug: slug.trim(),
      summary,
      category,
      content: textToLexical(content),
      coverImage: coverImage?.id || null,
      status: finalStatus,
      authorStaff: authorStaff || null,
    }

    if (!isTeacher) {
      payloadData.editorialNotes = editorialNotes
    }

    const res = await saveDocumentAction('news', initialDoc?.id || null, payloadData)

    if (!res.success) {
      setError(
        res.error ||
          (res.validationErrors && res.validationErrors.map((e) => e.message).join(' ')) ||
          'Xatolik yuz berdi'
      )
      setIsSaving(false)
      return
    }

    setSuccessMsg('Muvaffaqiyatli saqlandi!')
    setIsSaving(false)

    if (isNew && res.id) {
      router.push(`/admin/news/${res.id}`)
    } else {
      router.refresh()
    }
  }

  const handleDelete = async () => {
    if (!initialDoc?.id) return
    if (!window.confirm('Haqiqatan ham ushbu yangilikni o‘chirmoqchimisiz?')) return

    setIsSaving(true)
    const res = await deleteDocumentAction('news', initialDoc.id)
    if (!res.success) {
      setError(res.error || 'O‘chirishda xatolik yuz berdi.')
      setIsSaving(false)
      return
    }

    router.push('/admin/news')
  }

  const handleRollback = async (versionId: string | number) => {
    if (!initialDoc?.id) return
    if (!window.confirm('Haqiqatan ham ushbu eski versiyani tiklamoqchimisiz?')) return

    setIsSaving(true)
    const res = await rollbackVersionAction('news', initialDoc.id, versionId)
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
      {/* Header */}
      <div className="admin-page-header">
        <div className="admin-page-title-group">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Link
              href="/admin/news"
              style={{ color: 'var(--color-blue)', textDecoration: 'none', fontSize: 'var(--text-sm)' }}
            >
              ← Yangiliklar ro‘yxatiga qaytish
            </Link>
          </div>
          <h1>{isNew ? 'Yangi yangilik yozish' : 'Yangilikni tahrirlash'}</h1>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          {!isNew && !isTeacher && (
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
          {isTeacher ? (
            <>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => handleSave('qoralama')}
                disabled={isSaving}
              >
                💾 Qoralama saqlash
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => handleSave('korib_chiqilmoqda')}
                disabled={isSaving}
              >
                📤 Tahririyatga yuborish
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => handleSave()}
                disabled={isSaving}
              >
                💾 Saqlash
              </button>
              {canPublish && (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => handleSave('nashr_qilingan')}
                  disabled={isSaving}
                >
                  🚀 Nashr qilish
                </button>
              )}
            </>
          )}
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

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 320px', gap: 'var(--space-6)' }}>
        {/* Main Column */}
        <div>
          <div className="admin-form-card">
            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="news-title">
                Yangilik sarlavhasi *
              </label>
              <input
                id="news-title"
                type="text"
                className="admin-input"
                placeholder="Maktabimizda Navro‘z bayrami keng nishonlandi"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                required
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="news-slug">
                Veb-manzil (URL slug) *
              </label>
              <input
                id="news-slug"
                type="text"
                className="admin-input"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
              />
              <span className="admin-form-help">
                Manzil: /yangiliklar/{slug || 'manzil-namunasi'}
              </span>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="news-summary">
                Qisqa mazmuni (Anons) *
              </label>
              <textarea
                id="news-summary"
                className="admin-textarea"
                style={{ minHeight: '80px' }}
                placeholder="Bosh sahifa va qidiruv tizimlari uchun 1-2 jumlali qisqa tavsif..."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                required
              />
            </div>

            <div className="admin-form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <label className="admin-form-label" htmlFor="news-content">
                  To‘liq maqola matni (Markdown / Lexical) *
                </label>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button
                    type="button"
                    className="btn btn-outline"
                    style={{ padding: '0.15rem 0.4rem', fontSize: '0.75rem' }}
                    onClick={() => setContent((prev) => prev + '\n\n## Kichik sarlavha\n')}
                  >
                    H2
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline"
                    style={{ padding: '0.15rem 0.4rem', fontSize: '0.75rem' }}
                    onClick={() => setContent((prev) => prev + ' **qalin matn** ')}
                  >
                    B
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline"
                    style={{ padding: '0.15rem 0.4rem', fontSize: '0.75rem' }}
                    onClick={() => setContent((prev) => prev + ' *kursiv matn* ')}
                  >
                    I
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline"
                    style={{ padding: '0.15rem 0.4rem', fontSize: '0.75rem' }}
                    onClick={() => setContent((prev) => prev + '\n- Ro‘yxat bandi 1\n- Ro‘yxat bandi 2\n')}
                  >
                    Ro‘yxat
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline"
                    style={{ padding: '0.15rem 0.4rem', fontSize: '0.75rem' }}
                    onClick={() => setContent((prev) => prev + '\n> Muhim iqtibos\n')}
                  >
                    Iqtibos
                  </button>
                </div>
              </div>
              <textarea
                id="news-content"
                className="admin-textarea"
                style={{ minHeight: '340px', fontFamily: 'monospace', fontSize: '0.95rem' }}
                placeholder="Maqolangizni bu yerda yozing. Matn paragraflar orasida bitta bo‘sh qator qoldiring..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>

            {/* Editorial Notes for Non-Teachers */}
            {!isTeacher && (
              <div className="admin-form-group" style={{ marginTop: 'var(--space-6)' }}>
                <label className="admin-form-label" htmlFor="news-editorial-notes">
                  Tahririyat izohlari (Faqat muharrirlar va muallif uchun ichki ko‘rsatmalar)
                </label>
                <textarea
                  id="news-editorial-notes"
                  className="admin-textarea"
                  style={{ minHeight: '80px', background: 'rgba(245, 158, 11, 0.05)' }}
                  placeholder="Muallifga ko‘rsatmalar, tahrir talablari yoki eslatmalar..."
                  value={editorialNotes}
                  onChange={(e) => setEditorialNotes(e.target.value)}
                />
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Column */}
        <div>
          {/* Status Card */}
          <div className="admin-form-card">
            <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 600, marginBottom: 'var(--space-4)' }}>
              Nashr va Holat
            </h3>

            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="news-status">
                Holati (Workflow)
              </label>
              <select
                id="news-status"
                className="admin-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                disabled={isTeacher}
              >
                <option value="qoralama">Qoralama (Muallif tahririda)</option>
                <option value="korib_chiqilmoqda">Ko‘rib chiqilmoqda (Muharrirda)</option>
                <option value="ozgartirish_kerak">Qayta ishlash kerak</option>
                {canPublish && <option value="nashr_qilingan">Nashr qilingan (Faol)</option>}
                {canPublish && <option value="arxivlangan">Arxivlangan</option>}
              </select>
              {isTeacher && (
                <span className="admin-form-help">
                  O‘qituvchi maqolani &quot;Ko‘rib chiqilmoqda&quot; sifatida yuboradi, muharrir tasdiqlaydi.
                </span>
              )}
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="news-category">
                Rukn (Kategoriya) *
              </label>
              <select
                id="news-category"
                className="admin-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="akademik">Akademik jarayon</option>
                <option value="tadbirlar">Tadbirlar va bayramlar</option>
                <option value="sport">Sport musobaqalari</option>
                <option value="madaniyat">Madaniyat va san’at</option>
              </select>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="news-author-staff">
                Muallif o‘qituvchi profili
              </label>
              <select
                id="news-author-staff"
                className="admin-select"
                value={authorStaff}
                onChange={(e) => setAuthorStaff(e.target.value)}
                disabled={isTeacher && Boolean(currentUser.linkedStaff)}
              >
                <option value="">Biriktirilmagan</option>
                {staffList.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.fullName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Cover Image Card */}
          <div className="admin-form-card">
            <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 600, marginBottom: 'var(--space-3)' }}>
              Asosiy rasm (Muqova)
            </h3>

            {coverImage ? (
              <div>
                <div
                  style={{
                    width: '100%',
                    aspectRatio: '16/10',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    marginBottom: 'var(--space-3)',
                    background: 'var(--color-surface-hover)',
                  }}
                >
                  <img
                    src={coverImage.url || `/media/${coverImage.filename}`}
                    alt={coverImage.alt || ''}
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
                    onClick={() => setCoverImage(null)}
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
                  padding: '1.5rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  background: 'var(--color-surface-hover)',
                }}
              >
                <div style={{ fontSize: '1.75rem', marginBottom: '4px' }}>📷</div>
                <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text)' }}>
                  Rasm tanlash yoki yuklash
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                  16:10 tavsiya etiladi (1200x750)
                </div>
              </div>
            )}
          </div>

          {/* Revision History & Rollback */}
          {!isNew && versions.length > 0 && !isTeacher && (
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
                        {v.version?.status || 'qoralama'}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn btn-outline"
                      style={{ padding: '0.2rem 0.4rem', fontSize: '0.7rem' }}
                      onClick={() => handleRollback(v.id)}
                      title="Ushbu versiyaga qaytarish"
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

      <MediaPickerModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        onSelect={(media) => setCoverImage(media)}
        allowedTypes="image"
        title="Yangilik muqovasi fotosuratini tanlash"
      />
    </div>
  )
}
