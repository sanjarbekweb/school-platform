'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { deleteDocumentAction } from '@/lib/actions/admin'
import type { SessionUser } from '@/lib/auth/session'

interface MediaDoc {
  id: string | number
  filename: string
  alt: string
  mimeType: string
  filesize?: number
  url?: string
  createdAt?: string
}

interface MediaManagerProps {
  initialDocs: MediaDoc[]
  totalDocs: number
  currentUser: SessionUser
}

export function MediaManager({
  initialDocs,
  totalDocs,
  currentUser,
}: MediaManagerProps) {
  const router = useRouter()
  const [docs, setDocs] = useState<MediaDoc[]>(initialDocs)
  const [search, setSearch] = useState('')
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [uploadAlt, setUploadAlt] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [copiedId, setCopiedId] = useState<string | number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const canDelete = currentUser.role === 'admin' || currentUser.role === 'editor'

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!uploadFile) return

    setIsUploading(true)
    setError(null)
    setSuccess(null)

    const formData = new FormData()
    formData.append('file', uploadFile)
    formData.append('alt', uploadAlt.trim() || uploadFile.name)

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()

      if (!res.ok || !data.success) {
        setError(data.error || 'Faylni yuklashda xatolik yuz berdi.')
        setIsUploading(false)
        return
      }

      setDocs((prev) => [data.media, ...prev])
      setSuccess('Fayl muvaffaqiyatli yuklandi!')
      setUploadFile(null)
      setUploadAlt('')
      setIsUploading(false)
      router.refresh()
    } catch {
      setError('Server bilan aloqa uzildi.')
      setIsUploading(false)
    }
  }

  const handleDelete = async (id: string | number) => {
    if (!canDelete) return
    if (!window.confirm('Haqiqatan ham ushbu faylni butunlay o‘chirmoqchimisiz?')) return

    const res = await deleteDocumentAction('media', id)
    if (!res.success) {
      alert(res.error || 'O‘chirishda xatolik.')
      return
    }

    setDocs((prev) => prev.filter((d) => d.id !== id))
    router.refresh()
  }

  const handleCopyUrl = (doc: MediaDoc) => {
    const url = doc.url || `/media/${doc.filename}`
    navigator.clipboard.writeText(url)
    setCopiedId(doc.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const filteredDocs = docs.filter((d) => {
    if (!search.trim()) return true
    const term = search.toLowerCase()
    return (
      (d.alt && d.alt.toLowerCase().includes(term)) ||
      (d.filename && d.filename.toLowerCase().includes(term))
    )
  })

  return (
    <div>
      {/* Page Header */}
      <div className="admin-page-header">
        <div className="admin-page-title-group">
          <h1>Media kutubxona</h1>
          <p>Maktab portali fotosuratlari, rasmlar va yuklangan PDF hujjatlar.</p>
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

      {success && (
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
          {success}
        </div>
      )}

      {/* Upload Box */}
      <div className="admin-card" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
        <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 600, marginBottom: 'var(--space-4)' }}>
          Yangi media fayl yuklash
        </h2>
        <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-4)' }}>
            <div>
              <label className="admin-form-label" htmlFor="media-upload-input">
                Fayl tanlang (JPEG, PNG, WebP, SVG, PDF)
              </label>
              <input
                id="media-upload-input"
                type="file"
                className="admin-input"
                accept="image/jpeg,image/png,image/webp,image/svg+xml,application/pdf"
                onChange={(e) => {
                  const f = e.target.files?.[0] || null
                  setUploadFile(f)
                  if (f && !uploadAlt) {
                    setUploadAlt(f.name.replace(/\.[^/.]+$/, ''))
                  }
                }}
                required
              />
              <span className="admin-form-help">Maksimal: Rasm 5 MB, PDF 25 MB.</span>
            </div>

            <div>
              <label className="admin-form-label" htmlFor="media-upload-alt">
                Tavsif (Alt-matn — WCAG 2.2 uchun majburiy)
              </label>
              <input
                id="media-upload-alt"
                type="text"
                className="admin-input"
                placeholder="Rasm tavsifi..."
                value={uploadAlt}
                onChange={(e) => setUploadAlt(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={!uploadFile || isUploading}
            style={{ alignSelf: 'flex-start', marginTop: 'var(--space-2)' }}
          >
            {isUploading ? 'Yuklanmoqda...' : '⬆️ Faylni yuklash'}
          </button>
        </form>
      </div>

      {/* Filter / Search */}
      <div className="admin-card" style={{ padding: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
        <input
          type="text"
          className="admin-input"
          placeholder="Media kutubxonasidan qidirish (nomi yoki tavsifi)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Media Grid */}
      <div className="admin-media-grid">
        {filteredDocs.map((doc) => {
          const isPdf = doc.mimeType === 'application/pdf'
          const url = doc.url || `/media/${doc.filename}`
          const isCopied = copiedId === doc.id

          return (
            <div key={doc.id} className="admin-media-card">
              <div
                style={{
                  width: '100%',
                  aspectRatio: '16/10',
                  background: 'var(--color-surface-hover)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}
              >
                {isPdf ? (
                  <div style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: '2.5rem' }}>📄</span>
                    <div style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>
                      PDF HUJJAT
                    </div>
                  </div>
                ) : (
                  <img
                    src={url}
                    alt={doc.alt || ''}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    loading="lazy"
                  />
                )}
              </div>

              <div className="admin-media-meta">
                <div
                  style={{
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                  title={doc.alt || doc.filename}
                >
                  {doc.alt || doc.filename}
                </div>
                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.65rem' }}>
                  {doc.filename}
                </div>
              </div>

              <div
                style={{
                  padding: '0.4rem var(--space-3)',
                  borderTop: '1px solid var(--color-border)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '4px',
                  background: 'var(--color-surface-hover)',
                }}
              >
                <button
                  type="button"
                  onClick={() => handleCopyUrl(doc)}
                  className="btn btn-outline"
                  style={{ flex: 1, padding: '0.2rem', fontSize: '0.7rem' }}
                >
                  {isCopied ? '✓ Nusxalandi' : '🔗 Manzil'}
                </button>
                {canDelete && (
                  <button
                    type="button"
                    onClick={() => handleDelete(doc.id)}
                    className="btn btn-outline"
                    style={{ color: '#ef4444', borderColor: '#ef4444', padding: '0.2rem 0.4rem', fontSize: '0.7rem' }}
                    title="O‘chirish"
                  >
                    🗑️
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
