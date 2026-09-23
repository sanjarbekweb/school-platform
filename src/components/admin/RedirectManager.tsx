'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { saveDocumentAction, deleteDocumentAction } from '@/lib/actions/admin'
import type { SessionUser } from '@/lib/auth/session'

interface RedirectDoc {
  id: string | number
  from: string
  to: string
  statusCode: string
}

interface RedirectManagerProps {
  initialRedirects: RedirectDoc[]
  currentUser: SessionUser
}

export function RedirectManager({
  initialRedirects,
  currentUser,
}: RedirectManagerProps) {
  const router = useRouter()
  const [redirects, setRedirects] = useState<RedirectDoc[]>(initialRedirects)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<RedirectDoc | null>(null)

  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [statusCode, setStatusCode] = useState('301')
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const openCreateModal = () => {
    setEditingItem(null)
    setFrom('')
    setTo('')
    setStatusCode('301')
    setError(null)
    setIsModalOpen(true)
  }

  const openEditModal = (item: RedirectDoc) => {
    setEditingItem(item)
    setFrom(item.from)
    setTo(item.to)
    setStatusCode(item.statusCode || '301')
    setError(null)
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError(null)

    const payloadData = {
      from: from.trim(),
      to: to.trim(),
      statusCode,
    }

    const res = await saveDocumentAction('redirects', editingItem?.id || null, payloadData)

    if (!res.success) {
      setError(
        res.error ||
          (res.validationErrors && res.validationErrors.map((err) => err.message).join(' ')) ||
          'Xatolik yuz berdi'
      )
      setIsSaving(false)
      return
    }

    setIsModalOpen(false)
    setIsSaving(false)
    router.refresh()
  }

  const handleDelete = async (item: RedirectDoc) => {
    if (!window.confirm(`Haqiqatan ham "${item.from} → ${item.to}" yo‘naltirishini o‘chirmoqchimisiz?`)) {
      return
    }

    const res = await deleteDocumentAction('redirects', item.id)
    if (!res.success) {
      alert(res.error || 'O‘chirishda xatolik yuz berdi.')
      return
    }

    setRedirects((prev) => prev.filter((r) => r.id !== item.id))
    router.refresh()
  }

  return (
    <div>
      <div className="admin-page-header">
        <div className="admin-page-title-group">
          <h1>Qayta yo‘naltirishlar (301 / 302 Redirects)</h1>
          <p>Eski WordPress havolalari, URL o‘zgarishlari va doimiy yo‘naltirishlar boshqaruvi.</p>
        </div>

        <button type="button" className="btn btn-primary" onClick={openCreateModal}>
          🔀 Yangi qayta yo‘naltirish
        </button>
      </div>

      <div className="admin-card">
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Eski havola (Qayerdan)</th>
                <th>Yangi havola (Qayerga)</th>
                <th>Turi (Status code)</th>
                <th style={{ textAlign: 'right' }}>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {redirects.map((item) => (
                <tr key={item.id}>
                  <td>
                    <code style={{ fontSize: 'var(--text-xs)', color: '#b91c1c' }}>{item.from}</code>
                  </td>
                  <td>
                    <code style={{ fontSize: 'var(--text-xs)', color: '#047857' }}>{item.to}</code>
                  </td>
                  <td>
                    <span className="badge badge-info">{item.statusCode}</span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '4px' }}>
                      <button
                        type="button"
                        className="btn btn-outline"
                        style={{ padding: '0.2rem 0.5rem', fontSize: 'var(--text-xs)' }}
                        onClick={() => openEditModal(item)}
                      >
                        Tahrirlash
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline"
                        style={{ color: '#ef4444', borderColor: '#ef4444', padding: '0.2rem 0.4rem', fontSize: 'var(--text-xs)' }}
                        onClick={() => handleDelete(item)}
                        title="O‘chirish"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Redirect Modal */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
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
              maxWidth: '480px',
              padding: '1.5rem',
              boxShadow: 'var(--shadow-2xl)',
              border: '1px solid var(--color-border)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, margin: 0 }}>
                {editingItem ? 'Yo‘naltirishni tahrirlash' : 'Yangi yo‘naltirish'}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem' }}
              >
                ✕
              </button>
            </div>

            {error && (
              <div
                role="alert"
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
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="admin-form-group">
                <label className="admin-form-label" htmlFor="redirect-from">
                  Eski havola (Qayerdan) *
                </label>
                <input
                  id="redirect-from"
                  type="text"
                  className="admin-input"
                  placeholder="/eski-sahifa"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  required
                />
                <span className="admin-form-help">Boshida &quot;/&quot; bo‘lishi shart.</span>
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label" htmlFor="redirect-to">
                  Yangi rasmiy havola (Qayerga) *
                </label>
                <input
                  id="redirect-to"
                  type="text"
                  className="admin-input"
                  placeholder="/maktab-haqida"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  required
                />
                <span className="admin-form-help">Boshida &quot;/&quot; bo‘lishi shart.</span>
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label" htmlFor="redirect-status">
                  Yo‘naltirish kodi *
                </label>
                <select
                  id="redirect-status"
                  className="admin-select"
                  value={statusCode}
                  onChange={(e) => setStatusCode(e.target.value)}
                >
                  <option value="301">301 Doimiy ko‘chirilgan (Permanent Redirect)</option>
                  <option value="302">302 Vaqtinchalik yo‘naltirish (Temporary Redirect)</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)', marginTop: 'var(--space-6)' }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>
                  Bekor qilish
                </button>
                <button type="submit" className="btn btn-primary" disabled={isSaving}>
                  {isSaving ? 'Saqlanmoqda...' : 'Saqlash'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
