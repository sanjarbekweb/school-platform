'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { MediaPickerModal, MediaItem } from '../MediaPickerModal'
import { saveDocumentAction, deleteDocumentAction } from '@/lib/actions/admin'
import type { SessionUser } from '@/lib/auth/session'

interface MagazineEditorProps {
  initialDoc?: any
  currentUser: SessionUser
}

export function MagazineEditor({ initialDoc, currentUser }: MagazineEditorProps) {
  const router = useRouter()
  const isNew = !initialDoc?.id

  const [title, setTitle] = useState(initialDoc?.title || '')
  const [slug, setSlug] = useState(initialDoc?.slug || '')
  const [issueNumber, setIssueNumber] = useState(initialDoc?.issueNumber || '')
  const [summary, setSummary] = useState(initialDoc?.summary || '')
  const [fileSize, setFileSize] = useState(initialDoc?.fileSize || '')
  const [pageCount, setPageCount] = useState(initialDoc?.pageCount ?? '')
  const [contentsList, setContentsList] = useState(initialDoc?.contentsList || '')
  const [status, setStatus] = useState(initialDoc?.status || 'nashr_qilingan')

  const [coverImage, setCoverImage] = useState<MediaItem | null>(
    initialDoc?.coverImage && typeof initialDoc.coverImage === 'object' ? initialDoc.coverImage : null
  )
  const [pdfFile, setPdfFile] = useState<MediaItem | null>(
    initialDoc?.pdfFile && typeof initialDoc.pdfFile === 'object' ? initialDoc.pdfFile : null
  )

  const [mediaModalType, setMediaModalType] = useState<'image' | 'pdf' | null>(null)
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

    if (!pdfFile) {
      setError('Jurnalning to‘liq PDF fayli yuklanishi yoki tanlanishi shart.')
      setIsSaving(false)
      return
    }

    const payloadData: Record<string, any> = {
      title,
      slug: slug.trim(),
      issueNumber,
      summary,
      coverImage: coverImage?.id || null,
      pdfFile: pdfFile.id,
      fileSize: fileSize.trim() || undefined,
      pageCount: pageCount ? Number(pageCount) : undefined,
      contentsList,
      status,
    }

    const res = await saveDocumentAction('magazines', initialDoc?.id || null, payloadData)

    if (!res.success) {
      setError(res.error || 'Saqlashda xatolik yuz berdi.')
      setIsSaving(false)
      return
    }

    setSuccessMsg('Maktab jurnali muvaffaqiyatli saqlandi!')
    setIsSaving(false)

    if (isNew && res.id) {
      router.push(`/admin/magazines/${res.id}`)
    } else {
      router.refresh()
    }
  }

  const handleDelete = async () => {
    if (!initialDoc?.id) return
    if (!window.confirm('Haqiqatan ham ushbu jurnal sonini o‘chirmoqchimisiz?')) return

    setIsSaving(true)
    const res = await deleteDocumentAction('magazines', initialDoc.id)
    if (!res.success) {
      setError(res.error || 'O‘chirishda xatolik yuz berdi.')
      setIsSaving(false)
      return
    }

    router.push('/admin/magazines')
  }

  return (
    <div>
      <div className="admin-page-header">
        <div className="admin-page-title-group">
          <Link
            href="/admin/magazines"
            style={{ color: 'var(--color-blue)', textDecoration: 'none', fontSize: 'var(--text-sm)' }}
          >
            ← Jurnallar ro‘yxatiga qaytish
          </Link>
          <h1>{isNew ? 'Yangi jurnal sonini joylash' : 'Jurnalni tahrirlash'}</h1>
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
                <label className="admin-form-label" htmlFor="mag-title">
                  Jurnal nomi *
                </label>
                <input
                  id="mag-title"
                  type="text"
                  className="admin-input"
                  placeholder="“Zukko avlod” ilmiy-ommabop maktab jurnali"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  required
                />
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label className="admin-form-label" htmlFor="mag-slug">
                    Veb-manzil (Slug) *
                  </label>
                  <input
                    id="mag-slug"
                    type="text"
                    className="admin-input"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label" htmlFor="mag-issue">
                    Nashr soni va yili *
                  </label>
                  <input
                    id="mag-issue"
                    type="text"
                    className="admin-input"
                    placeholder="2026-yil 1-son"
                    value={issueNumber}
                    onChange={(e) => setIssueNumber(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label" htmlFor="mag-summary">
                  Qisqa annotatsiya (Tavsif)
                </label>
                <textarea
                  id="mag-summary"
                  className="admin-textarea"
                  style={{ minHeight: '80px' }}
                  placeholder="Ushbu sonda o‘quvchilarimizning ilmiy maqolalari..."
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label" htmlFor="mag-contents">
                  Mundarija (Maqolalar ro‘yxati)
                </label>
                <textarea
                  id="mag-contents"
                  className="admin-textarea"
                  style={{ minHeight: '120px' }}
                  placeholder="1. Bosh muharrir so‘zi - 2-bet&#10;2. Yosh astronomlar - 6-bet"
                  value={contentsList}
                  onChange={(e) => setContentsList(e.target.value)}
                />
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label className="admin-form-label" htmlFor="mag-pages">
                    Sahifalar soni
                  </label>
                  <input
                    id="mag-pages"
                    type="number"
                    className="admin-input"
                    placeholder="32"
                    value={pageCount}
                    onChange={(e) => setPageCount(e.target.value)}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label" htmlFor="mag-size">
                    Fayl hajmi (Ko‘rsatish uchun)
                  </label>
                  <input
                    id="mag-size"
                    type="text"
                    className="admin-input"
                    placeholder="2.4 MB"
                    value={fileSize}
                    onChange={(e) => setFileSize(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            {/* PDF Attachment */}
            <div className="admin-form-card">
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 600, marginBottom: 'var(--space-3)' }}>
                Elektron PDF fayl *
              </h3>

              {pdfFile ? (
                <div
                  style={{
                    padding: '0.75rem',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--color-surface-hover)',
                    marginBottom: 'var(--space-3)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.5rem' }}>📄</span>
                    <div style={{ overflow: 'hidden' }}>
                      <div
                        style={{
                          fontWeight: 600,
                          fontSize: 'var(--text-xs)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {pdfFile.filename || pdfFile.alt}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                        PDF fayli biriktirildi
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-outline"
                    style={{ width: '100%', marginTop: 'var(--space-2)', fontSize: 'var(--text-xs)' }}
                    onClick={() => setMediaModalType('pdf')}
                  >
                    Boshqa PDF tanlash
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => setMediaModalType('pdf')}
                  style={{
                    border: '2px dashed var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.5rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    background: 'var(--color-surface-hover)',
                  }}
                >
                  <div style={{ fontSize: '2rem', marginBottom: '4px' }}>📄</div>
                  <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600 }}>
                    PDF fayl yuklash yoki tanlash
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                    Maksimal 25 MB
                  </div>
                </div>
              )}
            </div>

            {/* Cover Image */}
            <div className="admin-form-card">
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 600, marginBottom: 'var(--space-3)' }}>
                Muqova fotosurati
              </h3>

              {coverImage ? (
                <div>
                  <div
                    style={{
                      width: '100%',
                      aspectRatio: '3/4',
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
                      onClick={() => setMediaModalType('image')}
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
                  onClick={() => setMediaModalType('image')}
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

            {/* Status */}
            <div className="admin-form-card">
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 600, marginBottom: 'var(--space-4)' }}>
                Holati
              </h3>
              <div className="admin-form-group">
                <label className="admin-form-label" htmlFor="mag-status">
                  Holati
                </label>
                <select
                  id="mag-status"
                  className="admin-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="nashr_qilingan">Nashr qilingan (Hamma ko‘radi)</option>
                  <option value="qoralama">Qoralama</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </form>

      <MediaPickerModal
        isOpen={Boolean(mediaModalType)}
        onClose={() => setMediaModalType(null)}
        onSelect={(media) => {
          if (mediaModalType === 'pdf') {
            setPdfFile(media)
            if (media.filesize) {
              setFileSize(`${(media.filesize / (1024 * 1024)).toFixed(1)} MB`)
            }
          } else {
            setCoverImage(media)
          }
        }}
        allowedTypes={mediaModalType === 'pdf' ? 'pdf' : 'image'}
        title={mediaModalType === 'pdf' ? 'PDF faylni tanlash yoki yuklash' : 'Muqova fotosuratini tanlash'}
      />
    </div>
  )
}
