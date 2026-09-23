'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { MediaPickerModal, MediaItem } from '../MediaPickerModal'
import { saveDocumentAction, deleteDocumentAction } from '@/lib/actions/admin'
import type { SessionUser } from '@/lib/auth/session'

interface AlbumImageItem {
  image: MediaItem
  caption?: string
}

interface AlbumEditorProps {
  initialDoc?: any
  currentUser: SessionUser
}

export function AlbumEditor({ initialDoc, currentUser }: AlbumEditorProps) {
  const router = useRouter()
  const isNew = !initialDoc?.id

  const [title, setTitle] = useState(initialDoc?.title || '')
  const [slug, setSlug] = useState(initialDoc?.slug || '')
  const [eventDate, setEventDate] = useState(
    initialDoc?.eventDate ? new Date(initialDoc.eventDate).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10)
  )
  const [status, setStatus] = useState(initialDoc?.status || 'nashr_qilingan')
  const [coverImage, setCoverImage] = useState<MediaItem | null>(
    initialDoc?.coverImage && typeof initialDoc.coverImage === 'object' ? initialDoc.coverImage : null
  )

  const [images, setImages] = useState<AlbumImageItem[]>(
    Array.isArray(initialDoc?.images)
      ? initialDoc.images
          .map((item: any) => ({
            image: item.image,
            caption: item.caption || '',
          }))
          .filter((item: any) => item.image)
      : []
  )

  const [mediaPickerMode, setMediaPickerMode] = useState<'cover' | 'gallery' | null>(null)
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
      eventDate: new Date(eventDate).toISOString(),
      coverImage: coverImage?.id || null,
      images: images.map((item) => ({
        image: item.image.id,
        caption: item.caption || '',
      })),
      status,
    }

    const res = await saveDocumentAction('albums', initialDoc?.id || null, payloadData)

    if (!res.success) {
      setError(res.error || 'Saqlashda xatolik yuz berdi.')
      setIsSaving(false)
      return
    }

    setSuccessMsg('Albom muvaffaqiyatli saqlandi!')
    setIsSaving(false)

    if (isNew && res.id) {
      router.push(`/admin/albums/${res.id}`)
    } else {
      router.refresh()
    }
  }

  const handleDelete = async () => {
    if (!initialDoc?.id) return
    if (!window.confirm('Haqiqatan ham ushbu fotogalereyani o‘chirmoqchimisiz?')) return

    setIsSaving(true)
    const res = await deleteDocumentAction('albums', initialDoc.id)
    if (!res.success) {
      setError(res.error || 'O‘chirishda xatolik yuz berdi.')
      setIsSaving(false)
      return
    }

    router.push('/admin/albums')
  }

  const removeGalleryImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const updateCaption = (index: number, caption: string) => {
    setImages((prev) =>
      prev.map((item, i) => (i === index ? { ...item, caption } : item))
    )
  }

  return (
    <div>
      <div className="admin-page-header">
        <div className="admin-page-title-group">
          <Link
            href="/admin/albums"
            style={{ color: 'var(--color-blue)', textDecoration: 'none', fontSize: 'var(--text-sm)' }}
          >
            ← Fotogalereyalar ro‘yxatiga qaytish
          </Link>
          <h1>{isNew ? 'Yangi fotogalereya albomi' : 'Albomni tahrirlash'}</h1>
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
                <label className="admin-form-label" htmlFor="album-title">
                  Albom nomi *
                </label>
                <input
                  id="album-title"
                  type="text"
                  className="admin-input"
                  placeholder="“Bilimlar kuni” tantanali tadbiri"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  required
                />
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label className="admin-form-label" htmlFor="album-slug">
                    Veb-manzil (Slug) *
                  </label>
                  <input
                    id="album-slug"
                    type="text"
                    className="admin-input"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label" htmlFor="album-event-date">
                    Tadbir sanasi *
                  </label>
                  <input
                    id="album-event-date"
                    type="date"
                    className="admin-input"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Gallery Images List */}
            <div className="admin-form-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 600, margin: 0 }}>
                  Albomdagi fotosuratlar ({images.length})
                </h3>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ fontSize: 'var(--text-xs)' }}
                  onClick={() => setMediaPickerMode('gallery')}
                >
                  ➕ Rasm qo‘shish
                </button>
              </div>

              {images.length === 0 ? (
                <div
                  onClick={() => setMediaPickerMode('gallery')}
                  style={{
                    border: '2px dashed var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '2.5rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    background: 'var(--color-surface-hover)',
                  }}
                >
                  <div style={{ fontSize: '2rem', marginBottom: '4px' }}>🖼️</div>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>
                    Albomga fotosuratlar qo‘shish uchun bosing
                  </div>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                  {images.map((item, idx) => (
                    <div
                      key={item.image.id || idx}
                      style={{
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-md)',
                        overflow: 'hidden',
                        background: 'var(--color-surface)',
                      }}
                    >
                      <div style={{ height: '120px', overflow: 'hidden', background: 'var(--color-surface-hover)' }}>
                        <img
                          src={item.image.url || `/media/${item.image.filename}`}
                          alt={item.image.alt || ''}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                      <div style={{ padding: '0.5rem' }}>
                        <input
                          type="text"
                          className="admin-input"
                          style={{ fontSize: '0.75rem', padding: '0.3rem 0.5rem', marginBottom: '0.4rem' }}
                          placeholder="Rasm osti izohi..."
                          value={item.caption || ''}
                          onChange={(e) => updateCaption(idx, e.target.value)}
                        />
                        <button
                          type="button"
                          className="btn btn-outline"
                          style={{ width: '100%', color: '#ef4444', fontSize: '0.7rem', padding: '0.2rem' }}
                          onClick={() => removeGalleryImage(idx)}
                        >
                          Olib tashlash
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="admin-form-card">
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 600, marginBottom: 'var(--space-4)' }}>
                Holati
              </h3>
              <div className="admin-form-group">
                <label className="admin-form-label" htmlFor="album-status">
                  Nashr holati
                </label>
                <select
                  id="album-status"
                  className="admin-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="nashr_qilingan">Nashr qilingan</option>
                  <option value="qoralama">Qoralama</option>
                </select>
              </div>
            </div>

            <div className="admin-form-card">
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 600, marginBottom: 'var(--space-3)' }}>
                Albom muqovasi (Bosh rasm)
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
                      onClick={() => setMediaPickerMode('cover')}
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
                  onClick={() => setMediaPickerMode('cover')}
                  style={{
                    border: '2px dashed var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.5rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    background: 'var(--color-surface-hover)',
                  }}
                >
                  <div style={{ fontSize: '2rem', marginBottom: '4px' }}>🖼️</div>
                  <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600 }}>
                    Muqova rasmini tanlash
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </form>

      <MediaPickerModal
        isOpen={Boolean(mediaPickerMode)}
        onClose={() => setMediaPickerMode(null)}
        onSelect={(media) => {
          if (mediaPickerMode === 'cover') {
            setCoverImage(media)
          } else if (mediaPickerMode === 'gallery') {
            setImages((prev) => [...prev, { image: media, caption: media.alt || '' }])
          }
        }}
        allowedTypes="image"
        title={mediaPickerMode === 'cover' ? 'Albom muqovasini tanlash' : 'Albomga rasm qo‘shish'}
      />
    </div>
  )
}
