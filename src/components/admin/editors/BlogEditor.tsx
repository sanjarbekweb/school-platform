'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { MediaPickerModal, MediaItem } from '../MediaPickerModal'
import { saveDocumentAction, deleteDocumentAction } from '@/lib/actions/admin'
import { textToLexical, lexicalToText } from '@/lib/lexical/convert'
import type { SessionUser } from '@/lib/auth/session'

interface BlogEditorProps {
  initialDoc?: any
  currentUser: SessionUser
}

export function BlogEditor({ initialDoc, currentUser }: BlogEditorProps) {
  const router = useRouter()
  const isNew = !initialDoc?.id

  const [title, setTitle] = useState(initialDoc?.title || '')
  const [slug, setSlug] = useState(initialDoc?.slug || '')
  const [summary, setSummary] = useState(initialDoc?.summary || '')
  const [authorName, setAuthorName] = useState(initialDoc?.authorName || currentUser.name || '')
  const [content, setContent] = useState(
    initialDoc?.content ? lexicalToText(initialDoc.content) : ''
  )
  const [coverImage, setCoverImage] = useState<MediaItem | null>(
    initialDoc?.coverImage && typeof initialDoc.coverImage === 'object' ? initialDoc.coverImage : null
  )
  const [status, setStatus] = useState(initialDoc?.status || 'qoralama')

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
      authorName,
      content: textToLexical(content),
      coverImage: coverImage?.id || null,
      status: finalStatus,
    }

    const res = await saveDocumentAction('blog', initialDoc?.id || null, payloadData)

    if (!res.success) {
      setError(
        res.error ||
          (res.validationErrors && res.validationErrors.map((e) => e.message).join(' ')) ||
          'Xatolik yuz berdi'
      )
      setIsSaving(false)
      return
    }

    setSuccessMsg('Maqola muvaffaqiyatli saqlandi!')
    setIsSaving(false)

    if (isNew && res.id) {
      router.push(`/admin/blog/${res.id}`)
    } else {
      router.refresh()
    }
  }

  const handleDelete = async () => {
    if (!initialDoc?.id || isTeacher) return
    if (!window.confirm('Haqiqatan ham ushbu maqolani o‘chirmoqchimisiz?')) return

    setIsSaving(true)
    const res = await deleteDocumentAction('blog', initialDoc.id)
    if (!res.success) {
      setError(res.error || 'O‘chirishda xatolik yuz berdi.')
      setIsSaving(false)
      return
    }

    router.push('/admin/blog')
  }

  return (
    <div>
      <div className="admin-page-header">
        <div className="admin-page-title-group">
          <Link
            href="/admin/blog"
            style={{ color: 'var(--color-blue)', textDecoration: 'none', fontSize: 'var(--text-sm)' }}
          >
            ← Maqolalar ro‘yxatiga qaytish
          </Link>
          <h1>{isNew ? 'Yangi blog maqolasi yozish' : 'Maqolani tahrirlash'}</h1>
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
        <div>
          <div className="admin-form-card">
            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="blog-title">
                Maqola sarlavhasi *
              </label>
              <input
                id="blog-title"
                type="text"
                className="admin-input"
                placeholder="Zamonaviy darsda interfaol metodlarning samaradorligi"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                required
              />
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label" htmlFor="blog-slug">
                  Veb-manzil (Slug) *
                </label>
                <input
                  id="blog-slug"
                  type="text"
                  className="admin-input"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label" htmlFor="blog-author">
                  Muallif (Ism va unvoni) *
                </label>
                <input
                  id="blog-author"
                  type="text"
                  className="admin-input"
                  placeholder="Nilufar Karimova, Oliy toifali o‘qituvchi"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="blog-summary">
                Qisqa annotatsiya (Anons) *
              </label>
              <textarea
                id="blog-summary"
                className="admin-textarea"
                style={{ minHeight: '80px' }}
                placeholder="Maqolaning qisqacha mazmuni..."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                required
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="blog-content">
                To‘liq maqola matni (Markdown / Lexical) *
              </label>
              <textarea
                id="blog-content"
                className="admin-textarea"
                style={{ minHeight: '340px', fontFamily: 'monospace' }}
                placeholder="Maqola matnini bu yerda yozing..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        <div>
          <div className="admin-form-card">
            <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 600, marginBottom: 'var(--space-4)' }}>
              Holati
            </h3>
            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="blog-status">
                Nashr holati
              </label>
              <select
                id="blog-status"
                className="admin-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                disabled={isTeacher}
              >
                <option value="qoralama">Qoralama</option>
                <option value="korib_chiqilmoqda">Ko‘rib chiqilmoqda</option>
                <option value="ozgartirish_kerak">Qayta ishlash kerak</option>
                {canPublish && <option value="nashr_qilingan">Nashr qilingan</option>}
                {canPublish && <option value="arxivlangan">Arxivlangan</option>}
              </select>
            </div>
          </div>

          <div className="admin-form-card">
            <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 600, marginBottom: 'var(--space-3)' }}>
              Muqova fotosurati
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
                <div style={{ fontSize: '1.75rem', marginBottom: '4px' }}>🖼️</div>
                <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600 }}>
                  Muqova rasmini tanlash
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <MediaPickerModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        onSelect={(media) => setCoverImage(media)}
        allowedTypes="image"
        title="Maqola muqovasini tanlash"
      />
    </div>
  )
}
