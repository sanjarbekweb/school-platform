'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { MediaPickerModal, MediaItem } from '../MediaPickerModal'
import { saveDocumentAction, deleteDocumentAction } from '@/lib/actions/admin'
import { textToLexical, lexicalToText } from '@/lib/lexical/convert'
import type { SessionUser } from '@/lib/auth/session'

interface PageEditorProps {
  initialDoc?: any
  currentUser: SessionUser
}

export function PageEditor({ initialDoc, currentUser }: PageEditorProps) {
  const router = useRouter()
  const isNew = !initialDoc?.id

  const [title, setTitle] = useState(initialDoc?.title || '')
  const [slug, setSlug] = useState(initialDoc?.slug || '')
  const [subtitle, setSubtitle] = useState(initialDoc?.subtitle || '')
  const [content, setContent] = useState(
    initialDoc?.content ? lexicalToText(initialDoc.content) : ''
  )
  const [status, setStatus] = useState(initialDoc?.status || 'nashr_qilingan')
  const [featuredImage, setFeaturedImage] = useState<MediaItem | null>(
    initialDoc?.featuredImage && typeof initialDoc.featuredImage === 'object'
      ? initialDoc.featuredImage
      : null
  )

  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

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

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setIsSaving(true)
    setError(null)
    setSuccessMsg(null)

    const payloadData: Record<string, any> = {
      title,
      slug: slug.trim(),
      subtitle,
      content: textToLexical(content),
      featuredImage: featuredImage?.id || null,
      status,
    }

    const res = await saveDocumentAction('pages', initialDoc?.id || null, payloadData)

    if (!res.success) {
      setError(
        res.error ||
          (res.validationErrors && res.validationErrors.map((e) => e.message).join(' ')) ||
          'Xatolik yuz berdi'
      )
      setIsSaving(false)
      return
    }

    setSuccessMsg('Sahifa muvaffaqiyatli saqlandi!')
    setIsSaving(false)

    if (isNew && res.id) {
      router.push(`/admin/pages/${res.id}`)
    } else {
      router.refresh()
    }
  }

  const handleDelete = async () => {
    if (!initialDoc?.id) return
    if (!window.confirm('Haqiqatan ham ushbu sahifani o‘chirmoqchimisiz?')) return

    setIsSaving(true)
    const res = await deleteDocumentAction('pages', initialDoc.id)
    if (!res.success) {
      setError(res.error || 'O‘chirishda xatolik yuz berdi.')
      setIsSaving(false)
      return
    }

    router.push('/admin/pages')
  }

  return (
    <div>
      <div className="admin-page-header">
        <div className="admin-page-title-group">
          <Link
            href="/admin/pages"
            style={{ color: 'var(--color-blue)', textDecoration: 'none', fontSize: 'var(--text-sm)' }}
          >
            ← Sahifalar ro‘yxatiga qaytish
          </Link>
          <h1>{isNew ? 'Yangi doimiy sahifa yaratish' : 'Sahifani tahrirlash'}</h1>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          {!isNew && (
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
                <label className="admin-form-label" htmlFor="page-title">
                  Sahifa sarlavhasi *
                </label>
                <input
                  id="page-title"
                  type="text"
                  className="admin-input"
                  placeholder="Maktab haqida umumiy ma’lumot"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label" htmlFor="page-slug">
                  Veb-manzil (URL slug) *
                </label>
                <input
                  id="page-slug"
                  type="text"
                  className="admin-input"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  required
                />
                <span className="admin-form-help">
                  Sayt manzili: /{slug || 'maktab-haqida'}
                </span>
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label" htmlFor="page-subtitle">
                  Sahifa ost-sarlavhasi / Tavsif
                </label>
                <input
                  id="page-subtitle"
                  type="text"
                  className="admin-input"
                  placeholder="142-sonli maktabning maqsadlari va qadriyatlari..."
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label" htmlFor="page-content">
                  Sahifa to‘liq matni (Markdown / Lexical) *
                </label>
                <textarea
                  id="page-content"
                  className="admin-textarea"
                  style={{ minHeight: '380px', fontFamily: 'monospace' }}
                  placeholder="Sahifa matni..."
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
                <label className="admin-form-label" htmlFor="page-status">
                  Nashr holati
                </label>
                <select
                  id="page-status"
                  className="admin-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="nashr_qilingan">Nashr qilingan (Hamma ko‘radi)</option>
                  <option value="qoralama">Qoralama</option>
                </select>
              </div>
            </div>

            <div className="admin-form-card">
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 600, marginBottom: 'var(--space-3)' }}>
                Sahifaning asosiy tasviri
              </h3>

              {featuredImage ? (
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
                      src={featuredImage.url || `/media/${featuredImage.filename}`}
                      alt={featuredImage.alt || ''}
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
                      onClick={() => setFeaturedImage(null)}
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
                    Tasvir tanlash
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </form>

      <MediaPickerModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        onSelect={(media) => setFeaturedImage(media)}
        allowedTypes="image"
        title="Sahifa tasvirini tanlash"
      />
    </div>
  )
}
