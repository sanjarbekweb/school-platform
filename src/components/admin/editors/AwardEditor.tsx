'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { MediaPickerModal, MediaItem } from '../MediaPickerModal'
import { saveDocumentAction, deleteDocumentAction } from '@/lib/actions/admin'
import type { SessionUser } from '@/lib/auth/session'

interface AwardEditorProps {
  initialDoc?: any
  currentUser: SessionUser
}

export function AwardEditor({ initialDoc, currentUser }: AwardEditorProps) {
  const router = useRouter()
  const isNew = !initialDoc?.id

  const [title, setTitle] = useState(initialDoc?.title || '')
  const [competition, setCompetition] = useState(initialDoc?.competition || '')
  const [level, setLevel] = useState(initialDoc?.level || 'respublika')
  const [result, setResult] = useState(initialDoc?.result || '')
  const [year, setYear] = useState(initialDoc?.year || new Date().getFullYear())
  const [recipient, setRecipient] = useState(initialDoc?.recipient || '')
  const [status, setStatus] = useState(initialDoc?.status || 'nashr_qilingan')
  const [photo, setPhoto] = useState<MediaItem | null>(
    initialDoc?.photo && typeof initialDoc.photo === 'object' ? initialDoc.photo : null
  )

  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setIsSaving(true)
    setError(null)
    setSuccessMsg(null)

    const payloadData: Record<string, any> = {
      title,
      competition,
      level,
      result,
      year: Number(year) || new Date().getFullYear(),
      recipient,
      status,
      photo: photo?.id || null,
    }

    const res = await saveDocumentAction('awards', initialDoc?.id || null, payloadData)

    if (!res.success) {
      setError(res.error || 'Saqlashda xatolik yuz berdi.')
      setIsSaving(false)
      return
    }

    setSuccessMsg('Yutuq muvaffaqiyatli saqlandi!')
    setIsSaving(false)

    if (isNew && res.id) {
      router.push(`/admin/awards/${res.id}`)
    } else {
      router.refresh()
    }
  }

  const handleDelete = async () => {
    if (!initialDoc?.id) return
    if (!window.confirm('Haqiqatan ham ushbu yutuqni o‘chirmoqchimisiz?')) return

    setIsSaving(true)
    const res = await deleteDocumentAction('awards', initialDoc.id)
    if (!res.success) {
      setError(res.error || 'O‘chirishda xatolik yuz berdi.')
      setIsSaving(false)
      return
    }

    router.push('/admin/awards')
  }

  return (
    <div>
      <div className="admin-page-header">
        <div className="admin-page-title-group">
          <Link
            href="/admin/awards"
            style={{ color: 'var(--color-blue)', textDecoration: 'none', fontSize: 'var(--text-sm)' }}
          >
            ← Yutuqlar ro‘yxatiga qaytish
          </Link>
          <h1>{isNew ? 'Yangi yutuq qo‘shish' : 'Yutuqni tahrirlash'}</h1>
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
                <label className="admin-form-label" htmlFor="award-title">
                  Yutuq sarlavhasi *
                </label>
                <input
                  id="award-title"
                  type="text"
                  className="admin-input"
                  placeholder="Respublika fan olimpiadasida 1-o‘rin"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label className="admin-form-label" htmlFor="award-competition">
                    Musobaqa / Tanlov nomi *
                  </label>
                  <input
                    id="award-competition"
                    type="text"
                    className="admin-input"
                    placeholder="Asosiy fanlar bo‘yicha olimpiada"
                    value={competition}
                    onChange={(e) => setCompetition(e.target.value)}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label" htmlFor="award-level">
                    Bosqich (Daraja) *
                  </label>
                  <select
                    id="award-level"
                    className="admin-select"
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                  >
                    <option value="xalqaro">Xalqaro bosqich</option>
                    <option value="respublika">Respublika bosqichi</option>
                    <option value="shahar">Toshkent shahar bosqichi</option>
                    <option value="tuman">Tuman bosqichi</option>
                  </select>
                </div>
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label className="admin-form-label" htmlFor="award-result">
                    Natija / Olingan o‘rin *
                  </label>
                  <input
                    id="award-result"
                    type="text"
                    className="admin-input"
                    placeholder="1-o‘rin (Oltin medal)"
                    value={result}
                    onChange={(e) => setResult(e.target.value)}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label" htmlFor="award-year">
                    Yil *
                  </label>
                  <input
                    id="award-year"
                    type="number"
                    className="admin-input"
                    value={year}
                    onChange={(e) => setYear(parseInt(e.target.value, 10) || 2026)}
                    required
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label" htmlFor="award-recipient">
                  G‘olib (O‘quvchi yoki jamoa) *
                </label>
                <input
                  id="award-recipient"
                  type="text"
                  className="admin-input"
                  placeholder="Karimov Jasur (11-A sinf)"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
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
                <label className="admin-form-label" htmlFor="award-status">
                  Holati
                </label>
                <select
                  id="award-status"
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
                Taqdirlash fotosurati
              </h3>

              {photo ? (
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
                      src={photo.url || `/media/${photo.filename}`}
                      alt={photo.alt || ''}
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
                      onClick={() => setPhoto(null)}
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
                  <div style={{ fontSize: '1.75rem', marginBottom: '4px' }}>🏆</div>
                  <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600 }}>
                    Rasm tanlash
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
        onSelect={(media) => setPhoto(media)}
        allowedTypes="image"
        title="Yutuq fotosuratini tanlash"
      />
    </div>
  )
}
