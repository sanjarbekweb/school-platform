'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { saveDocumentAction, deleteDocumentAction } from '@/lib/actions/admin'
import type { SessionUser } from '@/lib/auth/session'

interface NoticeEditorProps {
  initialDoc?: any
  currentUser: SessionUser
}

export function NoticeEditor({ initialDoc, currentUser }: NoticeEditorProps) {
  const router = useRouter()
  const isNew = !initialDoc?.id

  const defaultStart = new Date().toISOString().slice(0, 16)
  const defaultExpiry = new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 16)

  const [title, setTitle] = useState(initialDoc?.title || '')
  const [content, setContent] = useState(initialDoc?.content || '')
  const [link, setLink] = useState(initialDoc?.link || '')
  const [priority, setPriority] = useState(initialDoc?.priority || 'oddiy')
  const [startDate, setStartDate] = useState(
    initialDoc?.startDate ? new Date(initialDoc.startDate).toISOString().slice(0, 16) : defaultStart
  )
  const [expiryDate, setExpiryDate] = useState(
    initialDoc?.expiryDate ? new Date(initialDoc.expiryDate).toISOString().slice(0, 16) : defaultExpiry
  )
  const [status, setStatus] = useState(initialDoc?.status || 'faol')

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
      content,
      link: link.trim() || undefined,
      priority,
      startDate: new Date(startDate).toISOString(),
      expiryDate: new Date(expiryDate).toISOString(),
      status,
    }

    const res = await saveDocumentAction('notices', initialDoc?.id || null, payloadData)

    if (!res.success) {
      setError(
        res.error ||
          (res.validationErrors && res.validationErrors.map((e) => e.message).join(' ')) ||
          'Xatolik yuz berdi'
      )
      setIsSaving(false)
      return
    }

    setSuccessMsg('E’lon muvaffaqiyatli saqlandi!')
    setIsSaving(false)

    if (isNew && res.id) {
      router.push(`/admin/notices/${res.id}`)
    } else {
      router.refresh()
    }
  }

  const handleDelete = async () => {
    if (!initialDoc?.id) return
    if (!window.confirm('Haqiqatan ham ushbu e’lonni o‘chirmoqchimisiz?')) return

    setIsSaving(true)
    const res = await deleteDocumentAction('notices', initialDoc.id)
    if (!res.success) {
      setError(res.error || 'O‘chirishda xatolik yuz berdi.')
      setIsSaving(false)
      return
    }

    router.push('/admin/notices')
  }

  return (
    <div>
      <div className="admin-page-header">
        <div className="admin-page-title-group">
          <Link
            href="/admin/notices"
            style={{ color: 'var(--color-blue)', textDecoration: 'none', fontSize: 'var(--text-sm)' }}
          >
            ← E’lonlar ro‘yxatiga qaytish
          </Link>
          <h1>{isNew ? 'Yangi rasmiy e’lon joylash' : 'E’lonni tahrirlash'}</h1>
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
                <label className="admin-form-label" htmlFor="notice-title">
                  E’lon sarlavhasi *
                </label>
                <input
                  id="notice-title"
                  type="text"
                  className="admin-input"
                  placeholder="Maktabimizda 1-sinfga qabul jarayoni boshlandi"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label" htmlFor="notice-content">
                  E’lon matni *
                </label>
                <textarea
                  id="notice-content"
                  className="admin-textarea"
                  style={{ minHeight: '160px' }}
                  placeholder="Hurmatli ota-onalar va o‘quvchilar, yangi o‘quv yili uchun..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label" htmlFor="notice-link">
                  Batafsil ma’lumot havolasi (URL / manzil)
                </label>
                <input
                  id="notice-link"
                  type="text"
                  className="admin-input"
                  placeholder="https://my.maktab.uz yoki /maktab-haqida"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                />
                <span className="admin-form-help">
                  Ixtiyoriy: tashrif buyuruvchilar ushbu havola orqali batafsil ma’lumotga o‘tishadi.
                </span>
              </div>
            </div>
          </div>

          <div>
            <div className="admin-form-card">
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 600, marginBottom: 'var(--space-4)' }}>
                Ko‘rsatish parametrlari
              </h3>

              <div className="admin-form-group">
                <label className="admin-form-label" htmlFor="notice-status">
                  Holati
                </label>
                <select
                  id="notice-status"
                  className="admin-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="faol">Faol (Saytda ko‘rinadi)</option>
                  <option value="qoralama">Qoralama (Hali e’lon qilinmasin)</option>
                  <option value="arxivlangan">Arxivlangan</option>
                </select>
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label" htmlFor="notice-priority">
                  Muhimlik darajasi
                </label>
                <select
                  id="notice-priority"
                  className="admin-select"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="oddiy">Oddiy e’lon (Moviy rangda)</option>
                  <option value="muhim">Muhim bildirishnoma (Sariq rangda)</option>
                  <option value="shoshilinch">Shoshilinch xabar (Qizil rangda)</option>
                </select>
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label" htmlFor="notice-start-date">
                  Boshlanish vaqti
                </label>
                <input
                  id="notice-start-date"
                  type="datetime-local"
                  className="admin-input"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label" htmlFor="notice-expiry-date">
                  Tugash muddati (Avto-arxiv)
                </label>
                <input
                  id="notice-expiry-date"
                  type="datetime-local"
                  className="admin-input"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  required
                />
                <span className="admin-form-help">
                  Belgilangan vaqt yetib kelgach, e’lon bosh sahifadan avtomatik tarzda arxivga o‘tadi.
                </span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
