'use client'

import React, { useState, useEffect, useId } from 'react'

export interface MediaItem {
  id: string | number
  url?: string
  filename?: string
  alt?: string
  mimeType?: string
  filesize?: number
}

interface MediaPickerModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (media: MediaItem) => void
  allowedTypes?: 'all' | 'image' | 'pdf'
  title?: string
}

export function MediaPickerModal({
  isOpen,
  onClose,
  onSelect,
  allowedTypes = 'all',
  title = 'Media faylni tanlash',
}: MediaPickerModalProps) {
  const [activeTab, setActiveTab] = useState<'library' | 'upload'>('library')
  const [mediaList, setMediaList] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null)

  // Upload states
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [uploadAlt, setUploadAlt] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const altInputId = useId()

  // Fetch library media
  useEffect(() => {
    if (!isOpen) return

    let isMounted = true
    setLoading(true)

    fetch(`/api/admin/media?limit=30&search=${encodeURIComponent(search)}`)
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.docs) {
          let docs = data.docs
          if (allowedTypes === 'image') {
            docs = docs.filter((m: any) => m.mimeType?.startsWith('image/'))
          } else if (allowedTypes === 'pdf') {
            docs = docs.filter((m: any) => m.mimeType === 'application/pdf')
          }
          setMediaList(docs)
        }
      })
      .catch((err) => console.error('Failed to load media:', err))
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [isOpen, search, allowedTypes])

  if (!isOpen) return null

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!uploadFile) return

    setUploading(true)
    setUploadError(null)

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
        setUploadError(data.error || 'Faylni yuklashda xatolik yuz berdi.')
        setUploading(false)
        return
      }

      onSelect(data.media)
      onClose()
    } catch {
      setUploadError('Serverga yuklashda xatolik yuz berdi.')
      setUploading(false)
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
      role="dialog"
      aria-modal="true"
    >
      <div
        style={{
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius-xl)',
          width: '100%',
          maxWidth: '840px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-2xl)',
          border: '1px solid var(--color-border)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, margin: 0, color: 'var(--color-text)' }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.25rem',
              cursor: 'pointer',
              color: 'var(--color-text-muted)',
            }}
            aria-label="Yopish"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="admin-tabs" style={{ padding: '0 1.5rem', margin: 0 }}>
          <button
            className={`admin-tab ${activeTab === 'library' ? 'active' : ''}`}
            onClick={() => setActiveTab('library')}
          >
            📁 Kutubxonadan tanlash
          </button>
          <button
            className={`admin-tab ${activeTab === 'upload' ? 'active' : ''}`}
            onClick={() => setActiveTab('upload')}
          >
            ⬆️ Yangi fayl yuklash
          </button>
        </div>

        {/* Tab 1: Library */}
        {activeTab === 'library' && (
          <div style={{ padding: '1.5rem', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '1rem' }}>
              <input
                type="text"
                className="admin-input"
                placeholder="Fayllar bo‘yicha qidirish..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                Fayllar yuklanmoqda...
              </div>
            ) : mediaList.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                Mos keluvchi fayllar topilmadi.
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                  gap: '0.75rem',
                  flex: 1,
                }}
              >
                {mediaList.map((item) => {
                  const isSelected = selectedItem?.id === item.id
                  const isPdf = item.mimeType === 'application/pdf'
                  const url = item.url || `/media/${item.filename}`

                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedItem(item)}
                      style={{
                        border: isSelected ? '2px solid var(--color-blue)' : '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-md)',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        background: 'var(--color-surface)',
                        transition: 'transform 0.1s ease',
                        boxShadow: isSelected ? '0 0 0 2px rgba(26, 54, 93, 0.2)' : 'none',
                      }}
                    >
                      <div
                        style={{
                          height: '90px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'var(--color-surface-hover)',
                        }}
                      >
                        {isPdf ? (
                          <span style={{ fontSize: '2rem' }}>📄</span>
                        ) : (
                          <img
                            src={url}
                            alt={item.alt || ''}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        )}
                      </div>
                      <div
                        style={{
                          padding: '0.4rem',
                          fontSize: '0.7rem',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          color: 'var(--color-text)',
                        }}
                        title={item.alt || item.filename}
                      >
                        {item.alt || item.filename}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Upload */}
        {activeTab === 'upload' && (
          <form
            onSubmit={handleUpload}
            style={{ padding: '1.5rem', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}
          >
            {uploadError && (
              <div
                style={{
                  padding: '0.75rem',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid #ef4444',
                  borderRadius: 'var(--radius-md)',
                  color: '#b91c1c',
                  marginBottom: '1rem',
                  fontSize: 'var(--text-sm)',
                }}
              >
                {uploadError}
              </div>
            )}

            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="modal-file-input">
                Faylni tanlang (JPEG, PNG, WebP, SVG yoki PDF)
              </label>
              <input
                id="modal-file-input"
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
              <span className="admin-form-help">
                Rasmlar: maksimal 5 MB. PDF hujjatlar: maksimal 25 MB.
              </span>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor={altInputId}>
                Tavsif (Alt-matn — ekran o‘quvchilari va WCAG 2.2 uchun majburiy)
              </label>
              <input
                id={altInputId}
                type="text"
                className="admin-input"
                placeholder="Rasmda nima tasvirlanganini yozing..."
                value={uploadAlt}
                onChange={(e) => setUploadAlt(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={!uploadFile || uploading}
              style={{ marginTop: 'auto', alignSelf: 'flex-start' }}
            >
              {uploading ? 'Yuklanmoqda...' : 'Yuklash va Tanlash'}
            </button>
          </form>
        )}

        {/* Footer */}
        {activeTab === 'library' && (
          <div
            style={{
              padding: '1rem 1.5rem',
              borderTop: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--color-surface-hover)',
            }}
          >
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
              {selectedItem ? `Tanlandi: ${selectedItem.alt || selectedItem.filename}` : 'Fayl tanlanmagan'}
            </span>
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <button type="button" className="btn btn-outline" onClick={onClose}>
                Bekor qilish
              </button>
              <button
                type="button"
                className="btn btn-primary"
                disabled={!selectedItem}
                onClick={() => {
                  if (selectedItem) {
                    onSelect(selectedItem)
                    onClose()
                  }
                }}
              >
                Tanlashni tasdiqlash
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
